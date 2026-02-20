import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function SessionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Área Logada</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>{session.user?.name}</h2>
        <p>{session.user?.email}</p>
      </div>
    </div>
  )
}
