"use server"

import { registerUserService } from "@/modules/auth/services/auth.service"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password) {
    throw new Error("Campos obrigatórios")
  }

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem")
  }

  const result = await registerUserService({
    name,
    email,
    password,
  })

  // Narrowing correto
  if (!result.success) {
    if (result.error === "EMAIL_ALREADY_EXISTS") {
      throw new Error("Email já cadastrado")
    }

    throw new Error("Erro ao registrar usuário")
  }

  console.log(
    `Link de verificação: http://localhost:3000/authentication/verifyEmail?token=${result.data.verificationToken}`
  )
}