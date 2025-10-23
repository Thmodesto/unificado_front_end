import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Envia o formulário: valida campos simples e navega para o dashboard apropriado
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Preencha identificador e senha.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await login({ identifier, password });

      // Armazenar token e dados do usuário (pode usar localStorage ou context)
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirecionar baseado no role
      if (response.user.role === 'student') {
        navigate("/dashboard");
      } else if (response.user.role === 'teacher') {
        navigate("/professor-dashboard");
      } else if (response.user.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard"); // fallback
      }
    } catch (err) {
      setError("Credenciais inválidas ou erro na autenticação.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Painel Acadêmico - BioGraph</h1>
      </header>

      {/* Dashboard Body - Form centralizado */}
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Login</h3>

          <div className="border border-gray-200 rounded-2xl shadow-sm bg-gray-50 px-6 py-4">
            <p className="text-center text-gray-700 mb-4">
              Acesse sua conta para continuar
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="E-mail, Username, RA ou ID Funcionário"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-600 text-sm text-left">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md px-4 py-3 font-bold bg-[#2D2785] hover:bg-[#1a1a5a] text-white shadow transition disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Não tem conta?{" "}
              <Link to="/register" className="text-[#2D2785] hover:underline">
                Registre-se
              </Link>
            </p>

            <p className="mt-2 text-center text-sm">
              <Link to="/" className="text-gray-600 hover:underline">
                ← Voltar para a Home
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
