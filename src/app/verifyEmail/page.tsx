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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Email confirmado com sucesso
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Agora você já pode fazer login na sua conta.
        </p>

        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  )

}

