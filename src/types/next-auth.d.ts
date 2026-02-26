import "next-auth"

declare module "next-auth" {
  interface User {
    emailNotVerified?: boolean
    id: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      emailNotVerified?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    emailNotVerified?: boolean
  }
}