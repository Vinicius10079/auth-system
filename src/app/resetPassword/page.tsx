import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"

interface Props {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return <div>Token inválido.</div>
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return <div>Token inválido ou expirado.</div>
  }

  async function updatePassword(formData: FormData) {
    "use server"

    const password = formData.get("password") as string
    const confirm = formData.get("confirm") as string

    if (!password || password !== confirm) {
      return
    }

    const currentToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!currentToken || currentToken.expiresAt < new Date()) {
      return
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: currentToken.userId },
      data: { passwordHash: hashed },
    })

    await prisma.passwordResetToken.delete({
      where: { token },
    })

    redirect("/passwordReseted")
  }

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
