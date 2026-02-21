"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SessionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <p>Carregando...</p>
  }

  if (!session) {
    return null
  }

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