import { prisma } from "@/lib/prisma" // Certifica de que o caminho para o prisma esteja correto.
import { redirect } from "next/navigation" // Certifica de que o caminho para o redirect esteja correto.
import bcrypt from "bcrypt" // Certifica de que o bcrypt esteja instalado e importado corretamente.

// Interface para os parâmetros de busca.
interface Props {
  searchParams: Promise<{
    token?: string
  }>
}

// Componente de página para redefinir senha.
export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams
  const token = params.token

  // Verifica se o token está presente.
  if (!token) {
    return <div>Token inválido.</div>
  }

  // Busca o token de redefinição de senha no banco de dados.
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  // Verifica se o token é válido e não expirou.
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return <div>Token inválido ou expirado.</div>
  }

  // Função para atualizar a senha do usuário.
  async function updatePassword(formData: FormData) {
    "use server"

    const password = formData.get("password") as string
    const confirm = formData.get("confirm") as string

    // Verifica se as senhas são iguais e não estão vazias.
    if (!password || password !== confirm) {
      return
    }

    // Busca o token de redefinição de senha no banco de dados novamente para garantir que ainda é válido.
    const currentToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    // Verifica se o token é válido e não expirou.
    if (!currentToken || currentToken.expiresAt < new Date()) {
      return
    }

    const hashed = await bcrypt.hash(password, 10)

    // Atualiza a senha do usuário no banco de dados.
    await prisma.user.update({
      where: { id: currentToken.userId },
      data: { passwordHash: hashed },
    })

    // Remove o token de redefinição de senha do banco de dados.
    await prisma.passwordResetToken.delete({
      where: { token },
    })

    redirect("/passwordReseted")
  }

  // Renderiza o formulário de redefinição de senha.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Redefinir senha
        </h1>

        <form action={updatePassword} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Nova senha"
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-500"
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirmar senha"
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
          >
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  )
}
