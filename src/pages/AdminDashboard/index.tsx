import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  addDisciplineToStudent,
  removeDisciplineFromStudent,
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  addDisciplineToTeacher,
  removeDisciplineFromTeacher,
  addCourseToDiscipline,
  removeCourseFromDiscipline,
  addPrerequisiteToDiscipline,
  updateStudentDisciplineStatus,
  logout,
} from "@/lib/api";

import { useNavigate } from "react-router-dom";
import type {
  Course,
  Discipline,
  Student,
  Teacher,
  UserPublic,
  StudentCreateRequest,
  StudentUpdateRequest,
  TeacherCreateRequest,
  TeacherUpdateRequest,
} from "@/lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // State for data
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // State for forms
  const [newCourseName, setNewCourseName] = useState("");
  const [newDiscipline, setNewDiscipline] = useState({ name: "", course_ids: [] as number[], prerequisites: [] as number[] });
  const [newStudent, setNewStudent] = useState<StudentCreateRequest>({ username: "", email: "", password: "", ra_number: "", assign_course_curriculum: true, course_id: 0 });
  const [newTeacher, setNewTeacher] = useState<TeacherCreateRequest>({ username: "", password: "" });
  const [editingStudent, setEditingStudent] = useState<StudentUpdateRequest>({} as StudentUpdateRequest);
  const [editingTeacher, setEditingTeacher] = useState<TeacherUpdateRequest>({} as TeacherUpdateRequest);
  const [editingCoursesId, setEditingCoursesId] = useState<number | null>(null);
  const [editingPrerequisitesId, setEditingPrerequisitesId] = useState<number | null>(null);
  
  const [editingCoursesValue, setEditingCoursesValue] = useState<number[]>([]);
  const [editingPrerequisitesValue, setEditingPrerequisitesValue] = useState<number[]>([]);
  
  // Handler to start editing courses of a discipline
  const startEditingCourses = (disciplineId: number, currentCourseIds: number[]) => {
    setEditingCoursesId(disciplineId);
    setEditingCoursesValue(currentCourseIds);
    setEditingPrerequisitesId(null); // Close prerequisites editing if open
  };
  
  // Handler to start editing prerequisites of a discipline
  const startEditingPrerequisites = (disciplineId: number, currentPrerequisites: number[]) => {
    setEditingPrerequisitesId(disciplineId);
    setEditingPrerequisitesValue(currentPrerequisites);
    setEditingCoursesId(null); // Close courses editing if open
  };
  
  // Handler to cancel editing courses
  const cancelEditingCourses = () => {
    setEditingCoursesId(null);
    setEditingCoursesValue([]);
  };
  
  // Handler to cancel editing prerequisites
  const cancelEditingPrerequisites = () => {
    setEditingPrerequisitesId(null);
    setEditingPrerequisitesValue([]);
  };
  
  // Handler to save courses editing
  const saveEditingCourses = async (disciplineId: number) => {
    try {
      const discipline = disciplines.find(d => d.id === disciplineId);
      if (!discipline) {
        alert('Disciplina não encontrada');
        return;
      }

      const originalCourseIds = new Set(discipline.course_ids);
      const newCourseIds = new Set(editingCoursesValue);

      // Courses to add
      const toAdd = [...newCourseIds].filter(id => !originalCourseIds.has(id));
      // Courses to remove
      const toRemove = [...originalCourseIds].filter(id => !newCourseIds.has(id));

      for (const courseId of toAdd) {
        await addCourseToDiscipline(disciplineId, courseId);
      }

      for (const courseId of toRemove) {
        await removeCourseFromDiscipline(disciplineId, courseId);
      }

      setEditingCoursesId(null);
      setEditingCoursesValue([]);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao salvar cursos da disciplina:', err);
      alert('Erro ao salvar cursos. Verifique os dados e tente novamente.');
    }
  };
  
  // Handler to save prerequisites editing
  const saveEditingPrerequisites = async (disciplineId: number) => {
    try {
      const discipline = disciplines.find(d => d.id === disciplineId);
      if (!discipline) {
        alert('Disciplina não encontrada');
        return;
      }

      const originalPrerequisites = new Set(discipline.prerequisites);
      const newPrerequisites = new Set(editingPrerequisitesValue);

      // Prerequisites to add
      const toAdd = [...newPrerequisites].filter(id => !originalPrerequisites.has(id));
      // Prerequisites to remove
      const toRemove = [...originalPrerequisites].filter(id => !newPrerequisites.has(id));

      for (const prereqId of toAdd) {
        await addPrerequisiteToDiscipline(disciplineId, prereqId);
      }

      // Note: API does not specify remove prerequisite endpoint; if it existed, call here
      if (toRemove.length > 0) {
        console.warn('Removing prerequisites is not supported by current API and will be ignored.');
      }

      setEditingPrerequisitesId(null);
      setEditingPrerequisitesValue([]);
      fetchAllData();
    } catch (err) {
      console.error('Erro ao salvar pré-requisitos da disciplina:', err);
      alert('Erro ao salvar pré-requisitos. Verifique os dados e tente novamente.');
    }
  };

  // State for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedStudentForDisciplines, setSelectedStudentForDisciplines] = useState<number | null>(null);
  const [selectedTeacherForDisciplines, setSelectedTeacherForDisciplines] = useState<number | null>(null);

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
      getDisciplines(0, 1000),
      getStudents(),
      getTeachers(),
      ]);

      // Debug logging to verify disciplines data in students and teachers
      console.log("Fetched students data:", studentsData);
      console.log("Fetched teachers data:", teachersData);

      // Enrich students and teachers with detailed disciplines, if needed
      // Check if disciplines arrays are populated, if empty fetch individual details
      const studentsWithDisciplines = await Promise.all(studentsData.map(async (student) => {
        if (!student.disciplines || student.disciplines.length === 0) {
          // fetch detailed student data including disciplines (if API supports)
          try {
            const detailedStudent = await getStudent(student.id);
            // Add disciplines_count from disciplines length if missing
            if (!detailedStudent.disciplines_count && detailedStudent.disciplines) {
              detailedStudent.disciplines_count = detailedStudent.disciplines.length;
            }
            return detailedStudent;
          } catch (e) {
            console.error(`Failed to fetch details for student ${student.id}:`, e);
            return student;
          }
        }
        // Also ensure disciplines_count is set for students already having disciplines
        if (!student.disciplines_count && student.disciplines) {
          student.disciplines_count = student.disciplines.length;
        }
        return student;
      }));

      const teachersWithDisciplines = await Promise.all(teachersData.map(async (teacher) => {
        if (!teacher.disciplines || teacher.disciplines.length === 0) {
          try {
            const detailedTeacher = await getTeacher(teacher.id);
            return detailedTeacher;
          } catch (e) {
            console.error(`Failed to fetch details for teacher ${teacher.id}:`, e);
            return teacher;
          }
        }
        return teacher;
      }));

      setUsers(usersData.users);
      setCourses(coursesData);
      setDisciplines(disciplinesData);
      setStudents(studentsWithDisciplines);
      setTeachers(teachersWithDisciplines);
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

  // Removed unused handleUpdateDiscipline function to fix TS warning

  const handleCreateStudent = async () => {
    if (!newStudent.username || !newStudent.password) return;
    try {
      await createStudent(newStudent);
      setNewStudent({ username: "", email: "", password: "", ra_number: "", assign_course_curriculum: true, course_id: 0 });
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

  // Removed unused handleAddCourseToDiscipline function to fix TS warning



  // Removed unused selectedAddPrerequisite, setSelectedAddPrerequisite and handleAddPrerequisite to fix TS warning


  // Remove unused state and handlers
  // const [selectedAddCourse, setSelectedAddCourse] = useState<Record<number, string>>({});

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
      <header className="bg-[#2D2785] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel Administrativo - BioGraph</h1>
        <Button onClick={handleLogout} variant="outline" className="text-black border-white hover:bg-white hover:text-[#2D2785]">
          Logout
        </Button>
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
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 border border-gray-300 rounded-lg p-1">
              <TabsTrigger value="users" className="data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">Usuários</TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">Cursos</TabsTrigger>
              <TabsTrigger value="disciplines" className="data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">Disciplinas</TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">Estudantes</TabsTrigger>
              <TabsTrigger value="teachers" className="data-[state=active]:text-black data-[state=active]:shadow-sm text-gray-700">Professores</TabsTrigger>
            </TabsList>

            {/* Gerenciar Usu├írios */}
            <TabsContent value="users" className="mt-6">
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
                            {user.role !== 'admin' ? (
                              <Button
                                onClick={() => handleToggleUserActive(user.id)}
                                variant="outline"
                                size="sm"
                              >
                                {user.is_active ? 'Desativar' : 'Ativar'}
                              </Button>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Gerenciar Cursos */}
            <TabsContent value="courses" className="mt-6">
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
            </TabsContent>

            {/* Gerenciar Disciplinas */}
            <TabsContent value="disciplines" className="mt-6">
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
                        <th className="border border-gray-300 px-4 py-2">Prérequisitos</th>
                        <th className="border border-gray-300 px-4 py-2">Ações</th>
                      </tr>
                    </thead>
              <tbody>
                {disciplines.map((discipline) => (
                  <tr key={discipline.id}>
                    <td className="border border-gray-300 px-4 py-2">{discipline.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{discipline.name}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="space-y-1">
                              {discipline.course_ids.length > 0 ? (
                                discipline.course_ids.map(id => {
                                  const courseName = courses.find(c => c.id === id)?.name;
                                  if (!courseName) return null;
                                  return (
                                    <div key={id} className="flex justify-between items-center border rounded px-2 py-1">
                                      <span>{courseName}</span>
                                    </div>
                                  );
                                })
                              ) : (
                                <span>Nenhum</span>
                              )}
                            </div>
                          </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="space-y-1">
                        {discipline.prerequisites.length > 0 ? (
                          discipline.prerequisites.map(id => {
                            const prereqName = disciplines.find(d => d.id === id)?.name;
                            if (!prereqName) return null;
                            return (
                              <div key={id} className="border rounded px-2 py-1">
                                <span>{prereqName}</span>
                              </div>
                            );
                          })
                        ) : (
                          <span>Nenhum</span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingCourses(discipline.id, discipline.course_ids)}
                        >
                          Editar Curso
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingPrerequisites(discipline.id, discipline.prerequisites)}
                        >
                          Editar Pré-Requisitos
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Courses editing section */}
          {editingCoursesId !== null && (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Editar Cursos - Disciplina ID: {editingCoursesId}</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {courses.map(course => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-course-${course.id}`}
                      checked={editingCoursesValue.includes(course.id)}
                      onCheckedChange={checked => {
                        if (checked) {
                          setEditingCoursesValue([...editingCoursesValue, course.id]);
                        } else {
                          setEditingCoursesValue(editingCoursesValue.filter(id => id !== course.id));
                        }
                      }}
                    />
                    <label htmlFor={`edit-course-${course.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {course.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => saveEditingCourses(editingCoursesId)}>Salvar</Button>
                <Button variant="outline" onClick={cancelEditingCourses}>Cancelar</Button>
              </div>
            </div>
          )}

          {/* Prerequisites editing section */}
          {editingPrerequisitesId !== null && (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Editar Pré-Requisitos - Disciplina ID: {editingPrerequisitesId}</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {disciplines.map(disciplineOption => (
                  <div key={disciplineOption.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-prereq-${disciplineOption.id}`}
                      checked={editingPrerequisitesValue.includes(disciplineOption.id)}
                      onCheckedChange={checked => {
                        if (checked) {
                          setEditingPrerequisitesValue([...editingPrerequisitesValue, disciplineOption.id]);
                        } else {
                          setEditingPrerequisitesValue(editingPrerequisitesValue.filter(id => id !== disciplineOption.id));
                        }
                      }}
                    />
                    <label htmlFor={`edit-prereq-${disciplineOption.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {disciplineOption.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => saveEditingPrerequisites(editingPrerequisitesId)}>Salvar</Button>
                <Button variant="outline" onClick={cancelEditingPrerequisites}>Cancelar</Button>
              </div>
            </div>
          )}
              </div>
            </TabsContent>

            {/* Gerenciar Estudantes */}
            <TabsContent value="students" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
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
                  <Select
                    value={newStudent.course_id ? newStudent.course_id.toString() : ""}
                    onValueChange={(value) => setNewStudent({...newStudent, course_id: value ? parseInt(value) : 0})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="assign-course-curriculum"
                      checked={newStudent.assign_course_curriculum}
                      onCheckedChange={(checked) => setNewStudent({...newStudent, assign_course_curriculum: !!checked})}
                    />
                    <label htmlFor="assign-course-curriculum" className="text-sm font-medium">
                      Atribuir currículo do curso
                    </label>
                  </div>
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
                        <th className="border border-gray-300 px-4 py-2">Curso</th>
                        <th className="border border-gray-300 px-4 py-2">Qtd. Disciplinas</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
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
                          <td className="border border-gray-300 px-4 py-2">{student.course?.name || '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{student.disciplines_count ?? 0}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={student.is_active ? 'text-green-600' : 'text-red-600'}>
                              {student.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex gap-1 flex-wrap">
                              <Button
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  setEditingStudent({
                                    username: student.username,
                                    email: student.email || '',
                                    ra_number: student.ra_number || '',
                                    course_id: student.course?.id,
                                  });
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedStudentForDisciplines(selectedStudentForDisciplines === student.id ? null : student.id);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Gerenciar Disciplinas
                              </Button>
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
                          <Select
                            value={editingStudent.course_id ? editingStudent.course_id.toString() : ""}
                            onValueChange={(value) => {
                              setEditingStudent({...editingStudent, course_id: value ? parseInt(value) : undefined});
                            }}
                          >
                            <SelectTrigger className="col-span-1">
                              <SelectValue placeholder="Curso" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox
                            id="student-active"
                            checked={editingStudent.is_active ?? true}
                            onCheckedChange={(checked) => setEditingStudent({...editingStudent, is_active: !!checked})}
                          />
                          <label htmlFor="student-active" className="text-sm font-medium">
                            Ativo
                          </label>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleUpdateStudent(selectedStudentId)}>Salvar</Button>
                          <Button variant="outline" onClick={() => { setSelectedStudentId(null); setEditingStudent({}); }}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                    {selectedStudentForDisciplines && (
                      <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h4 className="text-lg font-semibold mb-2">Gerenciar Disciplinas do Estudante</h4>
                        <div className="space-y-4">
                        <div className="overflow-x-auto">
{(() => {
  const student = students.find(s => s.id === selectedStudentForDisciplines);
  console.log('Render Student Disciplines:', student?.disciplines);
  if (student?.disciplines && student.disciplines.length > 0) {
    return (
      <>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Disciplina</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {student.disciplines.map((discipline: Discipline) => {
            const currentStatus = discipline.status || 'pendente';
            return (
              <tr key={discipline.id}>
                <td className="border border-gray-300 px-4 py-2">{discipline.id}</td>
                <td className="border border-gray-300 px-4 py-2">{discipline.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={currentStatus}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await updateStudentDisciplineStatus(selectedStudentForDisciplines!, discipline.id, newStatus);
                        fetchAllData();
                      } catch (error) {
                        console.error('Erro ao atualizar status da disciplina:', error);
                        alert('Erro ao atualizar status da disciplina. Tente novamente.');
                      }
                    }}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="cursando">Cursando</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Button
                    onClick={() => handleRemoveDisciplineFromStudent(selectedStudentForDisciplines!, discipline.id)}
                    variant="outline"
                    size="sm"
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </>
    );
  } else {
    return <p className="text-gray-500">Nenhuma disciplina atribuída.</p>;
  }
})()}
                          </div>
                          <div className="flex gap-2">
                            <Select
                              value={selectedAddDisciplineStudent[selectedStudentForDisciplines] || ""}
                              onValueChange={(value) => setSelectedAddDisciplineStudent({...selectedAddDisciplineStudent, [selectedStudentForDisciplines]: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma disciplina para adicionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {disciplines
                                  .filter(d => !students.find(s => s.id === selectedStudentForDisciplines)?.disciplines?.some(sd => sd.id === d.id))
                                  .map((discipline) => (
                                    <SelectItem key={discipline.id} value={discipline.id.toString()}>
                                      {discipline.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => {
                                const disciplineId = parseInt(selectedAddDisciplineStudent[selectedStudentForDisciplines]);
                                if (disciplineId) {
                                  handleAddDisciplineToStudent(selectedStudentForDisciplines, disciplineId);
                                  setSelectedAddDisciplineStudent({...selectedAddDisciplineStudent, [selectedStudentForDisciplines]: ""});
                                }
                              }}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => setSelectedStudentForDisciplines(null)}>Fechar</Button>
                        </div>
                      </div>
                    )}
              </div>
            </TabsContent>

            {/* Gerenciar Professores */}
            <TabsContent value="teachers" className="mt-6">
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
                            <div className="flex gap-1 flex-wrap">
                              <Button
                                onClick={() => {
                                  setSelectedTeacherId(teacher.id);
                                  setEditingTeacher({
                                    username: teacher.username,
                                    email: teacher.email || '',
                                    employee_number: teacher.employee_number || '',
                                    is_active: teacher.is_active,
                                  });
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedTeacherForDisciplines(selectedTeacherForDisciplines === teacher.id ? null : teacher.id);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Gerenciar Disciplinas
                              </Button>
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
                        placeholder="Funcion├írio"
                        value={editingTeacher.employee_number || ''}
                        onChange={(e) => setEditingTeacher({...editingTeacher, employee_number: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox
                        id="teacher-active"
                        checked={editingTeacher.is_active ?? true}
                        onCheckedChange={(checked) => setEditingTeacher({...editingTeacher, is_active: !!checked})}
                      />
                      <label htmlFor="teacher-active" className="text-sm font-medium">
                        Ativo
                      </label>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleUpdateTeacher(selectedTeacherId)}>Salvar</Button>
                      <Button variant="outline" onClick={() => { setSelectedTeacherId(null); setEditingTeacher({}); }}>Cancelar</Button>
                    </div>
                  </div>
                )}
                  {selectedTeacherForDisciplines && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <h4 className="text-lg font-semibold mb-2">Gerenciar Disciplinas do Professor</h4>
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          {teachers.find(t => t.id === selectedTeacherForDisciplines)?.disciplines?.length ? (
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 px-4 py-2">ID</th>
                                  <th className="border border-gray-300 px-4 py-2">Disciplina</th>
                                  <th className="border border-gray-300 px-4 py-2">Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {teachers.find(t => t.id === selectedTeacherForDisciplines)?.disciplines?.map((discipline) => (
                                  <tr key={discipline.id}>
                                    <td className="border border-gray-300 px-4 py-2">{discipline.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{discipline.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                      <Button
                                        onClick={() => handleRemoveDisciplineFromTeacher(selectedTeacherForDisciplines, discipline.id)}
                                        variant="outline"
                                        size="sm"
                                      >
                                        Remover
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-500">Nenhuma disciplina atribuída.</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={selectedAddDisciplineTeacher[selectedTeacherForDisciplines] || ""}
                            onValueChange={(value) => setSelectedAddDisciplineTeacher({...selectedAddDisciplineTeacher, [selectedTeacherForDisciplines]: value})}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione uma disciplina para adicionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplines
                                .filter(d => !teachers.find(t => t.id === selectedTeacherForDisciplines)?.disciplines?.some(td => td.id === d.id))
                                .map((discipline) => (
                                  <SelectItem key={discipline.id} value={discipline.id.toString()}>
                                    {discipline.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => {
                              const disciplineId = parseInt(selectedAddDisciplineTeacher[selectedTeacherForDisciplines]);
                              if (disciplineId) {
                                handleAddDisciplineToTeacher(selectedTeacherForDisciplines, disciplineId);
                                setSelectedAddDisciplineTeacher({...selectedAddDisciplineTeacher, [selectedTeacherForDisciplines]: ""});
                              }
                            }}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => setSelectedTeacherForDisciplines(null)}>Fechar</Button>
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
