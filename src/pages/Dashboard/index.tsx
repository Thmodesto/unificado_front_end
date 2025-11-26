import { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getStudent, getDisciplines, getCourses, logout } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Student {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  ra_number?: string;
  disciplines: Discipline[];
  course?: { id: number; name: string };
}

interface Discipline {
  id: number;
  name: string;
  course_ids: number[];
  prerequisites: number[];
  status?: string; // Added optional status field to reflect backend change
}

interface Subject {
  name: string;
  status: string;
  dependencies: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [student, setStudent] = useState<Student | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter ID do estudante do localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const studentId = user.id || 1; // fallback para demonstração
        const [studentData, disciplinesData, coursesData] = await Promise.all([
          getStudent(studentId),
          getDisciplines(),
          getCourses()
        ]);
        setStudent(studentData);
        setDisciplines(disciplinesData);
        setCourses(coursesData);
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
          <h1 className="text-2xl font-bold text-center">Painel Acadêmico - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
        <header className="bg-[#2D2785] text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Painel Acadêmico - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>{error || 'Estudante não encontrado'}</p>
        </main>
      </div>
    );
  }

  // Use real status from student discipline data
  const subjects: Subject[] = student.disciplines.map(discipline => ({
    name: discipline.name,
    status: discipline.status || 'Pendente', // Use status from API or fallback
    dependencies: discipline.prerequisites.map(depId => {
      const depDiscipline = disciplines.find(d => d.id === depId);
      return depDiscipline ? depDiscipline.name : 'Disciplina não encontrada';
    }),
  }));

  // Mapping API discipline statuses to display status labels
  const apiStatusToDisplayStatus: Record<string, string> = {
    'pendente': 'Pendente',
    'cursando': 'Em Andamento',
    'concluido': 'Concluída',
  };

  // Group subjects by display status, mapping from API status
  const statusOrder = ['Em Andamento', 'Pendente', 'Concluída'];
  const groupedSubjects = subjects.reduce((acc, subject) => {
    // Map subject.status from API value to display label if mapping exists
    const displayStatus = apiStatusToDisplayStatus[subject.status.toLowerCase()] || subject.status;
    if (!acc[displayStatus]) acc[displayStatus] = [];
    acc[displayStatus].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Concluída':
        return { color: 'text-green-600', bgColor: 'bg-green-600', icon: '🟢' };
      case 'Em Andamento':
        return { color: 'text-yellow-500', bgColor: 'bg-yellow-500', icon: '🟡' };
      case 'Pendente':
        return { color: 'text-red-600', bgColor: 'bg-red-600', icon: '🔴' };
      default:
        return { color: 'text-gray-500', bgColor: 'bg-gray-500', icon: '⚪' };
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel Acadêmico - BioGraph</h1>
        <Button onClick={handleLogout} variant="outline" className="text-black border-white hover:bg-white hover:text-[#2D2785]">
          Logout
        </Button>
      </header>

      {/* Student Info */}
      <section className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2D2785]">Usuário: {student.username}</h2>
            <p className="text-gray-700">Curso: {student.course?.name || (() => {
              const courseId = student.disciplines[0]?.course_ids[0];
              const course = courses.find(c => c.id === courseId);
              return course ? course.name : 'Não informado';
            })()}</p>
            <p className="text-gray-500">RA: {student.ra_number || 'Não informado'}</p>
          </div>
          <div className="mt-4 md:mt-0 bg-[#FFDD00] text-[#2D2785] px-4 py-2 rounded-full font-semibold shadow">
            Status Acadêmico
          </div>
        </div>
      </section>

      {/* Dashboard Body - Accordion centralizado */}
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-center text-[#2D2785] mb-6">Disciplinas</h3>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {statusOrder.map((status) => {
              const subjectsInStatus = groupedSubjects[status] || [];
              const statusInfo = getStatusInfo(status);
              return (
                <AccordionItem
                  key={status}
                  value={status}
                  className="border border-gray-200 rounded-2xl shadow-sm"
                >
                  <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785] hover:bg-[white]/10 transition-all">
                    <div className="flex items-center justify-between w-full">
                      <span className={`flex items-center gap-1 ${statusInfo.color} text-base font-semibold`}>
                        {statusInfo.icon}
                        <span className="text-[#2D2785]">{status}</span>
                      </span>
                      <span className={`flex items-center gap-2 ${statusInfo.color} text-sm font-medium`}>
                        ({subjectsInStatus.length})
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl border-t border-gray-100">
                    <Accordion type="single" collapsible className="w-full">
                      {subjectsInStatus.map((subject, index) => {
                        const subjStatusInfo = getStatusInfo(status);
                        return (
                          <AccordionItem
                            key={index}
                            value={`subject-${status}-${index}`}
                            className="border border-gray-100 rounded-lg mb-2"
                          >
                            <AccordionTrigger className="px-4 py-2 font-medium text-[#2D2785]">
                              <div className="flex items-center justify-between w-full">
                                <span>{subject.name}</span>
                                <span className={`inline-block w-3 h-3 rounded-full ${subjStatusInfo.bgColor}`}></span>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 py-2">
                              <h4 className="text-lg font-semibold text-[#2D2785] mb-2">Dependências:</h4>
                              {subject.dependencies.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 text-gray-800">
                                  {subject.dependencies.map((dep, i) => (
                                    <li key={i}>{dep}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500">Nenhuma dependência registrada.</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
