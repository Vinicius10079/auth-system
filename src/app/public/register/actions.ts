"use server"

import { redirect } from "next/navigation"
import { registerUserService } from "@/modules/auth/services/auth.service"

export async function registerUser(prevState: { error: string } | null, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password) {
    return {
      error: "Campos obrigatórios"
    }
  }

  if (password !== confirmPassword) {
    return {
      error: "As senhas não coincidem"
    }
  }

  const result = await registerUserService({
    name,
    email,
    password,
  })

  // Narrowing correto
  if (!result.success) {
    if (result.error === "EMAIL_ALREADY_EXISTS") {
      return {
        error: "Email já cadastrado"
      }
    }

    return {
      error: "Erro ao registrar usuário"
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  console.log(
    `Link de verificação: ${baseUrl}/public/verifyEmail?token=${result.data.verificationToken}`
  )

  redirect("/public/verifyEmailSend")
}