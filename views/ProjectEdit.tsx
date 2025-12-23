
import React, { useState } from 'react';
import { Project, ProjectStatus, UserProfile } from '../types';
import { ArrowLeft, Save, AlertTriangle, FileText, TrendingUp, Coins } from 'lucide-react';

interface ProjectEditProps {
  project: Project;
  currentUser: UserProfile;
  onBack: () => void;
  onSubmitChange: (projectId: string, field: string, oldVal: any, newVal: any) => void;
}

const ProjectEdit: React.FC<ProjectEditProps> = ({ project, currentUser, onBack, onSubmitChange }) => {
  const [progress, setProgress] = useState(project.progress);
  const [status, setStatus] = useState(project.status);
  const [paymentReceived, setPaymentReceived] = useState(project.paymentReceived);

  const handleSubmit = () => {
    // Detect changes and submit specific requests
    let submitted = false;

    if (progress !== project.progress) {
      onSubmitChange(project.id, '项目进度', `${project.progress}%`, `${progress}%`);
      submitted = true;
    }
    
    if (status !== project.status) {
      onSubmitChange(project.id, '项目阶段', project.status, status);
      submitted = true;
    }

    if (paymentReceived !== project.paymentReceived) {
       onSubmitChange(project.id, '累计回款', `¥${project.paymentReceived}万`, `¥${paymentReceived}万`);
       submitted = true;
    }

    if (!submitted) {
        alert("未检测到数据变更");
        return;
    }
    onBack();
  };

  return (
    <div className="animate-slide-in-right pb-10">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 text-sm hover:text-teal-700 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> 取消
        </button>
        <h2 className="text-sm font-bold text-slate-700">信息维护 (三级确认)</h2>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 shadow-sm">
         <div className="flex items-start">
            <AlertTriangle size={20} className="text-amber-600 mr-2 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
               <p className="font-bold mb-1">操作提示</p>
               <p>您正在发起项目关键信息变更申请。</p>
               <p className="mt-1">流程：<span className="font-bold">1.您提交</span> → <span className="font-bold">2.部门主任(分管副总)审核</span> → <span className="font-bold">3.总经理审批</span>。</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">{project.name}</h3>
            <p className="text-xs text-slate-400 mt-1">当前责任人: {project.manager}</p>
         </div>

         <div className="p-5 space-y-6">
            
            {/* Progress */}
            <div>
               <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                  <TrendingUp size={16} className="mr-2 text-teal-600" />
                  项目进度 (%)
               </label>
               <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={progress} 
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <input 
                     type="number"
                     min="0"
                     max="100"
                     value={progress}
                     onChange={(e) => setProgress(Number(e.target.value))}
                     className="w-16 p-2 text-center border border-slate-300 rounded-lg text-sm font-bold text-slate-700 focus:border-teal-500 outline-none"
                  />
               </div>
            </div>

            {/* Status */}
            <div>
               <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                  <FileText size={16} className="mr-2 text-blue-600" />
                  当前阶段
               </label>
               <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
               >
                  {Object.values(ProjectStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                  ))}
               </select>
            </div>

            {/* Payment */}
            <div>
               <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                  <Coins size={16} className="mr-2 text-amber-600" />
                  累计回款 (万元)
               </label>
               <div className="relative">
                 <input 
                    type="number"
                    value={paymentReceived}
                    onChange={(e) => setPaymentReceived(Number(e.target.value))}
                    className="w-full p-3 pl-8 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-amber-100 focus:border-amber-500 outline-none font-mono"
                 />
                 <span className="absolute left-3 top-3.5 text-slate-400">¥</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1 text-right">
                  当前合同额: ¥{project.contractValue}万 (回款率 {((paymentReceived/project.contractValue)*100).toFixed(1)}%)
               </p>
            </div>

         </div>

         <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button 
               onClick={handleSubmit}
               className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center active:bg-teal-700 transition-colors shadow-md shadow-teal-200"
            >
               <Save size={18} className="mr-2" />
               提交审批 (Level 1)
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProjectEdit;
