import Link from "next/link" // Importa o componente Link do Next.js para criar links de navegação entre as páginas.

// Componente de página de senha resetada
export default function PasswordResetedPage() {

// Renderiza uma mensagem de sucesso informando que a senha foi alterada com sucesso, junto com um botão que redireciona o usuário para a página de login. A interface é estilizada usando classes do Tailwind CSS para criar um design moderno e responsivo.
return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl text-center">
        
        {/* Ícone de sucesso */}
        <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-3xl">
          
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Senha alterada com sucesso!!!
        </h1>

        <p className="text-sm text-gray-500 mb-7">
          Sua senha foi atualizada. Agora você já pode acessar sua conta normalmente.
        </p>

        <Link href="/public/login" className="block w-full">
          <button
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
          >
            Ir para Login
          </button>
        </Link>
      </div>
    </div>
  );
}