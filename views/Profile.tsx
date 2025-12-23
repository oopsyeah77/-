
import React, { useState } from 'react';
import { UserProfile, ChangeRequest, ApprovalStatus } from '../types';
import { Mail, Phone, MapPin, Building2, BadgeCheck, LogOut, Smartphone, MessageCircle, Briefcase, Zap, Inbox, CheckCircle, XCircle, ChevronRight, Clock, DownloadCloud, MonitorDown, Code2 } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  pendingApprovals: ChangeRequest[];
  onLoginSwitch: (method: 'wecom' | 'wechat' | 'phone') => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, pendingApprovals, onLoginSwitch, onApprove, onReject }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'approvals'>('info');

  const handleSwitchClick = () => {
    setShowLoginModal(true);
  };

  const handleMethodSelect = (method: 'wecom' | 'wechat' | 'phone') => {
    onLoginSwitch(method);
    setShowLoginModal(false);
  };

  const handleDownloadApp = () => {
      alert("提示：请联系数字化部获取最新 Android 安装包 (nepdi-tracker-v1.0.apk)");
  };

  // Only managers see approvals
  const isManager = user.role === 'ADMIN' || user.role === 'MANAGER';
  const myApprovals = pendingApprovals.filter(req => {
     if (user.role === 'ADMIN') return req.status === ApprovalStatus.PENDING_LEVEL_3;
     if (user.role === 'MANAGER') return req.status === ApprovalStatus.PENDING_LEVEL_2;
     return false;
  });

  return (
    <div className="animate-fade-in space-y-5">
      
      {/* 1. Header Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
         
         <div className="relative z-10 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${user.avatarColor} flex items-center justify-center text-xl font-bold border-2 border-white/20 shadow-lg`}>
              {user.initials}
            </div>
            <div>
               <h2 className="text-xl font-bold flex items-center gap-2">
                 {user.name}
                 <BadgeCheck size={18} className="text-teal-400" />
               </h2>
               <p className="text-slate-300 text-sm mt-1 font-medium">{user.title}</p>
               <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-slate-400 text-xs">{user.department}</span>
                   {user.role === 'ADMIN' && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded border border-amber-500/30">GM权限</span>}
               </div>
            </div>
         </div>
      </div>

      {/* Tabs for Managers */}
      {isManager && (
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
             <button 
               onClick={() => setActiveTab('info')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'info' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}
             >
               个人信息
             </button>
             <button 
               onClick={() => setActiveTab('approvals')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${activeTab === 'approvals' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}
             >
               待办审批
               {myApprovals.length > 0 && <span className="ml-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{myApprovals.length}</span>}
             </button>
          </div>
      )}

      {/* VIEW: INFO */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Building2 size={14} className="mr-1.5" /> 东北院南方总部信息
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">已认证</span>
            </div>
            
            <div className="divide-y divide-slate-100">
                <div className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Briefcase size={16} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">工号 (Employee ID)</p>
                    <p className="text-sm font-medium text-slate-800">{user.employeeId}</p>
                </div>
                </div>

                <div className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Mail size={16} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">企业邮箱 (Email)</p>
                    <p className="text-sm font-medium text-slate-800 break-all">{user.email}</p>
                </div>
                </div>

                <div className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone size={16} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">办公电话 (Office Phone)</p>
                    <p className="text-sm font-medium text-slate-800">{user.phone}</p>
                </div>
                </div>

                <div className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                    <MapPin size={16} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">办公地址 (Location)</p>
                    <p className="text-sm font-medium text-slate-800 leading-tight">{user.officeLocation}</p>
                </div>
                </div>
            </div>
        </div>
      )}

      {/* VIEW: APPROVALS */}
      {activeTab === 'approvals' && (
          <div className="space-y-4 animate-slide-in-right">
             {myApprovals.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <Inbox size={48} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm">当前没有待办审批任务</p>
                 </div>
             ) : (
                 myApprovals.map(req => (
                     <div key={req.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 relative overflow-hidden">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-slate-800 text-sm mb-0.5">{req.projectName}</h3>
                                <div className="flex items-center text-xs text-slate-400">
                                   <Clock size={12} className="mr-1" /> {req.submitDate}
                                   <span className="mx-2">|</span>
                                   申请人: {req.applicant}
                                </div>
                             </div>
                             <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100 font-bold">
                                {req.fieldChanged}
                             </span>
                         </div>

                         <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between mb-4 border border-slate-100">
                            <div className="text-center flex-1">
                               <div className="text-xs text-slate-400 mb-1">变更前</div>
                               <div className="font-bold text-slate-600 line-through">{req.oldValue}</div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                            <div className="text-center flex-1">
                               <div className="text-xs text-slate-400 mb-1">变更后</div>
                               <div className="font-bold text-teal-600">{req.newValue}</div>
                            </div>
                         </div>

                         <div className="flex gap-3">
                             <button 
                               onClick={() => onReject(req.id)}
                               className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center"
                            >
                                <XCircle size={14} className="mr-1.5" /> 驳回
                             </button>
                             <button 
                               onClick={() => onApprove(req.id)}
                               className="flex-1 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 flex items-center justify-center shadow-sm"
                            >
                                <CheckCircle size={14} className="mr-1.5" /> 
                                {user.role === 'MANAGER' ? '主任审批' : '批准生效'}
                             </button>
                         </div>
                     </div>
                 ))
             )}
          </div>
      )}

      {/* 3. Actions & Download */}
      <div className="space-y-3 pt-4">
         
         {/* Download APP Card */}
         <div 
           onClick={handleDownloadApp}
           className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-4 text-white shadow-md active:scale-98 transition-transform cursor-pointer flex items-center justify-between relative overflow-hidden group"
         >
             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <MonitorDown size={80} />
             </div>
             
             <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                   <DownloadCloud size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-sm">下载手机客户端 (App)</h3>
                   <p className="text-xs text-teal-100 opacity-90">Android v1.0.2 / HarmonyOS</p>
                </div>
             </div>
             <ChevronRight size={18} className="opacity-80 group-hover:translate-x-1 transition-transform" />
         </div>

         <button 
           onClick={handleSwitchClick}
           className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-98 transition-all flex items-center justify-center"
         >
            <LogOut size={18} className="mr-2 text-slate-400" />
            切换当前登录账号
         </button>
         
         <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400">NEPDI-S Project Tracker v1.3.1</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-slate-300">
               <Code2 size={10} />
               <span>Developer: WangGuangShun</span>
            </div>
         </div>
      </div>

      {/* 4. Login Switch Modal */}
      {showLoginModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-6">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative overflow-hidden">
               {/* Close Button */}
               <button 
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
               >
                  ✕
               </button>

               <div className="text-center mb-8 mt-2">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-3">
                     <Zap size={24} className="text-teal-400 fill-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">切换身份登录</h3>
                  <p className="text-slate-400 text-xs mt-2">不同身份拥有不同的审批权限</p>
               </div>

               <div className="space-y-3">
                  <button 
                    onClick={() => handleMethodSelect('wecom')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors shadow-md"
                  >
                     <Briefcase size={20} className="mr-3 text-teal-400" />
                     我是总经理 (GM)
                     <span className="ml-auto text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded">Level 3</span>
                  </button>

                  <button 
                    onClick={() => handleMethodSelect('wechat')}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors"
                  >
                     <MessageCircle size={20} className="mr-3 text-blue-500" />
                     我是部门主任 (分管副总)
                     <span className="ml-auto text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Level 2</span>
                  </button>

                  <button 
                    onClick={() => handleMethodSelect('phone')}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors"
                  >
                     <Smartphone size={20} className="mr-3 text-slate-500" />
                     我是项目经理 (PM)
                     <span className="ml-auto text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded">Level 1</span>
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Profile;
