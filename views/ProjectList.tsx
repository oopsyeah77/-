
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Project, ProjectStatus, ProjectType } from '../types';
import { MapPin, User, ChevronRight, Star } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  favorites: string[];
  onSelectProject: (project: Project) => void;
  onToggleFavorite: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, favorites, onSelectProject, onToggleFavorite }) => {
  const location = useLocation();
  const [filterType, setFilterType] = useState<string>('ALL');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Handle incoming filter from Dashboard navigation
  useEffect(() => {
    if (location.state && (location.state as any).filter) {
      setFilterType((location.state as any).filter);
    }
  }, [location.state]);

  // Auto-scroll logic: When filter changes, scroll the selected tab into view
  useEffect(() => {
    const selectedTab = tabsRef.current.get(filterType);
    if (selectedTab && scrollContainerRef.current) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [filterType]);

  const filteredProjects = projects.filter(p => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PROPOSAL: return 'bg-slate-100 text-slate-600 border-slate-200';
      case ProjectStatus.FEASIBILITY: return 'bg-violet-50 text-violet-700 border-violet-100';
      case ProjectStatus.PRELIM_DESIGN: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case ProjectStatus.DRAWING: return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case ProjectStatus.CONSTRUCTION: return 'bg-amber-50 text-amber-700 border-amber-100';
      case ProjectStatus.COMPLETED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const projectTypes = Object.values(ProjectType);

  return (
    <div className="space-y-4 animate-slide-in-right">
      {/* Scrollable Filter Tabs */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x"
      >
        <button
            ref={(el) => { if (el) tabsRef.current.set('ALL', el); }}
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 snap-center ${
              filterType === 'ALL' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            全部
          </button>
        {projectTypes.map((type) => (
          <button
            key={type}
            ref={(el) => { if (el) tabsRef.current.set(type, el); }}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 snap-center ${
              filterType === type 
                ? 'bg-teal-700 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const isFav = favorites.includes(project.id);
          return (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 active:bg-slate-50 transition-colors group relative overflow-hidden cursor-pointer"
            >
              {/* Left accent bar based on business type */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${project.businessType === '总包' ? 'bg-amber-400' : 'bg-teal-400'}`}></div>

              <div className="flex justify-between items-start mb-2 pl-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {project.id.toUpperCase()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(project.id);
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <Star 
                      size={16} 
                      className={isFav ? "text-amber-400 fill-amber-400" : "text-slate-300"} 
                    />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1 pl-2 group-hover:text-teal-700 transition-colors">{project.name}</h3>
              
              <div className="mb-3 flex gap-2 pl-2">
                 <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                   {project.type}
                 </span>
                 <span className={`text-[10px] border px-1.5 py-0.5 rounded ${project.businessType === '总包' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                   {project.businessType}
                 </span>
              </div>
              
              <div className="flex items-center text-xs text-slate-500 mb-3 space-x-3 pl-2">
                <div className="flex items-center">
                   <MapPin size={12} className="mr-1 text-slate-400" />
                   {project.location}
                </div>
                <div className="flex items-center">
                   <User size={12} className="mr-1 text-slate-400" />
                   PM: {project.manager}
                </div>
              </div>

              <div className="pl-2">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${project.progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">进度: <span className="text-slate-700">{project.progress}%</span></span>
                    <div className="flex items-center text-teal-600 font-bold group-hover:translate-x-1 transition-transform">
                      查看详情 <ChevronRight size={14} />
                    </div>
                  </div>
              </div>
            </div>
          );
        })}
        
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <MapPin className="opacity-20" size={32} />
             </div>
             <p className="text-sm">该业务板块暂无项目记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
