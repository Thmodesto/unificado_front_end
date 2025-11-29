// Home (landing page): exibe o logo, um texto de boas-vindas e atalhos para Login/Registro.
// Também aplica o tema salvo (light/dark) ao carregar a página.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import logoUrl from "@/assets/Unificadologo.png?url";

export default function HomePage() {
  const appName = "Unificado";
  useEffect(() => {
    // Lê o tema salvo no localStorage e aplica na raiz do documento.
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") || "white" : "white";
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // O tema é aplicado globalmente com base no valor salvo no localStorage.

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Painel Acadêmico - BioGraph</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <img src={logoUrl} alt="Unificado" className="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 2xl:h-64 w-auto select-none mb-6" />
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Bem-vindo(a)!</h3>

          <div className="border border-gray-200 rounded-2xl shadow-sm bg-gray-50 px-6 py-4 text-center">
            <p className="text-gray-700 mb-4">
              Escolha uma das opções abaixo para continuar.
            </p>
            <h4 className="text-lg font-semibold text-[#2D2785] mb-2">Comece por aqui!</h4>
            <p className="text-gray-600 mb-6">
              Acesse sua conta ou crie um novo cadastro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-bold bg-[#2D2785] hover:bg-[#1a1a5a] text-white shadow transition"
              >
                <LogIn className="size-4" />
                Entrar
              </Link>
            </div>
            <div className="mt-6 text-xs text-gray-500 flex items-center justify-between">
              <span>© {new Date().getFullYear()} {appName}</span>
              <span>Feito com React Router + Tailwind</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
