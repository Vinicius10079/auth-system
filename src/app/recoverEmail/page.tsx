"use client" // Isso necessário para usar hooks como useState.

import { useState } from "react" // Importa o hook useState do React para gerenciar o estado do email e da mensagem.

// Componente funcional para a página de recuperação de email.
export default function RecoverEmailPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  // Função assíncrona para lidar com o envio do formulário.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Envia uma requisição POST para a API de recuperação de senha com o email fornecido.
    const res = await fetch("/api/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setMessage(data.message)
  }

  // Retorna o JSX para renderizar a página de recuperação de email.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl">
        
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Recuperar senha
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
          >
            Enviar instruções
          </button>
        </form>

        {message && (
          <p className="mt-5 text-sm text-center text-green-600">
            {message}
          </p>
        )}
        
      </div>
    </div>
  );
}