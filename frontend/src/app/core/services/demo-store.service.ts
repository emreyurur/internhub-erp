import { Injectable } from '@angular/core';
import {
  AssignmentItem,
  CompleteTaskRequest,
  CreateAssignmentRequest,
  CreateInternRequest,
  CreateInternResponse,
  CreateInternTaskRequest,
  CreateMentorRequest,
  CreateMentorResponse,
  InternItem,
  InternProfile,
  InternTaskDetail,
  InternTaskItem,
  MentorItem,
  UpdateAssignmentRequest,
  UpdateInternTaskRequest,
  UserSession,
} from '../models/domain.models';

interface DemoAccount extends UserSession {
  password: string;
}

interface DemoState {
  nextId: number;
  admins: DemoAccount[];
  mentors: (MentorItem & { password: string })[];
  interns: (InternItem & { password: string })[];
  assignments: AssignmentItem[];
  internTasks: InternTaskItem[];
}

const STORAGE_KEY = 'internhub_erp_demo_v2';

function daysFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

function createInitialState(): DemoState {
  return {
    nextId: 100,
    admins: [
      {
        id: 1,
        name: 'Alex',
        lastname: 'Mercer',
        email: 'admin@internhub.io',
        password: 'demo',
        department: 'Engineering',
        role: 'Admin',
      },
    ],
    mentors: [
      {
        id: 2,
        name: 'Claire',
        lastname: 'Bennett',
        email: 'claire.bennett@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Frontend',
        internCount: 2,
        role: 'Mentor',
      },
      {
        id: 3,
        name: 'David',
        lastname: 'Kowalski',
        email: 'david.kowalski@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Backend',
        internCount: 2,
        role: 'Mentor',
      },
      {
        id: 4,
        name: 'Hannah',
        lastname: 'Sato',
        email: 'hannah.sato@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Ios',
        internCount: 1,
        role: 'Mentor',
      },
    ],
    interns: [
      {
        id: 10,
        name: 'Maya',
        lastname: 'Patel',
        email: 'maya.patel@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Frontend',
        phone: '+1 (415) 555-0142',
        university: 'Georgia Institute of Technology',
        mentorId: 2,
        mentorName: 'Claire Bennett',
        createdAt: daysFromNow(-14),
        endDate: daysFromNow(16),
        role: 'Intern',
      },
      {
        id: 11,
        name: 'Lucas',
        lastname: 'Meyer',
        email: 'lucas.meyer@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Frontend',
        phone: '+1 (415) 555-0198',
        university: 'University of Waterloo',
        mentorId: 2,
        mentorName: 'Claire Bennett',
        createdAt: daysFromNow(-10),
        endDate: daysFromNow(20),
        role: 'Intern',
      },
      {
        id: 12,
        name: 'Sofia',
        lastname: 'Lindqvist',
        email: 'sofia.lindqvist@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Backend',
        phone: '+1 (206) 555-0134',
        university: 'KTH Royal Institute of Technology',
        mentorId: 3,
        mentorName: 'David Kowalski',
        createdAt: daysFromNow(-18),
        endDate: daysFromNow(12),
        role: 'Intern',
      },
      {
        id: 13,
        name: 'Ethan',
        lastname: 'Brooks',
        email: 'ethan.brooks@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Backend',
        phone: '+1 (617) 555-0177',
        university: 'University of Michigan',
        mentorId: 3,
        mentorName: 'David Kowalski',
        createdAt: daysFromNow(-7),
        endDate: daysFromNow(23),
        role: 'Intern',
      },
      {
        id: 14,
        name: 'Nadia',
        lastname: 'Al-Mansoor',
        email: 'nadia.almansoor@internhub.io',
        password: 'demo',
        department: 'Engineering',
        discipline: 'Ios',
        phone: '+1 (312) 555-0165',
        university: 'University of Toronto',
        mentorId: 4,
        mentorName: 'Hannah Sato',
        createdAt: daysFromNow(-5),
        endDate: daysFromNow(25),
        role: 'Intern',
      },
    ],
    assignments: [
      {
        id: 20,
        title: 'Angular Signals & Modular Feature Architecture',
        description:
          'Implement a signal-driven directory module with strict TypeScript DTO contracts, route guards, and optimistic UI updates.',
        taskType: 'Project',
        createdAt: daysFromNow(-20),
      },
      {
        id: 21,
        title: 'REST API Contract & DTO Boundary Review',
        description:
          'Audit controller responses to ensure internal entity fields are never serialized and HTTP status codes follow RFC 9110.',
        taskType: 'Domain',
        createdAt: daysFromNow(-18),
      },
      {
        id: 22,
        title: 'Weekly 1:1 Engineering Performance Checkpoint',
        description:
          'Review pull request throughput, resolve architectural blockers, and calibrate deliverable milestones for the next sprint.',
        taskType: 'Meeting',
        createdAt: daysFromNow(-15),
      },
      {
        id: 23,
        title: 'EF Core Query Projection & Indexing Audit',
        description:
          'Identify N+1 queries across repository methods and replace over-fetching includes with targeted projection queries.',
        taskType: 'Project',
        createdAt: daysFromNow(-12),
      },
      {
        id: 24,
        title: 'SwiftUI Offline Cache & Concurrency Layer',
        description:
          'Build an async/await network repository with structured cancellation and local state persistence.',
        taskType: 'Project',
        createdAt: daysFromNow(-9),
      },
      {
        id: 25,
        title: 'Git Branching Strategy & Code Review Standards',
        description:
          'Complete onboarding checklist for trunk-based pull requests, conventional commits, and automated CI validation.',
        taskType: 'Domain',
        createdAt: daysFromNow(-16),
      },
    ],
    internTasks: [
      {
        id: 30,
        assignmentId: 25,
        assignedToId: 10,
        assignedById: 2,
        title: 'Git Branching Strategy & Code Review Standards',
        description:
          'Complete onboarding checklist for trunk-based pull requests, conventional commits, and automated CI validation.',
        taskType: 'Domain',
        startDate: daysFromNow(-12),
        deadline: daysFromNow(-5),
        createdAt: daysFromNow(-12),
        isCompleted: true,
        completedAt: daysFromNow(-6),
      },
      {
        id: 31,
        assignmentId: 20,
        assignedToId: 10,
        assignedById: 2,
        title: 'Angular Signals & Modular Feature Architecture',
        description:
          'Implement a signal-driven directory module with strict TypeScript DTO contracts, route guards, and optimistic UI updates.',
        taskType: 'Project',
        startDate: daysFromNow(-5),
        deadline: daysFromNow(3),
        createdAt: daysFromNow(-5),
        isCompleted: false,
        completedAt: null,
      },
      {
        id: 32,
        assignmentId: 22,
        assignedToId: 10,
        assignedById: 2,
        title: 'Weekly 1:1 Engineering Performance Checkpoint',
        description:
          'Review pull request throughput, resolve architectural blockers, and calibrate deliverable milestones for the next sprint.',
        taskType: 'Meeting',
        startDate: daysFromNow(-3),
        deadline: daysFromNow(-1),
        createdAt: daysFromNow(-3),
        isCompleted: false,
        completedAt: null,
      },
      {
        id: 33,
        assignmentId: 20,
        assignedToId: 11,
        assignedById: 2,
        title: 'Angular Signals & Modular Feature Architecture',
        description:
          'Implement a signal-driven directory module with strict TypeScript DTO contracts, route guards, and optimistic UI updates.',
        taskType: 'Project',
        startDate: daysFromNow(-8),
        deadline: daysFromNow(4),
        createdAt: daysFromNow(-8),
        isCompleted: true,
        completedAt: daysFromNow(-1),
      },
      {
        id: 34,
        assignmentId: 21,
        assignedToId: 12,
        assignedById: 3,
        title: 'REST API Contract & DTO Boundary Review',
        description:
          'Audit controller responses to ensure internal entity fields are never serialized and HTTP status codes follow RFC 9110.',
        taskType: 'Domain',
        startDate: daysFromNow(-14),
        deadline: daysFromNow(-4),
        createdAt: daysFromNow(-14),
        isCompleted: true,
        completedAt: daysFromNow(-5),
      },
      {
        id: 35,
        assignmentId: 23,
        assignedToId: 12,
        assignedById: 3,
        title: 'EF Core Query Projection & Indexing Audit',
        description:
          'Identify N+1 queries across repository methods and replace over-fetching includes with targeted projection queries.',
        taskType: 'Project',
        startDate: daysFromNow(-4),
        deadline: daysFromNow(5),
        createdAt: daysFromNow(-4),
        isCompleted: false,
        completedAt: null,
      },
      {
        id: 36,
        assignmentId: 23,
        assignedToId: 13,
        assignedById: 3,
        title: 'EF Core Query Projection & Indexing Audit',
        description:
          'Identify N+1 queries across repository methods and replace over-fetching includes with targeted projection queries.',
        taskType: 'Project',
        startDate: daysFromNow(-6),
        deadline: daysFromNow(-2),
        createdAt: daysFromNow(-6),
        isCompleted: false,
        completedAt: null,
      },
      {
        id: 37,
        assignmentId: 24,
        assignedToId: 14,
        assignedById: 4,
        title: 'SwiftUI Offline Cache & Concurrency Layer',
        description:
          'Build an async/await network repository with structured cancellation and local state persistence.',
        taskType: 'Project',
        startDate: daysFromNow(-3),
        deadline: daysFromNow(7),
        createdAt: daysFromNow(-3),
        isCompleted: false,
        completedAt: null,
      },
    ],
  };
}

@Injectable({ providedIn: 'root' })
export class DemoStoreService {
  private state: DemoState;

  constructor() {
    this.state = this.load();
  }

  private load(): DemoState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as DemoState;
      }
    } catch {
      // Fallback to initial seed
    }
    const seed = createInitialState();
    this.save(seed);
    return seed;
  }

  private save(state: DemoState): void {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues
    }
  }

  reset(): void {
    this.save(createInitialState());
  }

  private generatePassword(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  getDemoAccounts(): {
    label: string;
    email: string;
    role: UserSession['role'];
    scope: string;
  }[] {
    return [
      {
        label: 'Alex Mercer',
        email: 'admin@internhub.io',
        role: 'Admin',
        scope: 'Organization & Directory Control',
      },
      {
        label: 'Claire Bennett',
        email: 'claire.bennett@internhub.io',
        role: 'Mentor',
        scope: 'Frontend Engineering · 2 Interns',
      },
      {
        label: 'Maya Patel',
        email: 'maya.patel@internhub.io',
        role: 'Intern',
        scope: 'Frontend Track · Georgia Tech',
      },
    ];
  }

  login(email: string, password: string): UserSession | null {
    const normalized = email.trim().toLowerCase();
    const admin = this.state.admins.find(
      (a) => a.email.toLowerCase() === normalized && a.password === password
    );
    if (admin) {
      const { password: _, ...session } = admin;
      return session;
    }

    const mentor = this.state.mentors.find(
      (m) => m.email.toLowerCase() === normalized && m.password === password
    );
    if (mentor) {
      return {
        id: mentor.id,
        name: mentor.name,
        lastname: mentor.lastname,
        email: mentor.email,
        department: mentor.department,
        role: 'Mentor',
        discipline: mentor.discipline,
      };
    }

    const intern = this.state.interns.find(
      (i) => i.email.toLowerCase() === normalized && i.password === password
    );
    if (intern) {
      return {
        id: intern.id,
        name: intern.name,
        lastname: intern.lastname,
        email: intern.email,
        department: intern.department,
        role: 'Intern',
        discipline: intern.discipline,
        mentorId: intern.mentorId,
      };
    }

    return null;
  }

  getAllInterns(): InternItem[] {
    return this.state.interns.map(({ password: _, ...item }) => ({ ...item }));
  }

  getAllMentors(): MentorItem[] {
    return this.state.mentors.map(({ password: _, ...item }) => ({
      ...item,
      internCount: this.state.interns.filter((i) => i.mentorId === item.id).length,
    }));
  }

  createIntern(dto: CreateInternRequest): CreateInternResponse {
    const id = ++this.state.nextId;
    const password = this.generatePassword(12);
    const mentor = this.state.mentors.find((m) => m.id === dto.mentorId);
    const createdAt = dto.createdAt || new Date().toISOString();
    const endDate = dto.endDate || daysFromNow(30);

    this.state.interns.unshift({
      id,
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password,
      department: dto.department,
      discipline: dto.discipline,
      phone: dto.phone || null,
      university: dto.university || null,
      mentorId: dto.mentorId ?? null,
      mentorName: mentor ? `${mentor.name} ${mentor.lastname}` : null,
      createdAt,
      endDate,
      role: 'Intern',
    });

    this.save(this.state);
    return { ...dto, id, createdAt, endDate, password };
  }

  deleteIntern(internId: number): boolean {
    const before = this.state.interns.length;
    this.state.interns = this.state.interns.filter((i) => i.id !== internId);
    this.state.internTasks = this.state.internTasks.filter((t) => t.assignedToId !== internId);
    this.save(this.state);
    return this.state.interns.length < before;
  }

  createMentor(dto: CreateMentorRequest): CreateMentorResponse {
    const id = ++this.state.nextId;
    const password = this.generatePassword(12);
    this.state.mentors.unshift({
      id,
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password,
      department: dto.department,
      discipline: dto.discipline,
      internCount: 0,
      role: 'Mentor',
    });
    this.save(this.state);
    return { ...dto, id, password };
  }

  deleteMentor(mentorId: number): boolean {
    const before = this.state.mentors.length;
    this.state.mentors = this.state.mentors.filter((m) => m.id !== mentorId);
    this.state.interns = this.state.interns.map((i) =>
      i.mentorId === mentorId ? { ...i, mentorId: null, mentorName: null } : i
    );
    this.save(this.state);
    return this.state.mentors.length < before;
  }

  getAllAssignments(): AssignmentItem[] {
    return this.state.assignments.map((a) => ({ ...a }));
  }

  createAssignment(dto: CreateAssignmentRequest): AssignmentItem {
    const item: AssignmentItem = {
      id: ++this.state.nextId,
      title: dto.title,
      description: dto.description,
      taskType: dto.taskType,
      createdAt: new Date().toISOString(),
    };
    this.state.assignments.unshift(item);
    this.save(this.state);
    return item;
  }

  updateAssignment(dto: UpdateAssignmentRequest): AssignmentItem | null {
    const target = this.state.assignments.find((a) => a.id === dto.id);
    if (!target) return null;
    if (dto.title !== undefined) target.title = dto.title;
    if (dto.description !== undefined) target.description = dto.description;
    if (dto.taskType !== undefined) target.taskType = dto.taskType;

    this.state.internTasks = this.state.internTasks.map((t) =>
      t.assignmentId === target.id
        ? { ...t, title: target.title, description: target.description, taskType: target.taskType }
        : t
    );

    this.save(this.state);
    return { ...target };
  }

  deleteAssignment(id: number): boolean {
    const before = this.state.assignments.length;
    this.state.assignments = this.state.assignments.filter((a) => a.id !== id);
    this.state.internTasks = this.state.internTasks.filter((t) => t.assignmentId !== id);
    this.save(this.state);
    return this.state.assignments.length < before;
  }

  getInternsByMentorId(mentorId: number): InternItem[] {
    return this.state.interns
      .filter((i) => i.mentorId === mentorId)
      .map(({ password: _, ...item }) => ({ ...item }));
  }

  getTasksByInternId(internId: number): InternTaskItem[] {
    return this.state.internTasks
      .filter((t) => t.assignedToId === internId)
      .map((t) => ({ ...t }));
  }

  createInternTask(dto: CreateInternTaskRequest): InternTaskItem {
    const assignment = this.state.assignments.find((a) => a.id === dto.assignmentId);
    const item: InternTaskItem = {
      id: ++this.state.nextId,
      assignmentId: dto.assignmentId,
      assignedToId: dto.assignedToId,
      assignedById: dto.assignedById,
      title: assignment?.title ?? 'Task',
      description: assignment?.description ?? '',
      taskType: assignment?.taskType ?? 'Project',
      startDate: dto.startDate,
      deadline: dto.deadline,
      isCompleted: dto.isCompleted ?? false,
      createdAt: new Date().toISOString(),
      completedAt: dto.isCompleted ? new Date().toISOString() : null,
    };
    this.state.internTasks.unshift(item);
    this.save(this.state);
    return item;
  }

  updateInternTask(dto: UpdateInternTaskRequest): InternTaskItem | null {
    const target = this.state.internTasks.find((t) => t.id === dto.id);
    if (!target) return null;
    if (dto.assignmentId !== undefined) {
      target.assignmentId = dto.assignmentId;
      const assignment = this.state.assignments.find((a) => a.id === dto.assignmentId);
      if (assignment) {
        target.title = assignment.title;
        target.description = assignment.description;
        target.taskType = assignment.taskType;
      }
    }
    if (dto.assignedToId !== undefined) target.assignedToId = dto.assignedToId;
    if (dto.startDate !== undefined) target.startDate = dto.startDate;
    if (dto.deadline !== undefined) target.deadline = dto.deadline;
    if (dto.isCompleted !== undefined) {
      target.isCompleted = dto.isCompleted;
      target.completedAt = dto.isCompleted ? new Date().toISOString() : null;
    }
    this.save(this.state);
    return { ...target };
  }

  deleteInternTask(taskId: number): boolean {
    const before = this.state.internTasks.length;
    this.state.internTasks = this.state.internTasks.filter((t) => t.id !== taskId);
    this.save(this.state);
    return this.state.internTasks.length < before;
  }

  getInternProfile(internId: number): InternProfile | null {
    const intern = this.state.interns.find((i) => i.id === internId);
    if (!intern) return null;
    const mentor = this.state.mentors.find((m) => m.id === intern.mentorId);
    return {
      id: intern.id,
      name: intern.name,
      lastname: intern.lastname,
      email: intern.email,
      department: intern.department,
      mentorName: mentor?.name ?? 'Unassigned',
      mentorLastname: mentor?.lastname ?? '',
      mentorDiscipline: mentor?.discipline ?? intern.discipline,
      role: 'Intern',
    };
  }

  getTaskDetail(taskId: number): InternTaskDetail | null {
    const task = this.state.internTasks.find((t) => t.id === taskId);
    if (!task) return null;
    const intern = this.state.interns.find((i) => i.id === task.assignedToId);
    const mentor = this.state.mentors.find((m) => m.id === (intern?.mentorId ?? task.assignedById));
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      isCompleted: task.isCompleted,
      internName: intern ? `${intern.name} ${intern.lastname}` : 'N/A',
      mentorName: mentor ? `${mentor.name} ${mentor.lastname}` : 'N/A',
      createdAt: task.createdAt,
      startDate: task.startDate,
      completedAt: task.completedAt,
    };
  }

  completeTask(dto: CompleteTaskRequest): InternTaskItem | null {
    const target = this.state.internTasks.find((t) => t.id === dto.id);
    if (!target) return null;
    target.isCompleted = dto.isCompleted;
    target.completedAt = dto.isCompleted ? new Date().toISOString() : null;
    this.save(this.state);
    return { ...target };
  }
}
