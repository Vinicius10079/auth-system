"use client"

import { registerUser } from "./actions"
import { useActionState } from "react"
import Link from "next/link"

// Página de registro de usuário.
export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Criar conta
        </h1>

        <form
          action={formAction}
          className="flex flex-col gap-4"
        >
          <input
            name="name"
            placeholder="Nome"
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"          
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"          
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar Senha"
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-400"          
          />

          {state?.error && (
            <p className="text-sm text-red-600 text-center">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <div className="text-center mt-2 flex flex-col gap-5">
            <Link
              href="/public/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Já posui uma conta? Faça login
            </Link>
          </div>
      </div>
    </div>
  )
}