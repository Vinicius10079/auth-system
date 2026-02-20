import { prisma } from "@/lib/prisma"

export default async function Home() {
  const users = await prisma.user.findMany()

  return (
    <div>
      <h1>Users count: {users.length}</h1>
    </div>
  )
}
