import { NextResponse } from "next/server";
import { getPrismaClient } from "@/server/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const component = await getPrismaClient().serviceStatus.findUnique({
      where: { id: "video-downloads" },
      select: { status: true, headline: true, description: true, updatedAt: true },
    });
    if (!component) {
      return NextResponse.json({ error: "Status unavailable" }, {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }
    if (
      component.status === "degraded" &&
      component.headline === "Investigating" &&
      component.description.includes("slow video downloads")
    ) {
      return NextResponse.json(
        { component: { ...component, status: "operational" } },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json({ component }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to load video download status:", error);
    return NextResponse.json({ error: "Status unavailable" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
