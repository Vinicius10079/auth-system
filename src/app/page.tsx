import Link from "next/link"; // Importa o componente Link do Next.js para navegação.

// Página inicial do sistema de autenticação.
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl text-center">
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          BEM-VINDO
        </h1>

        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full">
            <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition">
              Login
            </button>
          </Link>

          <Link href="/register" className="w-full">
            <button className="w-full py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition">
              Criar conta
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}