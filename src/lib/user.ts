import { prisma } from "@/lib/prisma"

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.password, // 👈 importante
    },
  })
}
