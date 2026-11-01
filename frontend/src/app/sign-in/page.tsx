import { SignIn } from "@/components/auth/sign-in";
import { AuthFrame } from "@/components/auth/auth-frame";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthFrame
      footer={<>Não tem uma conta?{" "}<Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">Cadastre-se</Link></>}
    >
      <SignIn />
    </AuthFrame>
  );
}
