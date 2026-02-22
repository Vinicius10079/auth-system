"use client" // Isso é necessário para usar hooks como useState e useRouter em um componente Next.js.

import { useState } from "react" // Importa o hook useState para gerenciar o estado do componente.
import { signIn } from "next-auth/react" // Importa a função signIn do NextAuth para lidar com a autenticação do usuário.
import { useRouter } from "next/navigation" // Importa o hook useRouter para navegar programaticamente entre as páginas do Next.js.
import Link from "next/link" // Importa o componente Link do Next.js para criar links de navegação entre as páginas.

// Componente de página de login
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Função para lidar com o envio do formulário de login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Chama a função signIn do NextAuth com as credenciais do usuário. O parâmetro redirect: false impede que o NextAuth redirecione automaticamente após o login, permitindo que a navegação seja controlada manualmente.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    // Se houver um erro na autenticação, exibe uma mensagem de erro para o usuário.
    if (result?.error) {
      setError("Email ou senha inválidos")
      return
    }

    router.push("/session")
  }
  
  // Renderiza o formulário de login com campos para email e senha, um botão de envio e um link para recuperação de senha. O formulário é estilizado usando classes do Tailwind CSS para criar uma interface moderna e responsiva.
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
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"          />

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

          <div className="text-center mt-2">
            <Link
              href="/recoverEmail"
              className="text-sm text-blue-600 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
