const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Course {
  id: number;
  name: string;
  credits: number;
}

export interface Discipline {
  id: number;
  name: string;
  credits: number;
  course_id: number;
  prerequisites: number[];
  warnings?: string[];
}

export interface CreateCourseRequest {
  name: string;
}

export interface CreateDisciplineRequest {
  name: string;
  course_id: number;
  prerequisites?: number[];
}

export async function getCourses(skip = 0, limit = 10): Promise<Course[]> {
  const response = await fetch(`${API_BASE}/courses/?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function createCourse(course: CreateCourseRequest): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });
  if (!response.ok) {
    throw new Error('Failed to create course');
  }
  return response.json();
}

export async function getCourse(id: number): Promise<Course> {
  const response = await fetch(`${API_BASE}/courses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}

export async function getDisciplines(skip = 0, limit = 10): Promise<Discipline[]> {
  const response = await fetch(`${API_BASE}/disciplines/?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch disciplines');
  }
  return response.json();
}

export async function createDiscipline(discipline: CreateDisciplineRequest): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/disciplines/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discipline),
  });
  if (!response.ok) {
    throw new Error('Failed to create discipline');
  }
  return response.json();
}

export async function getDiscipline(id: number): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/disciplines/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch discipline');
  }
  return response.json();
}

export async function addPrerequisite(disciplineId: number, prerequisiteId: number): Promise<Discipline> {
  const response = await fetch(`${API_BASE}/disciplines/${disciplineId}/prerequisites/${prerequisiteId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to add prerequisite');
  }
  return response.json();
}
