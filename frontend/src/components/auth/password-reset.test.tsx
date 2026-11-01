import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ForgotPassword } from "./forgot-password";
import { ResetPassword } from "./reset-password";
import { requestPasswordReset, resetPassword } from "../../lib/auth-client";

const searchParams = new URLSearchParams();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}));

vi.mock("../../lib/auth-client", () => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

describe("ForgotPassword", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests a reset link that returns to /reset-password", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue({ error: null } as never);
    const user = userEvent.setup();

    render(<ForgotPassword />);
    await user.type(screen.getByPlaceholderText("E-mail"), "user@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar link de recuperação" }));

    expect(requestPasswordReset).toHaveBeenCalledWith({
      email: "user@example.com",
      redirectTo: "/reset-password",
    });
    expect(await screen.findByText(/link de recuperação foi enviado/)).toBeInTheDocument();
  });
});

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of [...searchParams.keys()]) searchParams.delete(key);
  });

  it("shows an expired state without a token", () => {
    render(<ResetPassword />);
    expect(screen.getByText("Link expirado")).toBeInTheDocument();
  });

  it("shows an expired state when Better Auth reports an invalid token", () => {
    searchParams.set("error", "INVALID_TOKEN");
    render(<ResetPassword />);
    expect(screen.getByRole("link", { name: "Solicitar um novo link" })).toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    searchParams.set("token", "tok");
    const user = userEvent.setup();

    render(<ResetPassword />);
    await user.type(screen.getByPlaceholderText("Nova senha"), "Password123!");
    await user.type(screen.getByPlaceholderText("Confirme a nova senha"), "Password456!");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("resets the password with the token from the link", async () => {
    searchParams.set("token", "tok");
    vi.mocked(resetPassword).mockResolvedValue({ error: null } as never);
    const user = userEvent.setup();

    render(<ResetPassword />);
    await user.type(screen.getByPlaceholderText("Nova senha"), "Password123!");
    await user.type(screen.getByPlaceholderText("Confirme a nova senha"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(resetPassword).toHaveBeenCalledWith({ newPassword: "Password123!", token: "tok" });
    expect(await screen.findByText(/Senha atualizada com sucesso/)).toBeInTheDocument();
  });
});
