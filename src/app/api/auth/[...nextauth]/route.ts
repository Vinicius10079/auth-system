import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import type { AuthOptions } from "next-auth"
import crypto from "crypto"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // Nunca revelar se o usuário existe
        if (!user || !user.passwordHash) {
          return null
        }

        // Verifica bloqueio
        if (user.lockUntil && user.lockUntil > new Date()) {
          throw new Error(
            "Conta temporariamente bloqueada. Tente novamente mais tarde."
          )
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        // Senha inválida
        if (!isValidPassword) {
          const attempts = user.failedLoginAttempts + 1

          if (attempts >= 5) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 min
              },
            })
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: attempts,
              },
            })
          }

          return null
        }

        // Login válido → resetar contador
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockUntil: null,
          },
        })

        // Se email não for verificado, gera token e retorna flag especial
        if (!user.emailVerified) {
          const verificationToken = crypto.randomUUID()

          await prisma.verificationToken.create({
            data: {
              token: verificationToken,
              userId: user.id,
            },
          })

          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

          console.log(
            `Link de verificação: ${baseUrl}/public/verifyEmail?token=${verificationToken}`
          )

          // Retorna usuário com flag de email não verificado
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailNotVerified: true,
          }
        }

        // Email verificado - retorno normal
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailNotVerified: false,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailNotVerified = user.emailNotVerified
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.emailNotVerified = token.emailNotVerified as boolean
      }
      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }