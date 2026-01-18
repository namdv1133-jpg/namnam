
import React, { useState } from 'react';
import { User, Role } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: Omit<User, 'id' | 'avatar'>) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.NHAN_VIEN
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', email: '', role: Role.NHAN_VIEN });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-xl font-black text-slate-800">Thêm nhân sự mới</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Gia nhập đội ngũ T-Lux Floor</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Họ và tên</label>
              <input 
                required
                type="text" 
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold text-slate-700"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email công ty</label>
              <input 
                required
                type="email" 
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold text-slate-700"
                placeholder="email@tlux.vn"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Vị trí đảm nhiệm</label>
              <select 
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none cursor-pointer font-bold text-slate-700 bg-slate-50"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as Role})}
              >
                <option value={Role.NHAN_VIEN}>👷 Nhân viên</option>
                <option value={Role.TRUONG_PHONG}>👔 Trưởng phòng</option>
                <option value={Role.GIAM_DOC}>💎 Giám đốc</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95 transition-all text-sm"
            >
              Xác nhận thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
