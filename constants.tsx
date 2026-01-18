
import { Role, TaskType, TaskStatus, Priority, User, Project, Task } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn Giám Đốc', email: 'giamdoc@tlux.vn', role: Role.GIAM_DOC, avatar: 'https://picsum.photos/seed/director/100' },
  { id: 'u2', name: 'Trần Thị Trưởng Phòng', email: 'truongphong@tlux.vn', role: Role.TRUONG_PHONG, avatar: 'https://picsum.photos/seed/manager/100' },
  { id: 'u3', name: 'Lê Văn Nhân Viên', email: 'nhanvien@tlux.vn', role: Role.NHAN_VIEN, avatar: 'https://picsum.photos/seed/staff/100' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Chung cư Vinhomes Central Park', client: 'Anh Hùng', status: 'Active' },
  { id: 'p2', name: 'Biệt thự Thảo Điền', client: 'Chị Lan', status: 'Active' },
  { id: 'p3', name: 'Văn phòng FPT Tower', client: 'FPT Corp', status: 'Completed' },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: 't1', 
    projectId: 'p1', 
    title: 'Lát sàn gỗ phòng khách', 
    type: TaskType.FLOORING, 
    priority: Priority.HIGH,
    assigneeId: 'u3', 
    startDate: '2024-05-10', 
    endDate: '2024-05-12', 
    status: TaskStatus.DONE, 
    progress: 100, 
    notes: 'Sàn gỗ công nghiệp 12mm cao cấp' 
  },
  { 
    id: 't2', 
    projectId: 'p1', 
    title: 'Thi công tấm ốp tường PVC', 
    type: TaskType.WALL_PANEL, 
    priority: Priority.NORMAL,
    assigneeId: 'u3', 
    startDate: '2025-02-10', 
    endDate: '2025-02-25', 
    status: TaskStatus.DOING, 
    progress: 45, 
    notes: 'Kiểm tra kỹ các mối nối keo' 
  },
  { 
    id: 't3', 
    projectId: 'p2', 
    title: 'Phối cảnh 3D phòng ngủ', 
    type: TaskType.DESIGN_3D, 
    priority: Priority.HIGH,
    assigneeId: 'u2', 
    startDate: '2024-01-01', 
    endDate: '2024-01-05', 
    status: TaskStatus.OVERDUE, 
    progress: 80, 
    notes: 'Khách hàng yêu cầu thêm hiệu ứng ánh sáng' 
  },
  { 
    id: 't4', 
    projectId: 'p2', 
    title: 'Tư vấn hợp đồng sàn nhựa', 
    type: TaskType.PARTNER_CARE, 
    priority: Priority.NORMAL,
    assigneeId: 'u2', 
    startDate: '2025-02-15', 
    endDate: '2025-02-20', 
    status: TaskStatus.TODO, 
    progress: 0, 
    notes: 'Dự án nhà phố Quận 7' 
  }
];
