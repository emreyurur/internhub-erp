import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  AssignmentItem,
  CompleteTaskRequest,
  CreateAssignmentRequest,
  CreateInternRequest,
  CreateInternResponse,
  CreateInternTaskRequest,
  CreateMentorRequest,
  CreateMentorResponse,
  Discipline,
  InternItem,
  InternProfile,
  InternTaskDetail,
  InternTaskItem,
  MentorItem,
  UpdateAssignmentRequest,
  UpdateInternTaskRequest,
} from '../models/domain.models';
import { AuthService } from './auth.service';
import { DemoStoreService } from './demo-store.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly demo = inject(DemoStoreService);

  private get base(): string {
    return this.auth.apiBaseUrl();
  }

  private get isDemo(): boolean {
    return this.auth.mode() === 'demo';
  }

  // Enums
  async getDepartments(): Promise<string[]> {
    if (this.isDemo) return ['Engineering', 'HR', 'Marketing'];
    return firstValueFrom(this.http.get<string[]>(`${this.base}/api/Enums/departments`));
  }

  async getDisciplines(): Promise<Discipline[]> {
    if (this.isDemo) return ['Ios', 'Android', 'Backend', 'Frontend', 'BusinessAnalyst'];
    return firstValueFrom(this.http.get<Discipline[]>(`${this.base}/api/Enums/disciplines`));
  }

  // Admin
  async getAllInterns(): Promise<InternItem[]> {
    if (this.isDemo) return this.demo.getAllInterns();
    return firstValueFrom(this.http.get<InternItem[]>(`${this.base}/api/Admin/Interns`));
  }

  async getAllMentors(): Promise<MentorItem[]> {
    if (this.isDemo) return this.demo.getAllMentors();
    return firstValueFrom(this.http.get<MentorItem[]>(`${this.base}/api/Admin/Mentors`));
  }

  async createIntern(dto: CreateInternRequest): Promise<CreateInternResponse> {
    if (this.isDemo) return this.demo.createIntern(dto);
    return firstValueFrom(
      this.http.post<CreateInternResponse>(`${this.base}/api/Admin/CreateIntern`, dto)
    );
  }

  async deleteIntern(internId: number): Promise<boolean> {
    if (this.isDemo) return this.demo.deleteIntern(internId);
    return firstValueFrom(
      this.http.delete<boolean>(`${this.base}/api/Admin/DeleteIntern/${internId}`)
    );
  }

  async createMentor(dto: CreateMentorRequest): Promise<CreateMentorResponse> {
    if (this.isDemo) return this.demo.createMentor(dto);
    return firstValueFrom(
      this.http.post<CreateMentorResponse>(`${this.base}/api/Admin/CreateMentor`, dto)
    );
  }

  async deleteMentor(mentorId: number): Promise<boolean> {
    if (this.isDemo) return this.demo.deleteMentor(mentorId);
    return firstValueFrom(
      this.http.delete<boolean>(`${this.base}/api/Admin/DeleteMentor/${mentorId}`)
    );
  }

  // Assignments (note backend controller spelling: Assigment)
  async getAllAssignments(): Promise<AssignmentItem[]> {
    if (this.isDemo) return this.demo.getAllAssignments();
    return firstValueFrom(this.http.get<AssignmentItem[]>(`${this.base}/api/Assigment`));
  }

  async createAssignment(dto: CreateAssignmentRequest): Promise<AssignmentItem> {
    if (this.isDemo) return this.demo.createAssignment(dto);
    return firstValueFrom(this.http.post<AssignmentItem>(`${this.base}/api/Assigment`, dto));
  }

  async updateAssignment(dto: UpdateAssignmentRequest): Promise<AssignmentItem | null> {
    if (this.isDemo) return this.demo.updateAssignment(dto);
    return firstValueFrom(this.http.patch<AssignmentItem>(`${this.base}/api/Assigment`, dto));
  }

  async deleteAssignment(id: number): Promise<boolean> {
    if (this.isDemo) return this.demo.deleteAssignment(id);
    return firstValueFrom(this.http.delete<boolean>(`${this.base}/api/Assigment/${id}`));
  }

  // Mentor
  async getInternsByMentorId(mentorId: number): Promise<InternItem[]> {
    if (this.isDemo) return this.demo.getInternsByMentorId(mentorId);
    return firstValueFrom(
      this.http.get<InternItem[]>(`${this.base}/api/Mentor/interns/${mentorId}`)
    );
  }

  async getTasksByInternId(internId: number): Promise<InternTaskItem[]> {
    if (this.isDemo) return this.demo.getTasksByInternId(internId);
    return firstValueFrom(
      this.http.get<InternTaskItem[]>(`${this.base}/api/Mentor/InternTasks/${internId}`)
    );
  }

  async createInternTask(dto: CreateInternTaskRequest): Promise<unknown> {
    if (this.isDemo) return this.demo.createInternTask(dto);
    return firstValueFrom(
      this.http.post(`${this.base}/api/Mentor/CreateInternTask`, dto)
    );
  }

  async updateInternTask(dto: UpdateInternTaskRequest): Promise<unknown> {
    if (this.isDemo) return this.demo.updateInternTask(dto);
    return firstValueFrom(
      this.http.patch(`${this.base}/api/Mentor/UpdateInternTask`, dto)
    );
  }

  async deleteInternTask(taskId: number): Promise<boolean> {
    if (this.isDemo) return this.demo.deleteInternTask(taskId);
    return firstValueFrom(
      this.http.delete<boolean>(`${this.base}/api/Mentor/DeleteInternTask/${taskId}`)
    );
  }

  // Intern / User
  async getInternProfile(internId: number): Promise<InternProfile | null> {
    if (this.isDemo) return this.demo.getInternProfile(internId);
    return firstValueFrom(
      this.http.get<InternProfile>(`${this.base}/api/User/intern/${internId}`)
    );
  }

  async getTasksByUserId(userId: number): Promise<InternTaskItem[]> {
    if (this.isDemo) return this.demo.getTasksByInternId(userId);
    return firstValueFrom(
      this.http.get<InternTaskItem[]>(`${this.base}/api/User/GetAllTaskByUserId/${userId}`)
    );
  }

  async getTaskDetail(taskId: number): Promise<InternTaskDetail | null> {
    if (this.isDemo) return this.demo.getTaskDetail(taskId);
    return firstValueFrom(
      this.http.get<InternTaskDetail>(`${this.base}/api/User/TaskById/${taskId}`)
    );
  }

  async completeTask(dto: CompleteTaskRequest): Promise<InternTaskItem | null> {
    if (this.isDemo) return this.demo.completeTask(dto);
    return firstValueFrom(
      this.http.patch<InternTaskItem>(`${this.base}/api/User/complete-task`, dto)
    );
  }
}

