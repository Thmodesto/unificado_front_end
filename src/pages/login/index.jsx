import React from "react";
import { Link } from "react-router-dom";
import "./login.css";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-100 p-6 relative">
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[33.75rem] h-[29.7rem] bg-emerald-500 rounded-xl opacity-80 z-0"></div>
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/70 border border-white/10 shadow-2xl p-8 relative z-10">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <p className="mt-2 text-center text-zinc-400">
          Acesse sua conta para continuar
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl px-4 py-3 font-semibold bg-emerald-500/90 hover:bg-emerald-500 text-zinc-950 shadow transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Não tem conta?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Registre-se
          </Link>
        </p>

        <p className="mt-2 text-center">
          <Link to="/" className="text-zinc-400 hover:underline text-sm">
            ← Voltar para a Home
          </Link>
        </p>
      </div>
    </main>
  );
}