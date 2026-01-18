
import React, { useState, useMemo, useEffect } from 'react';
import { Role, Task, TaskStatus, TaskType, User, Project, Priority } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS } from './constants';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { CreateUserModal } from './components/CreateUserModal';
import { generateManagementReport } from './services/geminiService';

interface Filters {
  status: TaskStatus | null;
  type: TaskType | null;
  assigneeId: string | null;
}

const App: React.FC = () => {
  // --- Persistance & Real-time Sync Logic ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tlux_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tlux_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('tlux_current_user_email');
    return users.find(u => u.email === saved) || users[0];
  });

  // Lưu trữ khi có thay đổi
  useEffect(() => {
    localStorage.setItem('tlux_users', JSON.stringify(users));
    localStorage.setItem('tlux_tasks', JSON.stringify(tasks));
    localStorage.setItem('tlux_current_user_email', currentUser.email);
  }, [users, tasks, currentUser]);

  // Giả lập cập nhật liên tục: Lắng nghe thay đổi từ các tab khác (giả lập nhân viên khác đang làm việc)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tlux_tasks' && e.newValue) {
        setTasks(JSON.parse(e.newValue));
      }
      if (e.key === 'tlux_users' && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks'>('dashboard');
  const [filters, setFilters] = useState<Filters>({ status: null, type: null, assigneeId: null });
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (currentUser.role === Role.NHAN_VIEN) {
      result = result.filter(t => t.assigneeId === currentUser.id);
    }
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.assigneeId) result = result.filter(t => t.assigneeId === filters.assigneeId);
    return result;
  }, [tasks, filters, currentUser]);

  const assignableUsers = useMemo(() => {
    if (currentUser.role === Role.GIAM_DOC) {
      return users.filter(u => u.role === Role.TRUONG_PHONG || u.role === Role.NHAN_VIEN);
    }
    if (currentUser.role === Role.TRUONG_PHONG) {
      return users.filter(u => u.role === Role.NHAN_VIEN);
    }
    return [];
  }, [users, currentUser]);

  const handleUpdateProgress = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress, status: progress === 100 ? TaskStatus.DONE : t.status } : t));
  };

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, progress: status === TaskStatus.DONE ? 100 : t.progress } : t));
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...newTaskData, id: `t-${Date.now()}` };
    setTasks(prev => [newTask, ...prev]);
    setActiveTab('tasks');
  };

  const handleCreateUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = { 
      ...newUserData, 
      id: `u-${Date.now()}`,
      avatar: `https://picsum.photos/seed/${Date.now()}/100`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const navigateAndFilter = (newFilters: Partial<Filters>) => {
    setFilters({ status: null, type: null, assigneeId: null, ...newFilters });
    setActiveTab('tasks');
  };

  const clearFilters = () => setFilters({ status: null, type: null, assigneeId: null });

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const report = await generateManagementReport(tasks);
      setAiAnalysis(report || "Không thể phân tích vào lúc này.");
    } catch (error) {
      setAiAnalysis("Lỗi khi kết nối AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-[#f8fafc] to-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden select-none opacity-[0.05]">
        <div className="relative">
          <h1 className="text-[18vw] font-black text-yellow-500 rotate-[-12deg] whitespace-nowrap blur-[2px]">
            T-LUX FLOOR
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-yellow-200/20 rounded-full blur-[120px]"></div>
        </div>
      </div>

      {/* Sidebar - Modern Dark Glass */}
      <aside className="w-80 bg-[#0f172a]/95 backdrop-blur-xl text-slate-400 flex flex-col hidden lg:flex sticky h-screen top-0 shadow-2xl z-30 border-r border-white/5">
        <div className="p-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-xl shadow-yellow-500/30 text-xl transform hover:rotate-6 transition-transform">TL</div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none">T-LUX</h1>
              <p className="text-[9px] text-yellow-500 font-black uppercase tracking-[0.25em] mt-1.5 opacity-80">Floor Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {(currentUser.role === Role.GIAM_DOC || currentUser.role === Role.TRUONG_PHONG) && (
            <button 
              onClick={() => { setActiveTab('dashboard'); clearFilters(); }}
              className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 translate-x-1' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-xl">🌈</span> 
              <span className="text-sm font-black tracking-wide">Dashboard Tổng</span>
            </button>
          )}
          <button 
            onClick={() => { setActiveTab('tasks'); clearFilters(); }}
            className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === 'tasks' && !filters.status && !filters.assigneeId ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 translate-x-1' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <span className="text-xl">⚡</span> 
            <span className="text-sm font-black tracking-wide">Dự án & Việc</span>
          </button>
          
          <div className="pt-12 pb-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-800"></div>
            <span>Bộ lọc nhanh</span>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>
          
          <button onClick={() => navigateAndFilter({ status: TaskStatus.OVERDUE })} className="w-full text-left px-6 py-3.5 text-xs hover:bg-rose-500/10 rounded-2xl group transition-all">
            <div className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] group-hover:scale-125 transition-transform"></span> 
              <span className="font-bold group-hover:text-rose-400">Việc trễ hạn</span>
            </div>
          </button>
          <button onClick={() => navigateAndFilter({ status: TaskStatus.DOING })} className="w-full text-left px-6 py-3.5 text-xs hover:bg-violet-500/10 rounded-2xl group transition-all">
            <div className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)] group-hover:scale-125 transition-transform"></span> 
              <span className="font-bold group-hover:text-violet-400">Đang triển khai</span>
            </div>
          </button>
        </nav>

        <div className="p-8 bg-slate-950/40 mt-auto border-t border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl border-2 border-white/10 shadow-lg object-cover" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#0f172a] rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">{currentUser.role}</p>
              <p className="text-[8px] text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase px-1">Đổi tài khoản truy cập:</p>
            <select 
              className="w-full bg-white/5 hover:bg-white/10 text-[11px] font-black py-3.5 rounded-2xl border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-slate-200 transition-all px-4 shadow-xl"
              onChange={(e) => {
                const selectedUser = users.find(u => u.email === e.target.value) || users[0];
                setCurrentUser(selectedUser);
                clearFilters();
              }}
              value={currentUser.email}
            >
              {users.map(u => (
                <option key={u.id} value={u.email} className="bg-slate-900">
                  {u.role}: {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 flex flex-col">
        <header className="bg-white/60 backdrop-blur-2xl border-b border-slate-200/50 px-12 py-8 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Đang trực tuyến
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {activeTab === 'dashboard' ? 'Vận hành Công ty' : 'Hệ thống Công việc'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tài khoản: <span className="text-blue-600">{currentUser.email}</span></p>
          </div>
          
          <div className="flex gap-4">
            {currentUser.role !== Role.NHAN_VIEN && (
               <button 
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-indigo-200 transform hover:-translate-y-0.5 active:scale-95"
              >
                {isAnalyzing ? "⌛ Phân tích..." : "✨ Trợ lý AI"}
              </button>
            )}
            
            {(currentUser.role === Role.GIAM_DOC || currentUser.role === Role.TRUONG_PHONG) && (
              <>
                <button 
                  onClick={() => setIsUserModalOpen(true)}
                  className="px-6 py-3 bg-slate-800 hover:bg-black text-white rounded-2xl text-xs font-black shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center gap-3 border border-slate-700"
                >
                  <span>➕ Nhân sự</span>
                </button>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-300 active:scale-95 transition-all flex items-center gap-3"
                >
                  <span>🔥 Giao việc</span>
                </button>
              </>
            )}
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-12">
          {aiAnalysis && (
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-1 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500 relative">
              <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.3rem] relative">
                <button onClick={() => setAiAnalysis("")} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center">✕</button>
                <div className="flex items-start gap-8">
                  <div className="p-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl text-4xl shadow-2xl shadow-yellow-200 transform -rotate-6">💡</div>
                  <div className="flex-1">
                    <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600 text-xl mb-4 flex items-center gap-3 uppercase tracking-tighter">
                      Báo cáo Phân tích Thông minh
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-lg font-medium italic">"{aiAnalysis}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (currentUser.role === Role.GIAM_DOC || currentUser.role === Role.TRUONG_PHONG) ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <Dashboard 
                tasks={tasks} 
                users={users}
                projectsCount={projects.length} 
                onStatClick={(status) => navigateAndFilter({ status })}
                onUserClick={(uid) => navigateAndFilter({ assigneeId: uid })}
              />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="flex justify-between items-end">
                 <div>
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Dữ liệu vận hành</h3>
                   <div className="h-1.5 w-20 bg-blue-500 rounded-full"></div>
                 </div>
                 {filters.status && (
                   <button onClick={clearFilters} className="text-xs font-black text-rose-500 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors">Xóa bộ lọc: {filters.status}</button>
                 )}
               </div>
               <TaskList 
                tasks={filteredTasks} 
                currentUser={currentUser}
                onUpdateProgress={handleUpdateProgress}
                onUpdateStatus={handleUpdateStatus}
                onFilterUser={(uid) => navigateAndFilter({ assigneeId: uid })}
              />
            </div>
          )}
        </div>
        
        <footer className="mt-auto py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
          &copy; 2025 T-Lux Floor Professional Management System • Đồng bộ thời gian thực qua Email
        </footer>
      </main>

      <CreateTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
        users={assignableUsers}
        projects={projects}
      />

      <CreateUserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleCreateUser}
      />
    </div>
  );
};

export default App;
