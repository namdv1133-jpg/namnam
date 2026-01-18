
export enum Role {
  GIAM_DOC = 'Giám đốc',
  TRUONG_PHONG = 'Trưởng phòng',
  NHAN_VIEN = 'Nhân viên'
}

export enum TaskType {
  FLOORING = 'Lát sàn',
  DESIGN_3D = 'Thiết kế 3D',
  WALL_PANEL = 'Thi công tấm ốp',
  PARTNER_CARE = 'Chăm sóc đối tác (khách hàng)'
}

export enum TaskStatus {
  TODO = 'Chưa làm',
  DOING = 'Đang làm',
  OVERDUE = 'Trễ',
  DONE = 'Xong'
}

export enum Priority {
  HIGH = 'Quan trọng',
  NORMAL = 'Bình thường'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Active' | 'Completed';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  type: TaskType;
  priority: Priority;
  assigneeId: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  progress: number; // 0-100
  notes: string;
}
