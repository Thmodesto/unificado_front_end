const API_BASE = import.meta.env.DEV ? ' ' : 'https://fp4pagmp8f.us-east-1.awsapprunner.com';
//const API_BASE = 'https://fp4pagmp8f.us-east-1.awsapprunner.com';

export interface Course {
  id: number;
  name: string;
}

export interface Discipline {
  id: number;
  name: string;
  course_ids: number[];
  prerequisites: number[];
}

export interface Teacher {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  employee_number?: string;
  disciplines: Discipline[];
}

export interface Student {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  ra_number?: string;
  disciplines: Discipline[];
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
  disciplines?: number[];
}

export interface StudentUpdateRequest {
  username?: string;
  email?: string;
  ra_number?: string;
  is_active?: boolean;
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
    throw new Error('Failed to add discipline to teacher');
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
