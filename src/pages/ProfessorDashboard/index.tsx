import { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getTeacher, getDisciplines, getCourses, logout } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Professor {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  employee_number?: string;
  disciplines: Discipline[];
}

interface Discipline {
  id: number;
  name: string;
  course_ids: number[];
  prerequisites: number[];
}

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter ID do professor do localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const professorId = user.id || 1; // fallback para demonstração
        const [professorData, disciplinesData, coursesData] = await Promise.all([
          getTeacher(professorId),
          getDisciplines(),
          getCourses()
        ]);
        setProfessor(professorData);
        setDisciplines(disciplinesData);
        setCourses(coursesData);
        console.log('Courses data:', coursesData);
        console.log('Professor disciplines:', professorData.disciplines);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
        <header className="bg-[#2D2785] text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Painel do Professor - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
        <header className="bg-[#2D2785] text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Painel do Professor - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>{error || 'Professor não encontrado'}</p>
        </main>
      </div>
    );
  }

  const getDisciplineName = (id: number) => {
    const discipline = disciplines.find(d => d.id === id);
    return discipline ? discipline.name : 'Disciplina não encontrada';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel do Professor - BioGraph</h1>
        <Button onClick={handleLogout} variant="outline" className="text-black border-white hover:bg-white hover:text-[#2D2785]">
          Logout
        </Button>
      </header>

      {/* Professor Info */}
      <section className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2D2785]">Usuário: {professor.username}</h2>
            <p className="text-gray-700">ID de Funcionário: {professor.employee_number || 'Não informado'}</p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#FFDD00] text-[#2D2785] px-4 py-2 rounded-full font-semibold shadow">
            Status Ativo
          </div>
        </div>
      </section>

      {/* Dashboard Body - Accordion centralizado */}
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Disciplinas Atribuídas</h3>

          {professor.disciplines.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma disciplina atribuída</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {professor.disciplines.map((subject) => (
                <AccordionItem
                  key={subject.id}
                  value={`subject-${subject.id}`}
                  className="border border-gray-200 rounded-2xl shadow-sm"
                >
                  <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785] hover:bg-[white]/10 transition-all">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#2D2785]">{subject.name}</span>
                      <span className="text-gray-600 text-sm">
                        Cursos: {subject.course_ids.map(id => courses.find(c => c.id === id)?.name || id).join(', ')}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl border-t border-gray-100">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-gray-800"><strong>Cursos:</strong> {subject.course_ids.map(id => courses.find(c => c.id === id)?.name || id).join(', ')}</p>
                        <p className="text-gray-800"><strong>Semestre:</strong> 2025.2</p>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`deps-${subject.id}`} className="border border-gray-100 rounded-lg">
                          <AccordionTrigger className="px-4 py-2 font-medium text-[#2D2785]">
                            Dependências
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2">
                            {subject.prerequisites.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1 text-gray-800">
                                {subject.prerequisites.map((depId, i) => (
                                  <li key={i}>{getDisciplineName(depId)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">Nenhuma dependência registrada.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </main>
    </div>
  );
}
