"use client" // Isso necessário para usar hooks como useSession e useRouter.

import { useSession, signOut } from "next-auth/react" // Importa o hook useSession para acessar os dados da sessão e a função signOut para realizar o logout.
import { useRouter } from "next/navigation" // Importa o hook useRouter para redirecionar o usuário caso não esteja autenticado.
import { useEffect } from "react" // Importa o hook useEffect para realizar efeitos colaterais, como redirecionamento após verificar a autenticação do usuário.

// Componente de página para a sessão do usuário.
export default function SessionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Verifica o status da sessão e redireciona para a página de login se o usuário não estiver autenticado.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Exibe uma mensagem de carregamento enquanto o status da sessão está sendo verificado.
  if (status === "loading") {
    return <p>Carregando...</p>
  }

  // Se a sessão não estiver disponível, retorna null (pode ser substituído por uma mensagem de erro ou redirecionamento).
  if (!session) {
    return null
  }

  // Retorna o JSX para renderizar a página de sessão do usuário, exibindo o nome e email, e um botão de logout.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Área de Sessão
        </h1>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Nome:</span>{" "}
            {session.user?.name}
          </p>

          <p>
            <span className="font-semibold text-gray-900">Email:</span>{" "}
            {session.user?.email}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}