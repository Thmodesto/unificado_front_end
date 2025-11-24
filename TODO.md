# TODO - Frontend update to reflect local API changes (excluding graphs)

## Completed:
- Updated src/lib/api.ts to reflect discipline status field.
- Updated Dashboard to display discipline status.

## New Features to Implement (per backend improvements report):
- Create frontend UI and logic for creating Curriculum Schedules.
- Create frontend UI and logic for assigning a Curriculum Schedule to a student.
- Create frontend UI and logic for changing a student's course without modifying disciplines.

## Step 1 - Curriculum Schedule Creation
- Add form for creating curriculum schedules: name, course, and selecting disciplines.
- Connect to API function createCurriculumSchedule.

## Step 2 - Assign Curriculum Schedule to Student
- Add UI to select a student and assign a created curriculum schedule.
- Connect to API function assignCurriculumScheduleToStudent.

## Step 3 - Change Student Course Feature
- UI to change student's course without modifying disciplines.
- Connect to API function changeStudentCourse.

## Step 4 - Testing & Verification
- Test all new features for correct API interaction and UI behavior.
- Verify no regressions on existing Dashboard features.
