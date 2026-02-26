import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Sempre retorna a mesma resposta (segurança)
    if (!email) {
      return NextResponse.json({
        message: "Se o email existir, enviaremos instruções.",
      })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({
        message: "Se o email existir, enviaremos instruções.",
      })
    }

    const token = randomUUID()

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
      },
    })

    console.log(
      `Link de reset: http://localhost:3000/public/resetPassword?token=${token}`
    )

    return NextResponse.json({
      message: "Se o email existir, enviaremos instruções.",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Erro interno." },
      { status: 500 }
    )
  }
}
