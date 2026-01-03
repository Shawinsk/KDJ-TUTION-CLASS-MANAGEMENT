# Tuition Class Management System - Implementation Checklist

This document outlines the roadmap and features required to build a complete Tuition Class Management System.

## 1. User & Role Management (✅ Completed)

- [x] **Authentication**: Login, Register (Sign Up), Logout.
- [x] **Dashboard**: Responsive Layout, Sidebar Navigation.
- [x] **User Management**:
  - [x] List all System Users (Admins, Tutors, Students).
  - [x] Add New User (with Role selection).
  - [x] Edit User Details (Name, Role).
  - [x] Delete User (Removes from Profile & Auth).
  - [x] Search Users.

## 2. Student Management 🎓(✅ Completed)

- [x] **Student Registration**: Detailed form (School, Birthday, Parent Name, Contact No, Address).
- [x] **Student Profile**: Individual view with their classes and payments.
- [x] **Enrollment**: Assign students to specific Classes/Subjects.
- [ ] **ID Card System**: (Future)

## 3. Class & Schedule Management 📅(✅ Completed)

- [x] **Manage Subjects**: Add Subjects & Grades.
- [x] **Create Classes**: Link a Subject + Tutor + Schedule + Fee.
- [x] **Edit/Delete**: Full management capabilities.
- [x] **Hall Allocation**: Assign classrooms/halls to classes.

## 4. Attendance System 📝(✅ Completed)

- [x] **Data Structure**: Create `attendance` table.
- [x] **Mark Attendance**: Manual Selection (Present/Absent).
- [x] **Save & Load**: Persist to Database.

## 5. Payments & Finance 💰(✅ Completed)

- [x] **Fee Collection**: Accept monthly fees for classes.
- [x] **Payment Recording**: Record Cash/Online payments against a student.
- [x] **Payments List**: View history.

## 6. Exam & Results 📊 (Next Priority)

- [ ] **Create Exams**: Define exams for classes.
- [ ] **Marks Entry**: Enter marks for exams held.
- [ ] **Results View**: View student performance.

## 7. Tutor Management 👨‍🏫 (Pending)

- [ ] **Tutor View**: Restricted dashboard for Tutors.
