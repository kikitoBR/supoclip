import { ForgotPassword } from "@/components/auth/forgot-password";
import { AuthFrame } from "@/components/auth/auth-frame";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <AuthFrame
      footer={<>Lembrou da senha?{" "}<Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">Entrar</Link></>}
    >
      <ForgotPassword />
    </AuthFrame>
  );
}
