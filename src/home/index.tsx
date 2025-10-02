import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import logoUrl from "@/assets/Unificadologo.png?url";

export default function HomePage() {
  const appName = "Unificado";
  useEffect(() => {
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
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-black to-zinc-900 text-white transition-colors duration-300 relative">
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center justify-center text-center min-h-[60vh] sm:min-h-[70vh]">
  <header className="mb-6 sm:mb-8 -translate-y-6 sm:-translate-y-10 md:-translate-y-14">
          <img src={logoUrl} alt="Unificado" className="mx-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 2xl:h-64 w-auto select-none" />
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-200 max-w-md mx-auto">
            Bem-vindo(a)! Escolha uma das opções abaixo para continuar.
          </p>
        </header>
  <section className="flex flex-col items-center justify-center rounded-3xl bg-zinc-900/80 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden w-full -translate-y-6 sm:-translate-y-10 md:-translate-y-14">
          <div className="p-4 sm:p-6 md:p-8 w-full">
            <div className="rounded-2xl border-2 border-[#00ff88] ring-1 ring-emerald-400/20 bg-black/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] p-4 sm:p-6 md:p-7 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">
              Comece por aqui!
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400">
              Acesse sua conta ou crie um novo cadastro.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
              <Link
                to="/login"
                className="home-btn group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold ring-1 ring-white/15 bg-emerald-400/90 hover:bg-emerald-500 text-black shadow transition"
              >
                <LogIn className="size-4" />
                Entrar
              </Link>
              <Link
                to="/register"
                className="home-btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold bg-white/90 hover:bg-white text-emerald-600 ring-1 ring-emerald-400/40 shadow transition"
              >
                <UserPlus className="size-4" />
                Criar conta
              </Link>
            </div>
            </div>
          </div>
          <div className="px-6 sm:px-8 py-4 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-zinc-900/60 border-t border-white/10 text-[10px] sm:text-xs text-zinc-400 flex items-center justify-between w-full">
            <span className="truncate">
              © {new Date().getFullYear()} {appName}
            </span>
            <span className="hidden sm:block">
              Feito com React Router + Tailwind
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
