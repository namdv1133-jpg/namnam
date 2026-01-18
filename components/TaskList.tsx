
import React from 'react';
import { Task, TaskStatus, TaskType, Priority, Role, User } from '../types';
import { MOCK_USERS } from '../constants';

interface TaskListProps {
  tasks: Task[];
  currentUser: User;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onFilterUser: (userId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, currentUser, onUpdateProgress, onUpdateStatus, onFilterUser }) => {
  const getDeadlineBadge = (endDate: string, status: TaskStatus) => {
    if (status === TaskStatus.DONE) return <span className="text-[9px] text-emerald-600 font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">HOÀN TẤT</span>;
    const today = new Date();
    const deadline = new Date(endDate);
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-[10px] text-rose-600 font-black bg-rose-50 px-3 py-1 rounded-xl border border-rose-100 animate-pulse uppercase">Quá hạn {Math.abs(diffDays)}d</span>;
    if (diffDays <= 3) return <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 uppercase tracking-tighter">Ưu tiên gấp ({diffDays}d)</span>;
    return <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-40">Còn {diffDays} ngày</span>;
  };

  const getTypeStyle = (type: TaskType) => {
    switch (type) {
      case TaskType.FLOORING:
        return 'bg-blue-600 text-white shadow-blue-100';
      case TaskType.DESIGN_3D:
        return 'bg-violet-600 text-white shadow-violet-100';
      case TaskType.WALL_PANEL:
        return 'bg-amber-500 text-white shadow-amber-100';
      case TaskType.PARTNER_CARE:
        return 'bg-emerald-600 text-white shadow-emerald-100';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="bg-slate-900/5 border-b border-slate-100">
            <tr>
              <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Hạng mục & Ưu tiên</th>
              <th className="px-6 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Thực hiện</th>
              <th className="px-4 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Thời hạn</th>
              <th className="px-4 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Trạng thái</th>
              <th className="px-4 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Tiến độ</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-12 py-32 text-center">
                  <div className="text-8xl mb-8 opacity-10">🏢</div>
                  <p className="text-lg font-black text-slate-300 uppercase tracking-[0.4em]">Hệ thống trống</p>
                </td>
              </tr>
            ) : tasks.map((task) => {
              const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);
              const canEdit = currentUser.role !== Role.NHAN_VIEN || task.assigneeId === currentUser.id;

              return (
                <tr key={task.id} className="hover:bg-blue-50/20 transition-all duration-300 group">
                  <td className="px-12 py-8 align-top">
                    <div className="flex items-center gap-4">
                      <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-lg tracking-tight">{task.title}</div>
                      {task.priority === Priority.HIGH && (
                        <span className="bg-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-rose-200 uppercase tracking-widest">Gấp</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium line-clamp-1 max-w-[320px] italic">"{task.notes || 'Không có ghi chú chi tiết'}"</div>
                    <div className="mt-5">
                      <span className={`px-4 py-1.5 rounded-[1rem] text-[9px] font-black uppercase shadow-xl ${getTypeStyle(task.type)}`}>
                        {task.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-8 align-top">
                    <button 
                      onClick={() => onFilterUser(task.assigneeId)}
                      className="flex items-center gap-4 hover:bg-white px-4 py-3 rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group/user"
                    >
                      <img src={assignee?.avatar} className="w-10 h-10 rounded-[1.2rem] border-2 border-white shadow-lg group-hover/user:rotate-12 transition-transform" alt="" />
                      <div>
                        <span className="text-sm font-black text-slate-700 block group-hover/user:text-blue-600">{assignee?.name}</span>
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{assignee?.role}</span>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-8 align-top">
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-sm text-slate-900 font-black tracking-tight">{new Date(task.endDate).toLocaleDateString('vi-VN')}</span>
                      {getDeadlineBadge(task.endDate, task.status)}
                    </div>
                  </td>
                  <td className="px-4 py-8 align-top">
                     <select 
                      disabled={!canEdit}
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-[10px] font-black py-2.5 px-5 rounded-[1.2rem] border-2 focus:ring-8 transition-all outline-none cursor-pointer shadow-lg disabled:opacity-50
                        ${task.status === TaskStatus.DONE ? 'bg-emerald-500 text-white border-emerald-600 focus:ring-emerald-100 shadow-emerald-100' :
                          task.status === TaskStatus.OVERDUE ? 'bg-rose-500 text-white border-rose-600 focus:ring-rose-100 shadow-rose-100' :
                          task.status === TaskStatus.DOING ? 'bg-violet-600 text-white border-violet-700 focus:ring-violet-100 shadow-violet-100' : 
                          'bg-amber-500 text-white border-amber-600 focus:ring-amber-100 shadow-amber-100'}`}
                    >
                      {Object.values(TaskStatus).map(s => <option key={s} value={s} className="bg-white text-slate-800 font-black">{s.toUpperCase()}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-8 align-top">
                    <div className="flex flex-col gap-3 pt-3">
                      <div className="w-32 bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner p-1 border border-slate-200/50">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.1)] ${task.progress > 80 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-violet-600'}`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 tracking-widest">{task.progress}% COMPLETED</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right align-top">
                    <input 
                      disabled={!canEdit}
                      type="range" 
                      min="0" max="100" 
                      value={task.progress} 
                      onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
                      className="w-32 accent-blue-600 cursor-pointer opacity-30 group-hover:opacity-100 transition-opacity disabled:opacity-10"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
