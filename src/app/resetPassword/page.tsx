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
    <div style={{ padding: "40px" }}>
      <h1>Redefinir senha</h1>

      <form action={updatePassword}>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Nova senha"
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="password"
            name="confirm"
            placeholder="Confirmar senha"
            required
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit">Alterar senha</button>
        </div>
      </form>
    </div>
  )
}
