import { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getAllUsers,
  toggleUserActive,
  getCourses,
  createCourse,
  getDisciplines,
  createDiscipline,
  updateDiscipline,
  getStudents,
  createStudent,
  updateStudent,
  addDisciplineToStudent,
  removeDisciplineFromStudent,
  getTeachers,
  createTeacher,
  updateTeacher,
  addDisciplineToTeacher,
  removeDisciplineFromTeacher,
} from "@/lib/api";
import type {
  Course,
  Discipline,
  Student,
  Teacher,
  UserPublic,
  UserListResponse,
  CourseCreateRequest,
  DisciplineCreateRequest,
  StudentCreateRequest,
  StudentUpdateRequest,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from "@/lib/api";

export default function AdminDashboard() {
  // State for data
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // State for forms
  const [newCourseName, setNewCourseName] = useState("");
  const [newDiscipline, setNewDiscipline] = useState({ name: "", course_ids: [] as number[], prerequisites: [] as number[] });
  const [newStudent, setNewStudent] = useState<StudentCreateRequest>({ username: "", password: "" });
  const [newTeacher, setNewTeacher] = useState<TeacherCreateRequest>({ username: "", password: "" });
  const [editingStudent, setEditingStudent] = useState<StudentUpdateRequest>({});
  const [editingTeacher, setEditingTeacher] = useState<TeacherUpdateRequest>({});
  const [editingDiscipline, setEditingDiscipline] = useState<{ id: number; name: string; course_ids: number[]; prerequisites: number[] } | null>(null);

  // State for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  const [disciplineToAdd, setDisciplineToAdd] = useState<number>(0);

  const [selectedAddDisciplineStudent, setSelectedAddDisciplineStudent] = useState<Record<number, string>>({});

  const [selectedAddDisciplineTeacher, setSelectedAddDisciplineTeacher] = useState<Record<number, string>>({});


  useEffect(() => {
    fetchAllData();
  }, [showInactive]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        usersData,
        coursesData,
        disciplinesData,
        studentsData,
        teachersData
      ] = await Promise.all([
        getAllUsers(showInactive),
        getCourses(),
        getDisciplines(),
        getStudents(),
        getTeachers(),
      ]);

      setUsers(usersData.users);
      setCourses(coursesData);
      setDisciplines(disciplinesData);
      setStudents(studentsData);
      setTeachers(teachersData);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    try {
      await createCourse({ name: newCourseName });
      setNewCourseName("");
      fetchAllData();
    } catch (err) {
      console.error('Erro ao criar curso:', err);
    }
  };

  const handleCreateDiscipline = async () => {
    if (!newDiscipline.name.trim() || newDiscipline.course_ids.length === 0) return;
    try {
      await createDiscipline(newDiscipline);
      setNewDiscipline({ name: "", course_ids: [], prerequisites: [] });
      fetchAllData();
    } catch (err) {
      console.error('Erro ao criar disciplina:', err);
    }
  };

  const handleUpdateDiscipline = async (disciplineId: number) => {
    if (!editingDiscipline) return;
    try {
      await updateDiscipline(disciplineId, {
        name: editingDiscipline.name,
        course_ids: editingDiscipline.course_ids,
        prerequisites: editingDiscipline.prerequisites,
      });
      setEditingDiscipline(null);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao atualizar disciplina:', err);
      alert('Erro ao atualizar disciplina. Verifique os dados e tente novamente.');
    }
  };

  const handleCreateStudent = async () => {
    if (!newStudent.username || !newStudent.password) return;
    try {
      await createStudent(newStudent);
      setNewStudent({ username: "", password: "" });
      fetchAllData();
    } catch (err) {
      console.error('Erro ao criar estudante:', err);
    }
  };

  const handleCreateTeacher = async () => {
    if (!newTeacher.username || !newTeacher.password) return;
    try {
      await createTeacher(newTeacher);
      setNewTeacher({ username: "", password: "" });
      fetchAllData();
    } catch (err) {
      console.error('Erro ao criar professor:', err);
    }
  };

  const handleToggleUserActive = async (userId: number) => {
    try {
      await toggleUserActive(userId);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao alterar status do usuário:', err);
    }
  };

  const handleUpdateStudent = async (studentId: number) => {
    try {
      await updateStudent(studentId, editingStudent);
      setEditingStudent({});
      setSelectedStudentId(null);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao atualizar estudante:', err);
      alert('Erro ao atualizar estudante. Verifique os dados e tente novamente.');
    }
  };

  const handleUpdateTeacher = async (teacherId: number) => {
    try {
      await updateTeacher(teacherId, editingTeacher);
      setEditingTeacher({});
      setSelectedTeacherId(null);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao atualizar professor:', err);
      alert('Erro ao atualizar professor. Verifique os dados e tente novamente.');
    }
  };

  const handleAddDisciplineToStudent = async (studentId: number, disciplineId: number) => {
    try {
      const updatedStudent = await addDisciplineToStudent(studentId, disciplineId);
      setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    } catch (err) {
      console.error('Erro ao adicionar disciplina ao estudante:', err);
      alert('Erro ao adicionar disciplina ao estudante. Verifique os dados e tente novamente.');
    }
  };

  const handleRemoveDisciplineFromStudent = async (studentId: number, disciplineId: number) => {
    try {
      const updatedStudent = await removeDisciplineFromStudent(studentId, disciplineId);
      setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    } catch (err) {
      console.error('Erro ao remover disciplina do estudante:', err);
      alert('Erro ao remover disciplina do estudante. Verifique os dados e tente novamente.');
    }
  };

  const handleAddDisciplineToTeacher = async (teacherId: number, disciplineId: number) => {
    try {
      const updatedTeacher = await addDisciplineToTeacher(teacherId, disciplineId);
      setTeachers(prev => prev.map(t => t.id === teacherId ? updatedTeacher : t));
    } catch (err) {
      console.error('Erro ao adicionar disciplina ao professor:', err);
      alert('Erro ao adicionar disciplina ao professor. Verifique os dados e tente novamente.');
    }
  };

  const handleRemoveDisciplineFromTeacher = async (teacherId: number, disciplineId: number) => {
    try {
      const updatedTeacher = await removeDisciplineFromTeacher(teacherId, disciplineId);
      setTeachers(prev => prev.map(t => t.id === teacherId ? updatedTeacher : t));
    } catch (err) {
      console.error('Erro ao remover disciplina do professor:', err);
      alert('Erro ao remover disciplina do professor. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
        <header className="bg-[#2D2785] text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Painel Administrativo - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
        <header className="bg-[#2D2785] text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">Painel Administrativo - BioGraph</h1>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <p>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#2D2785] text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Painel Administrativo - BioGraph</h1>
      </header>

      {/* Admin Info */}
      <section className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[#2D2785]">Bem-vindo, Administrador</h2>
          <p className="text-gray-700">Gerencie usuários, cursos, disciplinas e permissões do sistema.</p>
        </div>
      </section>

      {/* Dashboard Body */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">

            {/* Gerenciar Usuários */}
            <AccordionItem value="users" className="border border-gray-200 rounded-2xl shadow-sm">
              <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785]">
                Gerenciar Usuários
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                      />
                      Mostrar usuários inativos
                    </label>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Username</th>
                          <th className="border border-gray-300 px-4 py-2">Email</th>
                          <th className="border border-gray-300 px-4 py-2">Role</th>
                          <th className="border border-gray-300 px-4 py-2">Status</th>
                          <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                                {user.is_active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Button
                                onClick={() => handleToggleUserActive(user.id)}
                                variant="outline"
                                size="sm"
                              >
                                {user.is_active ? 'Desativar' : 'Ativar'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gerenciar Cursos */}
            <AccordionItem value="courses" className="border border-gray-200 rounded-2xl shadow-sm">
              <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785]">
                Gerenciar Cursos
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome do curso"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                    />
                    <Button onClick={handleCreateCourse}>Criar Curso</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Nome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.id}>
                            <td className="border border-gray-300 px-4 py-2">{course.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{course.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gerenciar Disciplinas */}
            <AccordionItem value="disciplines" className="border border-gray-200 rounded-2xl shadow-sm">
              <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785]">
                Gerenciar Disciplinas
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      placeholder="Nome da disciplina"
                      value={newDiscipline.name}
                      onChange={(e) => setNewDiscipline({...newDiscipline, name: e.target.value})}
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {newDiscipline.course_ids.length > 0
                            ? newDiscipline.course_ids.map(id => courses.find(c => c.id === id)?.name).join(', ')
                            : "Selecione cursos"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          {courses.map((course) => (
                            <div key={course.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`course-${course.id}`}
                                checked={newDiscipline.course_ids.includes(course.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewDiscipline({...newDiscipline, course_ids: [...newDiscipline.course_ids, course.id]});
                                  } else {
                                    setNewDiscipline({...newDiscipline, course_ids: newDiscipline.course_ids.filter(id => id !== course.id)});
                                  }
                                }}
                              />
                              <label htmlFor={`course-${course.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {course.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {newDiscipline.prerequisites.length > 0
                            ? newDiscipline.prerequisites.map(id => disciplines.find(d => d.id === id)?.name).join(', ')
                            : "Selecione pré-requisitos"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          {disciplines.map((discipline) => (
                            <div key={discipline.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`prereq-${discipline.id}`}
                                checked={newDiscipline.prerequisites.includes(discipline.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewDiscipline({...newDiscipline, prerequisites: [...newDiscipline.prerequisites, discipline.id]});
                                  } else {
                                    setNewDiscipline({...newDiscipline, prerequisites: newDiscipline.prerequisites.filter(id => id !== discipline.id)});
                                  }
                                }}
                              />
                              <label htmlFor={`prereq-${discipline.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {discipline.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button onClick={handleCreateDiscipline}>Criar Disciplina</Button>
                  </div>
                  <p className="text-sm text-gray-600">Segure Ctrl (ou Cmd no Mac) para selecionar múltiplos pré-requisitos.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Nome</th>
                          <th className="border border-gray-300 px-4 py-2">Curso</th>
                          <th className="border border-gray-300 px-4 py-2">Pré-requisitos</th>
                          <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {disciplines.map((discipline) => (
                          <tr key={discipline.id}>
                            <td className="border border-gray-300 px-4 py-2">{discipline.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{discipline.name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {discipline.course_ids.map(id => courses.find(c => c.id === id)?.name).filter(Boolean).join(', ') || 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {discipline.prerequisites.length > 0
                                ? discipline.prerequisites.map(id =>
                                    disciplines.find(d => d.id === id)?.name || id
                                  ).join(', ')
                                : 'Nenhum'
                              }
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Button
                                onClick={() => setEditingDiscipline(discipline)}
                                variant="outline"
                                size="sm"
                              >
                                Editar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {editingDiscipline && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <h4 className="text-lg font-semibold mb-2">Editar Disciplina</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Nome"
                          value={editingDiscipline.name}
                          onChange={(e) => setEditingDiscipline({...editingDiscipline, name: e.target.value})}
                        />

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {editingDiscipline.course_ids.length > 0
                                ? editingDiscipline.course_ids.map(id => courses.find(c => c.id === id)?.name).join(', ')
                                : "Selecione cursos"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              {courses.map((course) => (
                                <div key={course.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-course-${course.id}`}
                                    checked={editingDiscipline.course_ids.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setEditingDiscipline({...editingDiscipline, course_ids: [...editingDiscipline.course_ids, course.id]});
                                      } else {
                                        setEditingDiscipline({...editingDiscipline, course_ids: editingDiscipline.course_ids.filter(id => id !== course.id)});
                                      }
                                    }}
                                  />
                                  <label htmlFor={`edit-course-${course.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {course.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {editingDiscipline.prerequisites.length > 0
                                ? editingDiscipline.prerequisites.map(id => disciplines.find(d => d.id === id)?.name).join(', ')
                                : "Selecione pré-requisitos"
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              {disciplines
                                .filter(d => d.id !== editingDiscipline.id)
                                .map((discipline) => (
                                  <div key={discipline.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-prereq-${discipline.id}`}
                                      checked={editingDiscipline.prerequisites.includes(discipline.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setEditingDiscipline({...editingDiscipline, prerequisites: [...editingDiscipline.prerequisites, discipline.id]});
                                        } else {
                                          setEditingDiscipline({...editingDiscipline, prerequisites: editingDiscipline.prerequisites.filter(id => id !== discipline.id)});
                                        }
                                      }}
                                    />
                                    <label htmlFor={`edit-prereq-${discipline.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      {discipline.name}
                                    </label>
                                  </div>
                                ))
                              }
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleUpdateDiscipline(editingDiscipline.id)}>Salvar</Button>
                        <Button variant="outline" onClick={() => setEditingDiscipline(null)}>Cancelar</Button>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gerenciar Estudantes */}
            <AccordionItem value="students" className="border border-gray-200 rounded-2xl shadow-sm">
              <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785]">
                Gerenciar Estudantes
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                      placeholder="Username"
                      value={newStudent.username}
                      onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                    />
                    <Input
                      placeholder="Email (opcional)"
                      type="email"
                      value={newStudent.email || ''}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                    <Input
                      placeholder="RA"
                      value={newStudent.ra_number || ''}
                      onChange={(e) => setNewStudent({...newStudent, ra_number: e.target.value})}
                    />
                    <Input
                      placeholder="Senha"
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                    />
                    <Button onClick={handleCreateStudent}>Criar Estudante</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Username</th>
                          <th className="border border-gray-300 px-4 py-2">Email</th>
                          <th className="border border-gray-300 px-4 py-2">RA</th>
                          <th className="border border-gray-300 px-4 py-2">Status</th>
                          <th className="border border-gray-300 px-4 py-2">Disciplinas</th>
                          <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.email || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.ra_number || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={student.is_active ? 'text-green-600' : 'text-red-600'}>
                                {student.is_active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {student.disciplines.length > 0
                                ? student.disciplines.map(d => (
                                    <span key={d.id} className="inline-flex items-center gap-1 mr-2 mb-1">
                                      {d.name}
                                      <button
                                        onClick={() => handleRemoveDisciplineFromStudent(student.id, d.id)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                        title="Remover disciplina"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                : 'Nenhuma'
                              }
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-1 flex-wrap">
                                <Button
                                  onClick={() => setSelectedStudentId(student.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Editar
                                </Button>

                                <Select

                                  value={selectedAddDisciplineStudent[student.id] || ""}

                                  onValueChange={(value) => {

                                    if (value) {

                                      handleAddDisciplineToStudent(student.id, Number(value));

                                      setSelectedAddDisciplineStudent(prev => ({ ...prev, [student.id]: "" }));

                                    }

                                  }}

                                >

                                  <SelectTrigger className="border border-gray-200 rounded px-2 py-1 text-sm w-fit">

                                    <SelectValue placeholder="+ Disciplina" />

                                  </SelectTrigger>

                                  <SelectContent>

                                    {disciplines

                                      .filter(d => !student.disciplines.some(sd => sd.id === d.id))

                                      .map(d => (

                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>

                                      ))

                                    }

                                  </SelectContent>

                                </Select>

                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedStudentId && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <h4 className="text-lg font-semibold mb-2">Editar Estudante</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Username"
                          value={editingStudent.username || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, username: e.target.value})}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={editingStudent.email || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                        />
                        <Input
                          placeholder="RA"
                          value={editingStudent.ra_number || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, ra_number: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleUpdateStudent(selectedStudentId)}>Salvar</Button>
                        <Button variant="outline" onClick={() => { setSelectedStudentId(null); setEditingStudent({}); }}>Cancelar</Button>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gerenciar Professores */}
            <AccordionItem value="teachers" className="border border-gray-200 rounded-2xl shadow-sm">
              <AccordionTrigger className="bg-gray-50 px-6 py-4 rounded-2xl font-semibold text-[#2D2785]">
                Gerenciar Professores
              </AccordionTrigger>
              <AccordionContent className="bg-white px-6 py-4 rounded-b-2xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                      placeholder="Username"
                      value={newTeacher.username}
                      onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                    />
                    <Input
                      placeholder="Email (opcional)"
                      type="email"
                      value={newTeacher.email || ''}
                      onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    />
                    <Input
                      placeholder="Funcionário"
                      value={newTeacher.employee_number || ''}
                      onChange={(e) => setNewTeacher({...newTeacher, employee_number: e.target.value})}
                    />
                    <Input
                      placeholder="Senha"
                      type="password"
                      value={newTeacher.password}
                      onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                    />
                    <Button onClick={handleCreateTeacher}>Criar Professor</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Username</th>
                          <th className="border border-gray-300 px-4 py-2">Email</th>
                          <th className="border border-gray-300 px-4 py-2">Funcionário</th>
                          <th className="border border-gray-300 px-4 py-2">Status</th>
                          <th className="border border-gray-300 px-4 py-2">Disciplinas</th>
                          <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td className="border border-gray-300 px-4 py-2">{teacher.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{teacher.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{teacher.email || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{teacher.employee_number || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className={teacher.is_active ? 'text-green-600' : 'text-red-600'}>
                                {teacher.is_active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {teacher.disciplines.length > 0
                                ? teacher.disciplines.map(d => (
                                    <span key={d.id} className="inline-flex items-center gap-1 mr-2 mb-1">
                                      {d.name}
                                      <button
                                        onClick={() => handleRemoveDisciplineFromTeacher(teacher.id, d.id)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                        title="Remover disciplina"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                : 'Nenhuma'
                              }
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-1 flex-wrap">
                                <Button
                                  onClick={() => setSelectedTeacherId(teacher.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Editar
                                </Button>
                                <Select
                                  value={selectedAddDisciplineTeacher[teacher.id] || ""}
                                  onValueChange={(value) => {
                                    if (value) {
                                      handleAddDisciplineToTeacher(teacher.id, Number(value));
                                      setSelectedAddDisciplineTeacher(prev => ({ ...prev, [teacher.id]: "" }));
                                    }
                                  }}
                                >
                                  <SelectTrigger className="border border-gray-200 rounded px-2 py-1 text-sm w-fit">
                                    <SelectValue placeholder="+ Disciplina" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {disciplines
                                      .filter(d => !teacher.disciplines.some(td => td.id === d.id))
                                      .map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedTeacherId && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <h4 className="text-lg font-semibold mb-2">Editar Professor</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Username"
                          value={editingTeacher.username || ''}
                          onChange={(e) => setEditingTeacher({...editingTeacher, username: e.target.value})}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={editingTeacher.email || ''}
                          onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                        />
                        <Input
                          placeholder="Funcionário"
                          value={editingTeacher.employee_number || ''}
                          onChange={(e) => setEditingTeacher({...editingTeacher, employee_number: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleUpdateTeacher(selectedTeacherId)}>Salvar</Button>
                        <Button variant="outline" onClick={() => { setSelectedTeacherId(null); setEditingTeacher({}); }}>Cancelar</Button>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </main>
    </div>
  );
}
