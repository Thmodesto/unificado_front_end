// Página de Registro: formulário estilizado com Tailwind e integração com API.
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { createStudent, createTeacher } from "@/lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    ra_number: "",
    employee_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Preencha nome de usuário e senha.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (formData.role === 'student') {
        await createStudent({
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          ra_number: formData.ra_number || undefined,
        });
      } else {
        await createTeacher({
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          employee_number: formData.employee_number || undefined,
        });
      }
      // Redirecionar para login após registro bem-sucedido
      navigate("/login");
    } catch (err) {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
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
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Criar Conta</h3>

          <div className="border border-gray-200 rounded-2xl shadow-sm bg-gray-50 px-6 py-4">
            <p className="text-center text-gray-700 mb-4">
              Preencha os dados abaixo para se registrar
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Nome de usuário"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                value={formData.username}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail (opcional)"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                value={formData.password}
                onChange={handleInputChange}
              />
              {formData.role === 'student' && (
                <input
                  type="text"
                  name="ra_number"
                  placeholder="RA (Registro Acadêmico - opcional)"
                  className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                  value={formData.ra_number}
                  onChange={handleInputChange}
                />
              )}
              {formData.role === 'teacher' && (
                <input
                  type="text"
                  name="employee_number"
                  placeholder="ID de Funcionário (opcional)"
                  className="w-full rounded-md px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#2D2785] outline-none"
                  value={formData.employee_number}
                  onChange={handleInputChange}
                />
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={() => handleRoleChange('student')}
                    className="accent-[#2D2785]"
                  />
                  <span>Sou estudante</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={formData.role === 'teacher'}
                    onChange={() => handleRoleChange('teacher')}
                    className="accent-[#2D2785]"
                  />
                  <span>Sou professor(a)</span>
                </label>
              </div>
              {error && <p className="text-red-600 text-sm text-left">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md px-4 py-3 font-bold bg-[#2D2785] hover:bg-[#1a1a5a] text-white shadow transition disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar"}
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
