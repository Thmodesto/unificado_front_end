const API_BASE = 'https://fp4pagmp8f.us-east-1.awsapprunner.com';

export interface Course {
  id: number;
  name: string;
}

export interface Discipline {
  id: number;
  name: string;
  course_ids: number[];
  prerequisites: number[];
  status?: string;
}

export interface Teacher {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  employee_number?: string;
  disciplines: Discipline[];
  disciplines_count?: number;
}

export interface Student {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  ra_number?: string;
  disciplines: Discipline[];
  course_id?: number;
  course?: Course;
  disciplines_count?: number;
}

export interface UserPublic {
  id: number;
  username: string;
  email?: string;
  role: string;
  is_active: boolean;
}

export interface UserListResponse {
  users: UserPublic[];
  total: number;
  skip: number;
  limit: number;
  showing_inactive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email?: string;
    role: string;
    is_active: boolean;
  };
}

export interface CourseCreateRequest {
  name: string;
}

export interface DisciplineCreateRequest {
  name: string;
  course_ids?: number[];
  prerequisites?: number[];
}

export interface StudentCreateRequest {
  username: string;
  email?: string;
  password: string;
  ra_number?: string;
  assign_course_curriculum: boolean;
  course_id: number;
  disciplines?: number[];
}

export interface StudentUpdateRequest {
  username?: string;
  email?: string;
  ra_number?: string;
  is_active?: boolean;
  password?: string;
  course_id?: number;
}

export interface TeacherCreateRequest {
  username: string;
  email?: string;
  password: string;
  employee_number?: string;
  disciplines?: number[];
}

export interface TeacherUpdateRequest {
  username?: string;
  email?: string;
  employee_number?: string;
  is_active?: boolean;
  password?: string;
}

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getCourses(skip = 0, limit = 10): Promise<Course[]> {
  const response = await fetch(`${API_BASE}/api/v1/courses/?skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function createCourse(courseData: CourseCreateRequest): Promise<Course> {
  const response = await fetch(`${API_BASE}/api/v1/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) {
    throw new Error('Failed to create course');
  }
  return response.json();
}

export async function getDisciplines(skip = 0, limit = 10): Promise<Discipline[]> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/?skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch disciplines');
  }
  return response.json();
}

export async function createDiscipline(disciplineData: DisciplineCreateRequest): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(disciplineData),
  });
  if (!response.ok) {
    throw new Error('Failed to create discipline');
  }
  return response.json();
}

export async function updateDiscipline(id: number, disciplineData: DisciplineCreateRequest): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(disciplineData),
  });
  if (!response.ok) {
    throw new Error('Failed to update discipline');
  }
  return response.json();
}

export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);

  const response = await fetch(`${API_BASE}/api/v1/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
}

export async function getTeachers(skip = 0, limit = 10): Promise<Teacher[]> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/?skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch teachers');
  }
  return response.json();
}

export async function getTeacher(id: number): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch teacher');
  }
  return response.json();
}

export async function updateTeacher(id: number, teacherData: TeacherUpdateRequest): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(teacherData),
  });
  if (!response.ok) {
    throw new Error('Failed to update teacher');
  }
  return response.json();
}

export async function addDisciplineToTeacher(teacherId: number, disciplineId: number): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/disciplines/${disciplineId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({}), // API expects PATCH with empty body
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to add discipline to teacher. Status: ${response.status}, Response: ${errorText}`);
    throw new Error(`Failed to add discipline to teacher: ${response.status} ${errorText}`);
  }
  return response.json();
}

export async function removeDisciplineFromTeacher(teacherId: number, disciplineId: number): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/${teacherId}/remove-discipline/${disciplineId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to remove discipline from teacher');
  }
  return response.json();
}

export async function getStudents(skip = 0, limit = 10): Promise<Student[]> {
  const response = await fetch(`${API_BASE}/api/v1/students/?skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

export async function getStudent(id: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${id}`, {
    headers: getAuthHeaders(),
  });
  
  const text = await response.text();
  console.log("Resposta bruta da API:", text);

  if (!response.ok) {
    console.error("Erro status:", response.status);
    throw new Error('Failed to fetch student');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Erro ao fazer parse do JSON:", err);
    throw err;
  }
}

export async function createStudent(studentData: StudentCreateRequest): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  return response.json();
}

export async function updateStudent(id: number, studentData: StudentUpdateRequest): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return response.json();
}

export async function addDisciplineToStudent(studentId: number, disciplineId: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${studentId}/disciplines/${disciplineId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({}), // API expects PATCH with empty body
  });
  if (!response.ok) {
    throw new Error('Failed to add discipline to student');
  }
  return response.json();
}

export async function removeDisciplineFromStudent(studentId: number, disciplineId: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${studentId}/remove-discipline/${disciplineId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to remove discipline from student');
  }
  return response.json();
}

export async function getAllUsers(showInactive = false, skip = 0, limit = 10): Promise<UserListResponse> {
  const response = await fetch(`${API_BASE}/api/v1/users/?show_inactive=${showInactive}&skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function toggleUserActive(id: number): Promise<{message: string, user: UserPublic}> {
  const response = await fetch(`${API_BASE}/api/v1/users/${id}/toggle-active`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle user active status');
  }
  return response.json();
}

export async function createTeacher(teacherData: TeacherCreateRequest): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/api/v1/teachers/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(teacherData),
  });
  if (!response.ok) {
    throw new Error('Failed to create teacher');
  }
  return response.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Interfaces for Curriculum Schedule
export interface CurriculumSchedule {
  id: number;
  name: string;
  course_id: number;
  disciplines: Discipline[];
}

export interface CurriculumScheduleCreateRequest {
  name: string;
  course_id: number;
  discipline_ids: number[];
}

// API function to create a curriculum schedule
export async function createCurriculumSchedule(data: CurriculumScheduleCreateRequest): Promise<CurriculumSchedule> {
  const response = await fetch(`${API_BASE}/api/v1/curriculum-schedules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create curriculum schedule');
  }
  return response.json();
}

// Add a prerequisite to a discipline
export async function addPrerequisiteToDiscipline(disciplineId: number, prerequisiteId: number): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/${disciplineId}/prerequisites/${prerequisiteId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to add prerequisite to discipline');
  }
  return response.json();
}

// Add discipline to a course
export async function addCourseToDiscipline(disciplineId: number, courseId: number): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/${disciplineId}/courses/${courseId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to add course to discipline');
  }
  return response.json();
}

// Remove discipline from a course
export async function removeCourseFromDiscipline(disciplineId: number, courseId: number): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/${disciplineId}/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to remove course from discipline');
  }
  return response.json();
}

// API function to assign a curriculum schedule to a student
export async function assignCurriculumScheduleToStudent(studentId: number, curriculumScheduleId: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${studentId}/assign-curriculum/${curriculumScheduleId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to assign curriculum schedule to student');
  }
  return response.json();
}

// API function to update the status of a discipline for a student
export async function updateStudentDisciplineStatus(studentId: number, disciplineId: number, status: string): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${studentId}/disciplines/${disciplineId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update student discipline status');
  }
  return response.json();
}

// API function to change student's course without modifying disciplines
export async function changeStudentCourse(studentId: number, newCourseId: number): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/v1/students/${studentId}/change-course/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ course_id: newCourseId }),
  });
  if (!response.ok) {
    throw new Error('Failed to change student course');
  }
  return response.json();
}

// Graph Insights API functions
export interface GraphNode {
  id: number;
  name: string;
}

export interface GraphEdge {
  source: number;
  target: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export interface StudentProgress {
  positions: Record<number, [number, number]>;
  statuses: Record<number, string>;
  labels: Record<number, string>;
}

export interface DisciplineRecommendation {
  id: number;
  name: string;
  prereqs: number[];
}

export interface GraduationPath {
  path: number[];
}

export async function getStudentProgress(userId: number): Promise<StudentProgress> {
  const response = await fetch(`${API_BASE}/api/v1/admin/insights/progress/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch student progress');
  }
  return response.json();
}

export async function getDisciplineRecommendations(userId: number): Promise<DisciplineRecommendation[]> {
  const response = await fetch(`${API_BASE}/api/v1/insights/recommendations/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch discipline recommendations');
  }
  const data = await response.json();
  return data.recommendations || [];
}

export async function getGraduationPath(userId: number, requiredIds: number[]): Promise<GraduationPath> {
  const response = await fetch(`${API_BASE}/api/v1/admin/insights/graduation-path/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ required_ids: requiredIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch graduation path');
  }
  return response.json();
}

export async function getGraphData(): Promise<GraphData> {
  const response = await fetch(`${API_BASE}/api/v1/admin/insights/graph`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch graph data');
  }
  return response.json();
}
