// Página de Login: controla e valida o formulário e redireciona para o Dashboard.
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Envia o formulário: valida campos simples e navega para /dashboard
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setError(null);
    navigate("/dashboard");
  };

  return (
    // Wrapper da página com gradiente e centralização do card de login
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-100 p-4 sm:p-6 relative">
      <div className="w-full max-w-md rounded-lg bg-[#111111] border-2 border-[#00ff88] shadow-2xl p-6 sm:p-10 relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#00ff88] mb-4 sm:mb-5">Login</h1>
        <p className="mt-2 text-center text-zinc-400">
          Acesse sua conta para continuar
        </p>

        <form className="mt-5 sm:mt-6 space-y-3 sm:space-y-4" onSubmit={onSubmit}>
          <div className="rounded-xl border-2 border-[#00ff88] p-4 sm:p-5 bg-black/20 backdrop-blur-[1px] space-y-3 sm:space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full rounded-md px-4 py-3 bg-black text-white border border-[#00ff88] focus:ring-2 focus:ring-emerald-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-xs sm:text-sm text-left">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-md px-4 py-3 font-bold bg-[#00ff88] hover:bg-[#00cc6a] text-black shadow transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs sm:text-sm text-zinc-400">
          Não tem conta?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Registre-se
          </Link>
        </p>

        <p className="mt-2 text-center text-xs sm:text-sm">
          <Link to="/" className="text-zinc-400 hover:underline">
            ← Voltar para a Home
          </Link>
        </p>
      </div>
    </main>
  );
}
