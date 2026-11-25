export type Role = 'Admin' | 'Mentor' | 'Intern';
export type Discipline = 'Ios' | 'Android' | 'Backend' | 'Frontend' | 'BusinessAnalyst';
export type TaskType = 'Project' | 'Domain' | 'Meeting';
export type AppMode = 'demo' | 'api';

export interface UserSession {
  id: number;
  name: string;
  lastname: string;
  email: string;
  department: string;
  role: Role;
  discipline?: Discipline | null;
  mentorId?: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface InternItem {
  id: number;
  name: string;
  lastname: string;
  email: string;
  department: string;
  discipline: Discipline;
  phone?: string | null;
  university?: string | null;
  mentorId?: number | null;
  mentorName?: string | null;
  createdAt: string;
  endDate?: string | null;
  role: Role;
}

export interface CreateInternRequest {
  name: string;
  lastname: string;
  email: string;
  department: string;
  discipline: Discipline;
  phone?: string;
  university?: string;
  mentorId?: number | null;
  role: 'Intern';
  createdAt?: string;
  endDate?: string;
}

export interface CreateInternResponse extends CreateInternRequest {
  id: number;
  password: string;
}

export interface MentorItem {
  id: number;
  name: string;
  lastname: string;
  email: string;
  department: string;
  discipline: Discipline;
  internCount: number;
  role: Role;
}

export interface CreateMentorRequest {
  name: string;
  lastname: string;
  email: string;
  department: string;
  discipline: Discipline;
  role: 'Mentor';
}

export interface CreateMentorResponse extends CreateMentorRequest {
  id: number;
  password: string;
}

export interface AssignmentItem {
  id: number;
  title: string;
  description: string;
  taskType: TaskType;
  createdAt: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  taskType: TaskType;
}

export interface UpdateAssignmentRequest {
  id: number;
  title?: string;
  description?: string;
  taskType?: TaskType;
}

export interface InternTaskItem {
  id: number;
  assignmentId: number;
  assignedToId: number;
  assignedById: number;
  title: string;
  description: string;
  taskType?: TaskType;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  startDate: string;
  completedAt?: string | null;
}

export interface InternTaskDetail {
  id: number;
  title: string;
  description: string;
  deadline: string;
  isCompleted: boolean;
  internName: string;
  mentorName: string;
  createdAt: string;
  startDate: string;
  completedAt?: string | null;
}

export interface CreateInternTaskRequest {
  assignmentId: number;
  assignedToId: number;
  assignedById: number;
  startDate: string;
  deadline: string;
  isCompleted?: boolean;
}

export interface UpdateInternTaskRequest {
  id: number;
  assignmentId?: number;
  assignedToId?: number;
  assignedById?: number;
  startDate?: string;
  deadline?: string;
  isCompleted?: boolean;
  completedAt?: string | null;
}

export interface CompleteTaskRequest {
  id: number;
  isCompleted: boolean;
}

export interface InternProfile {
  id: number;
  name: string;
  lastname: string;
  email: string;
  department: string;
  mentorName?: string | null;
  mentorLastname?: string | null;
  mentorDiscipline: Discipline;
  role: Role;
}

