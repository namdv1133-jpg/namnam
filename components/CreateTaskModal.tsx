
import React, { useState, useEffect } from 'react';
import { Task, TaskType, TaskStatus, Priority, User, Project } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTask: Omit<Task, 'id'>) => void;
  users: User[];
  projects: Project[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSave, users, projects }) => {
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    type: TaskType.FLOORING,
    priority: Priority.NORMAL,
    assigneeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: TaskStatus.TODO,
    progress: 0,
    notes: ''
  });

  // Cập nhật assigneeId mặc định khi danh sách users thay đổi
  useEffect(() => {
    if (users.length > 0 && !formData.assigneeId) {
      setFormData(prev => ({ ...prev, assigneeId: users[0].id }));
    }
  }, [users]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assigneeId) return alert("Vui lòng chọn người phụ trách");
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Giao việc mới</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên công việc */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên công việc</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Nhập tên công việc cụ thể..."
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Dự án & Loại */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dự án</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.projectId}
                onChange={e => setFormData({...formData, projectId: e.target.value})}
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hạng mục (Loại)</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as TaskType})}
              >
                {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Người phụ trách & Ưu tiên */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Người phụ trách (Dựa theo cấp bậc)</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.assigneeId}
                onChange={e => setFormData({...formData, assigneeId: e.target.value})}
              >
                {users.length === 0 ? (
                  <option disabled>Không có nhân sự phù hợp để giao</option>
                ) : (
                  users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mức độ ưu tiên</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Ngày bắt đầu & Kết thúc */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ngày bắt đầu</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ngày kết thúc (Hạn chót)</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>

            {/* Trạng thái & Tiến độ */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trạng thái ban đầu</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
              >
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tiến độ hiện tại ({formData.progress}%)</label>
              <input 
                type="range" 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                min="0" max="100"
                value={formData.progress}
                onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})}
              />
            </div>

            {/* Ghi chú */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ghi chú / Yêu cầu chi tiết</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Mô tả cụ thể nội dung công việc, lưu ý vật liệu..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              Tạo & Giao việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
