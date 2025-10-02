import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-100 p-4 sm:p-6 relative">
      <div className="w-full max-w-md rounded-lg bg-[#111111] border-2 border-[#00ff88] shadow-2xl p-6 sm:p-10 relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#00ff88] mb-4 sm:mb-5">Criar Conta</h1>
        <p className="mt-2 text-center text-sm sm:text-base text-zinc-300">
          Preencha os dados abaixo para se registrar
        </p>

        <form className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
          <div className="rounded-xl border-2 border-[#00ff88] p-4 sm:p-5 bg-black/20 backdrop-blur-[1px] space-y-3 sm:space-y-4 text-left">
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="number"
              placeholder="Idade"
              min="0"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Curso"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="student" className="accent-emerald-500" defaultChecked />
                <span>Sou estudante</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="teacher" className="accent-emerald-500" />
                <span>Sou professor(a)</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md px-4 py-3 font-bold bg-[#00ff88] hover:bg-[#00cc6a] text-black shadow transition"
          >
            Registrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs sm:text-sm text-zinc-300">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#00ff88] hover:underline">
            Faça login
          </Link>
        </p>

        <p className="mt-2 text-center text-xs sm:text-sm">
          <Link to="/" className="text-zinc-300 hover:underline">
            ← Voltar para a Home
          </Link>
        </p>
      </div>
    </main>
  );
}
