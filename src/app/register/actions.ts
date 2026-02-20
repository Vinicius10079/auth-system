"use server"

import bcrypt from "bcrypt"
import { createUser, findUserByEmail } from "@/lib/user"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem")
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new Error("Email já cadastrado")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  })

  // 🔐 Gerar token de verificação
  const token = randomUUID()

  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
    },
  })

  console.log(
    `Link de verificação: http://localhost:3000/verifyEmail?token=${token}`
  )
}
