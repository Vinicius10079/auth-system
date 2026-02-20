import Link from "next/link"

export default function PasswordResetedPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Senha alterada com sucesso 🎉</h1>
      <Link href="/login">
        <button>Ir para Login</button>
      </Link>
    </div>
  )
}