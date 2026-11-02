import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildBackendAuthHeaders } from "@/lib/backend-auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";
  const normalizedApiUrl = apiUrl.replace(/\/$/, "");
  // Stream the multipart body straight through: buffering it with
  // request.formData() holds multi-GB uploads in the Node process memory.
  const forwardedHeaders: Record<string, string> = {
    ...buildBackendAuthHeaders(session.user.id),
    "Content-Type": request.headers.get("content-type") || "application/octet-stream",
  };
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    forwardedHeaders["Content-Length"] = contentLength;
  }
  const upstream = await fetch(`${normalizedApiUrl}/upload`, {
    method: "POST",
    headers: forwardedHeaders,
    body: request.body,
    // Required by Node's fetch when the body is a stream.
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
      ...(upstream.headers.get("x-trace-id")
        ? { "x-trace-id": upstream.headers.get("x-trace-id") as string }
        : {}),
    },
  });
}
