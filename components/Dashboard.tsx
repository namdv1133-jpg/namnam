
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Task, TaskStatus, TaskType, User } from '../types';

interface DashboardProps {
  tasks: Task[];
  users: User[];
  projectsCount: number;
  onStatClick: (status: TaskStatus | null) => void;
  onUserClick: (userId: string) => void;
}

// Vibrant Palette
const STATUS_COLORS = {
  DONE: '#10b981',    // Emerald
  DOING: '#8b5cf6',   // Violet
  TODO: '#f59e0b',    // Amber
  OVERDUE: '#f43f5e', // Rose
};

const COLORS = [STATUS_COLORS.DONE, STATUS_COLORS.DOING, STATUS_COLORS.TODO, STATUS_COLORS.OVERDUE]; 

export const Dashboard: React.FC<DashboardProps> = ({ tasks, users, projectsCount, onStatClick, onUserClick }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const overdueTasks = tasks.filter(t => t.status === TaskStatus.OVERDUE).length;
  const doingTasks = tasks.filter(t => t.status === TaskStatus.DOING).length;
  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;

  const avgProgress = totalTasks > 0 
    ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / totalTasks)
    : 0;

  const typeChartData = Object.values(TaskType).map(type => {
    const typeTasks = tasks.filter(t => t.type === type);
    return {
      name: type,
      'Xong': typeTasks.filter(t => t.status === TaskStatus.DONE).length,
      'Đang làm': typeTasks.filter(t => t.status === TaskStatus.DOING).length,
      'Chưa làm': typeTasks.filter(t => t.status === TaskStatus.TODO).length,
      'Trễ': typeTasks.filter(t => t.status === TaskStatus.OVERDUE).length,
    };
  });

  const statusPieData = [
    { name: 'Xong', value: completedTasks },
    { name: 'Đang làm', value: doingTasks },
    { name: 'Chờ', value: todoTasks },
    { name: 'Trễ', value: overdueTasks },
  ].filter(item => item.value > 0);

  // Giả lập lịch sử hoạt động để Giám đốc kiểm tra
  const recentActivities = tasks
    .slice()
    .sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Tổng dự án" value={projectsCount} icon="📦" color="blue" onClick={() => onStatClick(null)} />
        <StatCard title="Nhân sự" value={users.length} icon="👷" color="slate" onClick={() => {}} />
        <StatCard title="Tiến độ trung bình" value={`${avgProgress}%`} icon="📈" color="purple" onClick={() => {}} />
        <StatCard title="Hoàn thành" value={completedTasks} icon="✅" color="emerald" onClick={() => onStatClick(TaskStatus.DONE)} />
        <StatCard title="Cảnh báo trễ" value={overdueTasks} icon="🚨" color="rose" onClick={() => onStatClick(TaskStatus.OVERDUE)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart Section (2/3 width) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white/40">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800">Hiệu suất Hạng mục</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Phân tích khối lượng công việc</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span className="text-[9px] font-black text-slate-400">DONE</span></span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> <span className="text-[9px] font-black text-slate-400">DELAY</span></span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={typeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="8 8" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 11, fontWeight: 900}} width={150} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 12}} 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}} 
                />
                <Bar dataKey="Xong" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Đang làm" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Chưa làm" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Trễ" stackId="a" fill="#f43f5e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Donut Chart Section (1/3 width) */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white/40 flex flex-col items-center">
          <h3 className="text-xl font-black mb-2 text-slate-800 tracking-tight">Tỉ lệ Trạng thái</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Tổng {totalTasks} đầu việc</p>
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{totalTasks}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Công việc</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: '900', paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 3. Hoạt động gần đây - New Section for checking updates */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white/40 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800">Cập nhật liên tục</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">Real-time Feed</span>
          </div>
          <div className="space-y-6 flex-1">
            {recentActivities.map((task, idx) => {
              const user = users.find(u => u.id === task.assigneeId);
              return (
                <div key={task.id} className="flex gap-4 group cursor-default">
                  <img src={user?.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-md" alt="" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">
                      <span className="text-blue-600">{user?.name}</span> đã cập nhật tiến độ <span className="text-indigo-600">{task.progress}%</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 italic line-clamp-1">{task.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                       <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: `${task.progress}%`}}></div>
                       </div>
                       <span className="text-[8px] font-black text-slate-400">{new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => onStatClick(null)} className="mt-8 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-black rounded-xl transition-colors uppercase tracking-widest">Xem toàn bộ lịch sử</button>
        </div>

        {/* 4. Personnel Table Row: Full width row below charts and activities */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white/40 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Xếp hạng Hiệu suất</h3>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">Đồng bộ qua Email nội bộ</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                <tr>
                  <th className="px-8 py-5">Nhân sự (Email)</th>
                  <th className="px-4 py-5 text-center">Tasks</th>
                  <th className="px-4 py-5 text-center text-rose-500">Trễ</th>
                  <th className="px-8 py-5 text-right">Hiệu suất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {users.map((user) => {
                  const userTasks = tasks.filter(t => t.assigneeId === user.id);
                  const stats = {
                    total: userTasks.length,
                    overdue: userTasks.filter(t => t.status === TaskStatus.OVERDUE).length,
                    progress: userTasks.length > 0 
                      ? Math.round(userTasks.reduce((acc, t) => acc + t.progress, 0) / userTasks.length)
                      : 0
                  };
                  return (
                    <tr key={user.id} className="hover:bg-indigo-50/40 transition-all cursor-pointer group" onClick={() => onUserClick(user.id)}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-lg object-cover" alt="" />
                          <div>
                            <span className="font-black text-slate-700 block text-sm">{user.name}</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center font-black text-slate-800">{stats.total}</td>
                      <td className="px-4 py-5 text-center text-rose-500 font-black">{stats.overdue}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                            <div className={`h-full bg-blue-500`} style={{ width: `${stats.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-slate-800">{stats.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, onClick }: { title: string, value: string | number, icon: string, color: string, onClick: () => void }) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-200',
    purple: 'from-violet-500 to-purple-600 shadow-purple-200',
    rose: 'from-rose-500 to-red-600 shadow-rose-200',
    slate: 'from-slate-700 to-slate-900 shadow-slate-200',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-200',
  };

  return (
    <button 
      onClick={onClick}
      className={`bg-white/80 p-8 rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col justify-between text-left transition-all hover:shadow-indigo-100 hover:-translate-y-2 active:scale-95 group overflow-hidden relative min-h-[160px]`}
    >
      <div className="relative z-10">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-2">{title}</p>
        <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
      </div>
      <div className={`mt-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color].split(' ').slice(0, 2).join(' ')} flex items-center justify-center text-2xl shadow-xl ${colorMap[color].split(' ')[2]} transform group-hover:rotate-12 transition-transform duration-300 relative z-10`}>
        {icon}
      </div>
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br ${colorMap[color].split(' ').slice(0, 2).join(' ')} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
    </button>
  );
};
