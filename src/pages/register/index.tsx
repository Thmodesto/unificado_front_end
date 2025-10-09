// Página de Registro: formulário estilizado com Tailwind e moldura verde.
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Painel Acadêmico - BioGraph</h1>
      </header>

      {/* Dashboard Body - Form centralizado */}
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Criar Conta</h3>

          <div className="border border-gray-200 rounded-2xl shadow-sm bg-gray-50 px-6 py-4">
            <p className="text-center text-gray-700 mb-4">
              Preencha os dados abaixo para se registrar
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
              />
              <input
                type="number"
                placeholder="Idade"
                min="0"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
              />
              <input
                type="text"
                placeholder="Curso"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="student" className="accent-[#2D2785]" defaultChecked />
                  <span>Sou estudante</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="teacher" className="accent-[#2D2785]" />
                  <span>Sou professor(a)</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-md px-4 py-3 font-bold bg-[#2D2785] hover:bg-[#1a1a5a] text-white shadow transition"
              >
                Registrar
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Já tem conta?{" "}
              <Link to="/login" className="text-[#2D2785] hover:underline">
                Faça login
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
