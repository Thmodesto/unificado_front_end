import { Link } from "react-router-dom";
import "./register.css";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-100 p-6 relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[48rem] bg-emerald-500 rounded-xl opacity-80 z-0"></div>
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/70 border border-white/10 shadow-2xl p-8 relative z-10">
        <h1 className="text-3xl font-bold text-center">Criar Conta</h1>
        <p className="mt-2 text-center text-zinc-400">
          Preencha os dados abaixo para se registrar
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <input
            type="number"
            placeholder="Idade"
            min="0"
            className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <input
            type="text"
            placeholder="Curso"
            className="w-full rounded-xl px-4 py-3 bg-zinc-800 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
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
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="student"
                className="accent-emerald-500"
                defaultChecked
              />
              <span>Sou estudante</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="teacher"
                className="accent-emerald-500"
              />
              <span>Sou professor(a)</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl px-4 py-3 font-semibold bg-emerald-500/90 hover:bg-emerald-500 text-zinc-950 shadow transition"
          >
            Registrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Já tem conta?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Faça login
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
