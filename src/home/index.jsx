import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";


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
  <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme} relative`}>
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-emerald-500 rounded-xl opacity-80 z-0"></div>
    <div className="w-full max-w-xl relative z-10">
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 light:bg-zinc-100 light:text-zinc-900 transition"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? "🌙 Tema Escuro" : "☀️ Tema Claro"}
          </button>
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">{appName}</h1>
          <p className="mt-3 text-zinc-300 max-w-md mx-auto">
            Bem-vindo(a)! Escolha uma das opções abaixo para continuar.
          </p>
        </header>

        <section className="flex flex-col items-center justify-center rounded-3xl bg-zinc-900/70 backdrop-blur border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">Comece por aqui!</h2>
            <p className="mt-2 text-zinc-400">Acesse sua conta ou crie um novo cadastro.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xs">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium ring-1 ring-white/15 bg-white/10 hover:bg-white/15 active:scale-[0.99] transition shadow"
              >
                Entrar
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium bg-emerald-500/90 hover:bg-emerald-500 text-zinc-950 ring-1 ring-emerald-400/40 shadow"
              >
                Criar conta
              </Link>
            </div>
          </div>

          <div className="px-6 md:px-8 py-4 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-zinc-900/60 border-t border-white/10 text-xs text-zinc-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} {appName}</span>
            <span className="hidden sm:block">Feito com React Router + Tailwind</span>
          </div>
        </section>
      </div>
    </main>
  );
}''