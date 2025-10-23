# TODO - Admin Dashboard

## API Functions to Add
- [x] createCourse(courseData: CourseCreateRequest): Promise<Course>
- [x] createDiscipline(disciplineData: DisciplineCreateRequest): Promise<Discipline>
- [x] updateStudent(id: number, studentData: StudentUpdateRequest): Promise<Student>
- [x] updateTeacher(id: number, teacherData: TeacherUpdateRequest): Promise<Teacher>
- [x] getAllUsers(showInactive?: boolean, skip?: number, limit?: number): Promise<UserListResponse>
- [x] toggleUserActive(id: number): Promise<{message: string, user: UserPublic}>
- [x] addDisciplineToStudent(studentId: number, disciplineId: number): Promise<Student>
- [x] removeDisciplineFromStudent(studentId: number, disciplineId: number): Promise<Student>
- [x] addDisciplineToTeacher(teacherId: number, disciplineId: number): Promise<Teacher>
- [x] removeDisciplineFromTeacher(teacherId: number, disciplineId: number): Promise<Teacher>

## Admin Dashboard Page
- [x] Create src/pages/AdminDashboard/index.tsx
- [x] Implement header with title
- [x] Create accordion sections for each management area
- [x] Add forms for creating courses, disciplines, students, teachers
- [x] Add RA field to student creation and edit forms
- [x] Add employee_number field to teacher creation and edit forms
- [x] Add tables for listing users, courses, disciplines
- [x] Add edit functionality for students and teachers
- [x] Add toggle active/inactive for users
- [x] Add discipline management (add/remove from students/teachers)

## UI Components
- [x] Use existing UI components (Accordion, Button, Input, etc.)
- [x] Style consistently with existing dashboards
- [x] Add loading states and error handling
- [x] Add success/error messages for actions

## Testing
- [ ] Test all CRUD operations
- [ ] Test user role restrictions (admin only)
- [ ] Test form validations
- [ ] Test responsive design
