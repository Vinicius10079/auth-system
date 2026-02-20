// app/verify/page.tsx
// http://localhost:3000/verifyEmail?token=376fd85a-4ff8-4191-be57-7a0a62092f60

import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return <div>Token inválido.</div>
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verification) {
    return <div>Token inválido ou expirado.</div>
  }

  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerified: true },
  })

  await prisma.verificationToken.delete({
    where: { token },
  })

  return (
    <div style={{ padding: "40px" }}>
      <h1>Email confirmado com sucesso 🎉</h1>
      <p>Agora você já pode fazer login.</p>

      <div style={{ marginTop: "20px" }}>
        <Link
          href="/login"
          style={{
            padding: "10px 20px",
            backgroundColor: "#000",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          Ir para Login
        </Link>
      </div>
    </div>
)

}

