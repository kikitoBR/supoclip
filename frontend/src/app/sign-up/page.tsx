import { SignUp } from "@/components/auth/sign-up";
import { AuthFrame } from "@/components/auth/auth-frame";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthFrame
      footer={<>Já tem uma conta?{" "}<Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">Entrar</Link></>}
    >
      <SignUp />
    </AuthFrame>
  );
}
