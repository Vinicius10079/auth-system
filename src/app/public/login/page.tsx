"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Email ou senha inválidos")
      return
    }

    // Se o login foi bem-sucedido, busca a sessão para verificar o status do email
    if (result?.ok) {
      try {
        const sessionResponse = await fetch("/api/auth/session")
        const session = await sessionResponse.json()
        
        // Verifica se o email não foi verificado
        if (session?.user?.emailNotVerified) {
          router.push("/public/verifyEmailSend")
        } else {
          router.push("/protected/session")
        }
      } catch (error) {
        console.error("Erro ao buscar sessão:", error)
        router.push("/protected/session") // Fallback seguro
      }
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center mt-2 flex flex-col gap-5">
            <Link
              href="/public/recoverEmail"
              className="text-sm text-blue-600 hover:underline"
            >
              Esqueci minha senha
            </Link>
            
            <Link
              href="/public/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Não tem uma conta? Registre-se
            </Link>
          </div>
          
        </form>
      </div>
    </div>
  )
}