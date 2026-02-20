import { registerUser } from "./actions"

export default function RegisterPage() {
  return (
    <form action={registerUser} className="flex flex-col gap-4 max-w-md">
      <input name="name" placeholder="Nome" />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Senha" required />
      <input name="confirmPassword" type="password" placeholder="Confirmar Senha" required />
      <button type="submit">Cadastrar</button>
    </form>
  )
}