const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Course {
  id: number;
  name: string;
}

export interface Discipline {
  id: number;
  name: string;
  course_id: number;
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

export interface LoginRequest {
  identifier: string;
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

export async function getDisciplines(skip = 0, limit = 10): Promise<Discipline[]> {
  const response = await fetch(`${API_BASE}/api/v1/disciplines/?skip=${skip}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch disciplines');
  }
  return response.json();
}

export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
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
  if (!response.ok) {
    throw new Error('Failed to fetch student');
  }
  return response.json();
}

export interface StudentCreateRequest {
  username: string;
  email?: string;
  password: string;
  ra_number?: string;
  disciplines?: number[];
}

export interface TeacherCreateRequest {
  username: string;
  email?: string;
  password: string;
  employee_number?: string;
  disciplines?: number[];
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
