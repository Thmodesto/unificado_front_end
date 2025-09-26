import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const appName = "Unificado";
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme} relative bg-gradient-to-b from-black to-zinc-900 text-white`}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-emerald-500 rounded-xl opacity-80 z-0"></div>
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-emerald-400">
            {appName}
          </h1>
          <p className="mt-3 text-zinc-200 max-w-md mx-auto">
            Bem-vindo(a)! Escolha uma das opções abaixo para continuar.
          </p>
        </header>
        <section className="flex flex-col items-center justify-center rounded-3xl bg-zinc-900/80 backdrop-blur border border-white/10 shadow-2xl overflow-hidden w-full">
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-emerald-400">
              Comece por aqui!
            </h2>
            <p className="mt-2 text-zinc-400">
              Acesse sua conta ou crie um novo cadastro.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link
                to="/login"
                className="home-btn group inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold ring-1 ring-white/15 bg-emerald-400/90 hover:bg-emerald-500 text-black shadow transition"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="home-btn inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-white/90 hover:bg-white text-emerald-600 ring-1 ring-emerald-400/40 shadow transition"
              >
                Criar conta
              </Link>
            </div>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-zinc-900/60 border-t border-white/10 text-xs text-zinc-400 flex items-center justify-between w-full">
            <span>
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
