import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Professor {
  name: string;
  employeeId: string;
}

interface AssignedSubject {
  name: string;
  course: string;
  semester: string;
  dependencies: string[];
}

export default function ProfessorDashboard() {
  const professor: Professor = {
    name: 'Prof. Maria Oliveira',
    employeeId: 'EMP001',
  };

  const assignedSubjects: AssignedSubject[] = [
    {
      name: 'Estruturas de Dados',
      course: 'Engenharia da Computação',
      semester: '2025.2',
      dependencies: ['Lógica de Programação'],
    },
    {
      name: 'Algoritmos Avançados',
      course: 'Engenharia da Computação',
      semester: '2025.2',
      dependencies: ['Estruturas de Dados', 'Matemática Discreta'],
    },
    {
      name: 'Banco de Dados',
      course: 'Sistemas de Informação',
      semester: '2025.2',
      dependencies: ['Estruturas de Dados'],
    },
    {
      name: 'Inteligência Artificial',
      course: 'Ciência da Computação',
      semester: '2025.2',
      dependencies: ['Algoritmos Avançados', 'Probabilidade e Estatística'],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Painel do Professor - BioGraph</h1>
      </header>

      {/* Professor Info */}
      <section className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#2D2785]">Nome: {professor.name}</h2>
            <p className="text-gray-700">ID de Funcionário: {professor.employeeId}</p>
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

          <Accordion type="single" collapsible className="w-full space-y-4">
            {assignedSubjects.map((subject, index) => (
              <AccordionItem
                key={index}
                value={`subject-${index}`}
                className="border border-gray-200 rounded-2xl shadow-sm"
              >
                <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785] hover:bg-[white]/10 transition-all">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[#2D2785]">{subject.name}</span>
                    <span className="text-gray-600 text-sm">
                      {subject.course}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl border-t border-gray-100">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-gray-800"><strong>Curso:</strong> {subject.course}</p>
                      <p className="text-gray-800"><strong>Semestre:</strong> {subject.semester}</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`deps-${index}`} className="border border-gray-100 rounded-lg">
                        <AccordionTrigger className="px-4 py-2 font-medium text-[#2D2785]">
                          Dependências
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2">
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
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
