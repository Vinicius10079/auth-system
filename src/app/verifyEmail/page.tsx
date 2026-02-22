import { prisma } from "@/lib/prisma" // Importa o cliente Prisma para acessar o banco de dados.
import Link from "next/link" // Importa o componente Link do Next.js para navegação.

// Página para verificar o email do usuário.
interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string
  }>
}

// Página para verificar o email do usuário.
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams
  const token = params.token

  // Verifica se o token existe.
  if (!token) {
    return <div>Token inválido.</div>
  }

  // Busca o token de verificação no banco de dados.
  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  })

  // Verifica se o token é válido e não expirou.
  if (!verification) {
    return <div>Token inválido ou expirado.</div>
  }

  // Atualiza o usuário para marcar o email como verificado.
  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerified: true },
  })

  // Remove o token de verificação do banco de dados.
  await prisma.verificationToken.delete({
    where: { token },
  })

  // Redireciona para uma página de sucesso ou exibe uma mensagem.
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
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  )

}

