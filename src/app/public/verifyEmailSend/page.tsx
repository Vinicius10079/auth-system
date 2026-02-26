export default function VerifyEmailSendPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Verifique seu email
        </h1>

        <p className="text-gray-600 text-sm mb-6">
          Enviamos um link de verificação para o seu email.
          <br />
          Por favor, acesse sua caixa de entrada e clique no link para ativar sua conta.
        </p>

        <a
          href="/public/login"
          className="inline-block mt-4 text-blue-600 hover:underline text-sm"
        >
          Ir para login
        </a>
      </div>
    </div>
  )
}