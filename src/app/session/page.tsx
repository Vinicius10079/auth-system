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
    <div style={{ padding: "2rem" }}>
      <h1>Área de Sessão</h1>

      <p><strong>Nome:</strong> {session.user?.name}</p>
      <p><strong>Email:</strong> {session.user?.email}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  )
}