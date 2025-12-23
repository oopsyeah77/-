
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Feedback, FeedbackStatus, ProjectType, ProjectStatus } from '../types';
import { AlertCircle, CheckCircle2, Zap, Share2, Sun, Globe2, Building2, Leaf, Map, Cpu, FlaskConical, LucideIcon, ChevronRight, Star, TrendingUp, Activity, PieChart, Wallet } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  feedbacks: Feedback[];
  favorites: string[];
  onNavigate: (tab: string) => void;
  onSelectProject?: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, feedbacks, favorites, onNavigate, onSelectProject }) => {
  const navigate = useNavigate();
  const pendingFeedbacks = feedbacks.filter(f => f.status === FeedbackStatus.PENDING).length;
  const activeProjects = projects.filter(p => p.progress < 100).length;
  
  // Calculations for Command Canvas
  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalReceived = projects.reduce((acc, p) => acc + p.paymentReceived, 0);
  const receivedRatio = totalContractValue > 0 ? (totalReceived / totalContractValue) * 100 : 0;
  
  const favoriteProjects = projects.filter(p => favorites.includes(p.id));

  const companyConfig: Record<ProjectType, { icon: LucideIcon, color: string, bg: string, ring: string }> = {
    [ProjectType.GENERATION]: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' },
    [ProjectType.GRID]: { icon: Share2, color: 'text-blue-400', bg: 'bg-blue-400/10', ring: 'ring-blue-400/20' },
    [ProjectType.NEW_ENERGY]: { icon: Sun, color: 'text-teal-400', bg: 'bg-teal-400/10', ring: 'ring-teal-400/20' },
    [ProjectType.INTERNATIONAL]: { icon: Globe2, color: 'text-indigo-400', bg: 'bg-indigo-400/10', ring: 'ring-indigo-400/20' },
    [ProjectType.MUNICIPAL]: { icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', ring: 'ring-emerald-400/20' },
    [ProjectType.ENVIRONMENT]: { icon: Leaf, color: 'text-lime-400', bg: 'bg-lime-400/10', ring: 'ring-lime-400/20' },
    [ProjectType.SURVEY]: { icon: Map, color: 'text-stone-400', bg: 'bg-stone-400/10', ring: 'ring-stone-400/20' },
    [ProjectType.DIGITAL]: { icon: Cpu, color: 'text-violet-400', bg: 'bg-violet-400/10', ring: 'ring-violet-400/20' },
    [ProjectType.GREEN_CHEM]: { icon: FlaskConical, color: 'text-cyan-400', bg: 'bg-cyan-400/10', ring: 'ring-cyan-400/20' },
  };

  const companyOrder = Object.values(ProjectType);

  // --- MOBILE VIEW COMPONENT ---
  const MobileDashboard = () => (
    <div className="space-y-6 animate-fade-in md:hidden">
      {/* Welcome Section - Adjusted to Lighter Industrial Slate */}
      <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-5 text-white shadow-xl relative overflow-hidden border-t border-slate-500/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400 rounded-full blur-3xl opacity-5 -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1 tracking-tight">您好，南方总部总经理</h2>
          <p className="text-slate-200 text-sm opacity-90 mb-5 font-medium">业务全景概览</p>
          
          <div className="flex gap-4">
             <div 
               onClick={() => onNavigate('projects')}
               className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-3 flex-1 cursor-pointer hover:bg-white/20 active:scale-95 transition-all shadow-lg"
             >
               <div className="text-2xl font-bold text-white mb-1">{activeProjects}</div>
               <div className="text-xs text-slate-100 flex items-center justify-between">
                 在建项目
                 <ChevronRight size={14} className="opacity-80" />
               </div>
             </div>
             <div 
               onClick={() => onNavigate('feedback')}
               className="bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/40 backdrop-blur-sm rounded-xl p-3 flex-1 cursor-pointer hover:from-amber-500/40 transition-all active:scale-95 shadow-lg"
             >
               <div className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                 {pendingFeedbacks}
                 {pendingFeedbacks > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>}
               </div>
               <div className="text-xs text-amber-50 flex items-center justify-between">
                 待响应反馈
                 <ChevronRight size={14} className="opacity-80" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-amber-500">待办事项</h3>
        {pendingFeedbacks > 0 ? (
          <div 
            onClick={() => onNavigate('feedback')}
            className="bg-white border border-amber-100 rounded-xl shadow-sm p-4 flex items-start gap-3 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            <div className="bg-amber-50 p-2 rounded-full text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
               <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm">有 {pendingFeedbacks} 条客户反馈需关注</p>
              <p className="text-slate-500 text-xs mt-1">请及时指派项目负责人跟进处理。</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-emerald-100 rounded-xl shadow-sm p-4 flex items-center gap-3 relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
             <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
                <CheckCircle2 size={20} />
             </div>
             <p className="text-slate-700 font-medium text-sm">当前无紧急待办事项</p>
          </div>
        )}
      </div>

      {/* Favorites */}
      {favoriteProjects.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-violet-500 flex items-center">
            重点关注项目 <Star size={12} className="ml-1 text-amber-400 fill-amber-400" />
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {favoriteProjects.map(project => (
              <div 
                key={project.id}
                onClick={() => onSelectProject && onSelectProject(project)}
                className="bg-white rounded-xl p-3 shadow-sm border border-violet-100 w-64 shrink-0 flex flex-col active:scale-95 transition-transform"
              >
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded border border-violet-100 truncate max-w-[80%]">
                      {project.type}
                    </span>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{project.name}</h4>
                 <div className="flex justify-between items-center text-xs mt-auto pt-2">
                   <span className="text-slate-400">PM: {project.manager}</span>
                   <span className="font-bold text-slate-600">{project.progress}%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${project.progress >= 100 ? 'bg-emerald-500' : 'bg-violet-400'}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Grid */}
      <div>
         <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider pl-1 border-l-4 border-teal-600">业务板块分布</h3>
         <div className="grid grid-cols-3 gap-3">
            {companyOrder.map((type) => {
              const count = projects.filter(p => p.type === type).length;
              const conf = companyConfig[type];
              const Icon = conf.icon;

              return (
                <div 
                  key={type}
                  onClick={() => navigate('/projects', { state: { filter: type } })}
                  className={`rounded-xl p-3 shadow-sm border flex flex-col items-center justify-center text-center aspect-square transition-all cursor-pointer hover:shadow-md active:scale-95 ${count > 0 ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-slate-100 opacity-60 grayscale'}`}
                >
                   <div className={`p-2.5 rounded-full mb-2 bg-opacity-20 text-opacity-100 ${conf.bg.replace('/10', '/20')} ${conf.ring} ring-1 text-slate-700`}>
                     <Icon size={18} className={conf.color.replace('400', '600')} />
                   </div>
                   <span className="text-xs font-bold text-slate-700 leading-tight mb-1 line-clamp-2 h-8 flex items-center justify-center">{type}</span>
                   <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-full">{count} 个</span>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );

  // --- DESKTOP CANVAS COMPONENT ---
  const DesktopCanvas = () => (
    <div className="hidden md:flex flex-col gap-6 animate-fade-in h-full">
      
      {/* 1. Top Metrics Bar - Industrial Style (Lightened to Slate 700) */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 shadow-lg flex items-center justify-between group hover:border-teal-500/50 transition-colors cursor-default">
            <div>
               <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Total Projects</p>
               <h3 className="text-3xl font-bold text-white font-mono">{projects.length}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-teal-400 group-hover:text-teal-300 group-hover:bg-teal-900/30 transition-all">
               <Building2 size={24} />
            </div>
         </div>
         <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 shadow-lg flex items-center justify-between group hover:border-amber-500/50 transition-colors cursor-default">
            <div>
               <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Contract Value</p>
               <h3 className="text-2xl font-bold text-amber-400 font-mono">¥{(totalContractValue/10000).toFixed(1)} <span className="text-sm">亿</span></h3>
            </div>
            <div className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-900/30 transition-all">
               <Wallet size={24} />
            </div>
         </div>
         <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 shadow-lg flex items-center justify-between group hover:border-emerald-500/50 transition-colors cursor-default">
            <div>
               <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Payment Recv.</p>
               <div className="flex items-baseline gap-2">
                 <h3 className="text-2xl font-bold text-emerald-400 font-mono">{receivedRatio.toFixed(1)}<span className="text-sm">%</span></h3>
                 <span className="text-xs text-slate-400">/ ¥{(totalReceived/10000).toFixed(1)}亿</span>
               </div>
            </div>
            <div className="w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center text-emerald-500 group-hover:bg-emerald-900/30 transition-all">
               <PieChart size={24} />
            </div>
         </div>
         <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 shadow-lg flex items-center justify-between group hover:border-red-500/50 transition-colors cursor-pointer" onClick={() => onNavigate('feedback')}>
            <div>
               <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">Pending Feedback</p>
               <h3 className={`text-3xl font-bold font-mono ${pendingFeedbacks > 0 ? 'text-red-400' : 'text-slate-200'}`}>{pendingFeedbacks}</h3>
            </div>
            <div className={`w-12 h-12 bg-slate-600/50 rounded-full flex items-center justify-center transition-all ${pendingFeedbacks > 0 ? 'text-red-500 animate-pulse bg-red-900/20' : 'text-slate-400'}`}>
               <Activity size={24} />
            </div>
         </div>
      </div>

      {/* 2. Main Canvas Area (Map + Stream) */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-[400px]">
         
         {/* LEFT: Project Map Visualization */}
         <div className="col-span-8 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden shadow-2xl group">
             {/* Map Header */}
             <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-300 font-mono font-bold uppercase">Live Project Map</span>
             </div>

             {/* Abstract Map Graphic (CSS Based) */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-950"></div>
             
             {/* Grid Lines for "Technical" feel */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

             {/* Simulated Project Dots */}
             <div className="absolute inset-0 p-10">
                {projects.slice(0, 15).map((p, i) => {
                   // Random positions for demo "Canvas" feel
                   const top = `${20 + (Math.abs(p.name.length * 17) % 60)}%`;
                   const left = `${10 + (Math.abs(p.id.length * 23) % 80)}%`;
                   const statusColor = p.status === ProjectStatus.CONSTRUCTION ? 'bg-amber-500' : 'bg-teal-500';
                   
                   return (
                      <div 
                        key={p.id} 
                        className="absolute group/pin cursor-pointer"
                        style={{ top, left }}
                        onClick={() => onSelectProject && onSelectProject(p)}
                      >
                         <div className={`w-3 h-3 rounded-full ${statusColor} shadow-[0_0_10px_currentColor] relative`}>
                            <div className={`absolute -inset-2 rounded-full ${statusColor} opacity-20 animate-ping`}></div>
                         </div>
                         {/* Tooltip on Hover */}
                         <div className="absolute left-4 -top-2 bg-slate-800 border border-slate-700 px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-20 pointer-events-none">
                            <p className="text-[10px] text-white font-bold">{p.name.substring(0, 10)}...</p>
                            <p className="text-[9px] text-slate-400">{p.status}</p>
                         </div>
                      </div>
                   );
                })}
             </div>
             
             {/* Bottom Overlay Info */}
             <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-900 to-transparent p-6 pt-12">
                <div className="flex gap-8">
                   <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Dominant Region</div>
                      <div className="text-white font-bold text-sm flex items-center gap-1"><MapPinIcon size={12} className="text-teal-500"/> Guangdong (GBA)</div>
                   </div>
                   <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Intl. Focus</div>
                      <div className="text-white font-bold text-sm flex items-center gap-1"><Globe2 size={12} className="text-indigo-500"/> Southeast Asia / Central Asia</div>
                   </div>
                </div>
             </div>
         </div>

         {/* RIGHT: Feedback Stream & Business Units */}
         <div className="col-span-4 flex flex-col gap-4">
            
            {/* Feedback Widget */}
            <div className="bg-slate-700 rounded-xl border border-slate-600 shadow-lg flex-1 overflow-hidden flex flex-col">
               <div className="p-4 border-b border-slate-600 flex justify-between items-center bg-slate-700/50">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <Activity size={16} className="text-teal-400" />
                     Feedback Stream
                  </h3>
                  <button onClick={() => onNavigate('feedback')} className="text-[10px] text-teal-400 hover:text-teal-300">View All</button>
               </div>
               <div className="p-3 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                  {feedbacks.slice(0, 4).map(f => (
                     <div key={f.id} className="bg-slate-600/30 border border-slate-600/50 p-3 rounded-lg hover:bg-slate-600/50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-[9px] px-1.5 rounded border ${f.status === FeedbackStatus.PENDING ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-slate-500 border-slate-500 text-slate-300'}`}>
                              {f.status}
                           </span>
                           <span className="text-[9px] text-slate-400">{f.receivedDate}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{f.content}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Business Unit Mini Grid */}
            <div className="bg-slate-700 rounded-xl border border-slate-600 shadow-lg p-4">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Business Sectors</h3>
               <div className="grid grid-cols-3 gap-2">
                  {companyOrder.slice(0, 6).map(type => {
                     const conf = companyConfig[type];
                     const Icon = conf.icon;
                     return (
                        <div key={type} className="bg-slate-600/50 rounded-lg p-2 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-500 hover:text-white transition-colors cursor-pointer group tooltip-container relative h-16" onClick={() => onNavigate('projects')}>
                           <Icon size={16} className={conf.color} />
                           <span className="text-[8px] mt-1 text-center leading-tight line-clamp-2">{type}</span>
                        </div>
                     )
                  })}
               </div>
            </div>

         </div>
      </div>
      
      {/* 3. Bottom: Priority Projects Strip */}
      <div>
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Priority Projects Watchlist</h3>
            <div className="h-[1px] bg-slate-300 flex-1 ml-4 opacity-50"></div>
         </div>
         <div className="grid grid-cols-4 gap-4">
             {projects.filter(p => p.progress < 100).slice(0, 4).map(p => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectProject && onSelectProject(p)}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[60%]">{p.type}</span>
                      <span className="text-[10px] font-mono text-teal-600 font-bold">{p.progress}%</span>
                   </div>
                   <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{p.name}</h4>
                   <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{width: `${p.progress}%`}}></div>
                   </div>
                </div>
             ))}
         </div>
      </div>

    </div>
  );

  return (
    <>
      <MobileDashboard />
      <DesktopCanvas />
    </>
  );
};

// Small helper for Map icon in desktop view
const MapPinIcon = ({size, className}: {size:number, className:string}) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default Dashboard;
