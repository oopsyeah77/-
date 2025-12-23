
import React, { useState } from 'react';
import { Project, Stakeholder, Feedback, FeedbackStatus, ProjectStatus } from '../types';
import { ArrowLeft, Phone, Users, Building2, GraduationCap, MapPin, Briefcase, X, PieChart, Heart, Baby, BookOpen, AlertTriangle, Mail, Home, QrCode, Coins, Landmark, Coffee, Star, Edit3, Share2, MessageCircle, Image as ImageIcon, Link, Download } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  feedbacks: Feedback[];
  favorites: string[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onEdit?: (project: Project) => void; // New prop
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, feedbacks, favorites, onBack, onToggleFavorite, onEdit }) => {
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [showInvestorInfo, setShowInvestorInfo] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false); // State for Share Sheet

  // Risk Logic
  const urgentPendingFeedbacks = feedbacks.filter(
    f => f.projectId === project.id && f.status === FeedbackStatus.PENDING && f.isUrgent
  );
  
  // Specific condition: Construction status AND progress < 20
  const isProgressLagging = project.status === ProjectStatus.CONSTRUCTION && project.progress < 20;
  
  const hasRisk = urgentPendingFeedbacks.length > 0 || isProgressLagging;
  const isFav = favorites.includes(project.id);

  const handleCloseStakeholder = () => {
    setSelectedStakeholder(null);
    setShowQrCode(false); // Reset QR state when closing
  };

  const paymentRatio = project.contractValue > 0 ? Math.round((project.paymentReceived / project.contractValue) * 100) : 0;

  return (
    <div className="animate-slide-in-right relative pb-10">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 text-sm hover:text-teal-700 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> 返回列表
        </button>
        
        <div className="flex gap-2">
            <button
                onClick={() => setShowShareSheet(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 shadow-sm active:scale-95 transition-all"
            >
                <Share2 size={14} className="text-slate-500" />
                分享
            </button>
            {onEdit && (
                <button
                onClick={() => onEdit(project)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 shadow-sm active:scale-95 transition-all"
                >
                <Edit3 size={14} className="text-teal-600" />
                维护
                </button>
            )}
            <button
            onClick={() => onToggleFavorite(project.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isFav ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
            >
            <Star size={14} className={isFav ? "fill-amber-500 text-amber-500" : ""} />
            {isFav ? '已关注' : '关注'}
            </button>
        </div>
      </div>

      {/* Prominent Warning Banner for Lagging Progress */}
      {isProgressLagging && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm flex items-start animate-pulse-slow">
           <div className="bg-amber-100 p-2 rounded-full mr-3 shrink-0">
             <AlertTriangle size={24} className="text-amber-600" />
           </div>
           <div>
              <h3 className="text-lg font-bold text-amber-800 leading-tight">项目进度严重滞后</h3>
              <p className="text-xs text-amber-700 mt-1">当前进度仅为 <span className="font-bold">{project.progress}%</span>，低于预警阈值 (20%)。</p>
           </div>
        </div>
      )}

      {/* Project Info Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200/60 p-5 mb-6 relative overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full -mr-8 -mt-8 z-0"></div>
        
        {hasRisk && (
           <div className="absolute top-0 right-0 p-2 z-10">
             <div className="animate-pulse bg-red-100 text-red-600 rounded-full p-1.5 shadow-sm">
                <AlertTriangle size={18} />
             </div>
           </div>
        )}

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2 pr-8">
               <h2 className="text-xl font-bold text-slate-800 leading-snug">{project.name}</h2>
            </div>
            
            <div className="flex gap-2 mb-4">
                 <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-100">
                    {project.type}
                 </span>
                 <span className={`text-xs px-2 py-0.5 rounded font-medium border ${project.businessType === '总包' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'}`}>
                    {project.businessType}模式
                 </span>
            </div>
            
            {/* General Risk Summary (Feedbacks & Other Risks) */}
            {hasRisk && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start">
                 <AlertTriangle size={16} className="text-red-500 mr-2 mt-0.5 shrink-0" />
                 <div className="text-xs text-red-700">
                    <span className="font-bold block mb-0.5">风险提示汇总</span>
                    <ul className="list-disc pl-3 space-y-0.5">
                       {urgentPendingFeedbacks.length > 0 && (
                         <li>有 {urgentPendingFeedbacks.length} 条紧急客户反馈未响应</li>
                       )}
                       {isProgressLagging && (
                         <li>建设进度滞后 (详见上方警告)</li>
                       )}
                    </ul>
                 </div>
              </div>
            )}
            
            {/* Financial Info Card */}
            <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center text-xs font-bold text-slate-700">
                   <Coins size={14} className="mr-1.5 text-amber-600" /> 商务信息
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                     <span className="text-[10px] text-slate-400 block mb-0.5">合同标的额</span>
                     <span className="text-sm font-bold text-slate-800">¥{(project.contractValue / 10000).toFixed(2)}亿</span>
                  </div>
                  <div>
                     <span className="text-[10px] text-slate-400 block mb-0.5">累计回款</span>
                     <span className="text-sm font-bold text-teal-700">¥{(project.paymentReceived / 10000).toFixed(2)}亿</span>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-slate-500">回款比例</span>
                     <span className="font-bold text-slate-700">{paymentRatio}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${paymentRatio < 30 ? 'bg-red-400' : (paymentRatio < 70 ? 'bg-amber-400' : 'bg-teal-500')}`}
                      style={{ width: `${paymentRatio}%` }}
                    ></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
               <div className="col-span-2">
                 <span className="block text-slate-400 text-xs mb-0.5">投资方 / 建设单位</span>
                 <button 
                   onClick={() => setShowInvestorInfo(true)}
                   className="text-slate-800 font-bold flex items-center hover:text-teal-600 transition-colors text-left"
                 >
                    <Building2 size={14} className="mr-1 text-slate-400" />
                    {project.investor.name}
                    <span className="ml-2 text-[10px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded border border-teal-100 hover:bg-teal-100">查看股东</span>
                 </button>
               </div>
               <div>
                 <span className="block text-slate-400 text-xs mb-0.5">建设地点</span>
                 <span className="text-slate-700 font-medium">{project.location}</span>
               </div>
               <div>
                 <span className="block text-slate-400 text-xs mb-0.5">装机容量</span>
                 <span className="text-slate-700 font-medium">{project.capacity}</span>
               </div>
               <div>
                 <span className="block text-slate-400 text-xs mb-0.5">项目经理</span>
                 <span className="text-slate-700 font-medium">{project.manager}</span>
               </div>
               <div>
                 <span className="block text-slate-400 text-xs mb-0.5">当前状态</span>
                 <span className="text-slate-700 font-medium flex items-center">
                   {project.status}
                   {isProgressLagging && <AlertTriangle size={14} className="text-amber-500 ml-1.5" />}
                 </span>
               </div>
            </div>
        </div>
      </div>

      {/* Stakeholders Section */}
      <div>
        <div className="flex items-center justify-between mb-3 pl-1 border-l-4 border-teal-600">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center ml-2">
            <Users size={16} className="mr-2" /> 关键决策人
          </h3>
          <span className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-full border border-teal-100">
            点击查看档案
          </span>
        </div>

        <div className="space-y-3">
          {project.stakeholders.map(stakeholder => (
            <div 
              key={stakeholder.id} 
              onClick={() => setSelectedStakeholder(stakeholder)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center cursor-pointer active:bg-teal-50 transition-colors group"
            >
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200 group-hover:border-teal-300 transition-colors">
                    <img 
                      src={stakeholder.avatarUrl} 
                      alt={stakeholder.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?background=random&color=fff&name=' + stakeholder.name;
                      }}
                    />
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-800">{stakeholder.name}</span>
                     {stakeholder.influence === 'High' && (
                       <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-medium">关键</span>
                     )}
                   </div>
                   <p className="text-xs text-slate-500">{stakeholder.role}</p>
                 </div>
               </div>
               
               <div className="flex items-center text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <span className="text-xs font-bold mr-1">档案</span>
                  <ArrowLeft size={14} className="rotate-180" />
               </div>
            </div>
          ))}
          
          {project.stakeholders.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-200">
              暂无决策人信息录入
            </div>
          )}
        </div>
      </div>

      {/* Investor Info Modal */}
      {showInvestorInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl p-5 shadow-2xl relative max-h-[80vh] flex flex-col">
             <button 
              onClick={() => setShowInvestorInfo(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2 z-10"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-1 pr-8 shrink-0">{project.investor.name}</h3>
            <p className="text-xs text-slate-400 mb-4 shrink-0">企业架构与股东信息</p>
            
            <div className="overflow-y-auto pr-1">
               <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-3">
                 <PieChart size={14} className="mr-1" /> 股东构成
               </h4>
               <div className="space-y-3 pb-2">
                 {project.investor.shareholders.length > 0 ? (
                   project.investor.shareholders.map((sh, idx) => (
                     <div key={idx} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                        <div className="text-sm font-medium text-slate-700 leading-tight flex-1 mr-2">{sh.name}</div>
                        <div className="text-right shrink-0">
                           <div className="text-xs font-bold text-teal-600">{sh.percentage}</div>
                           <div className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${sh.type === '控股' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                             {sh.type}
                           </div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-sm text-slate-400 italic">暂无股东披露信息</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* WECHAT STYLE SHARE SHEET */}
      {showShareSheet && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
           {/* Backdrop Click */}
           <div className="absolute inset-0" onClick={() => setShowShareSheet(false)}></div>
           
           <div 
             className="bg-slate-100 rounded-t-xl overflow-hidden z-10 shadow-2xl"
             style={{ animation: 'slideUp 0.3s ease-out forwards' }}
           >
              {/* Row 1: Main Actions */}
              <div className="p-4 bg-slate-100/90 backdrop-blur-md overflow-x-auto">
                 <div className="flex gap-6 justify-center min-w-max px-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm active:bg-slate-200 transition-colors">
                           <MessageCircle size={24} className="text-emerald-500" />
                        </div>
                        <span className="text-[10px] text-slate-500">发送给朋友</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm active:bg-slate-200 transition-colors">
                           <div className="w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                              <span className="text-[8px] font-bold">Moments</span>
                           </div>
                        </div>
                        <span className="text-[10px] text-slate-500">分享到朋友圈</span>
                    </div>
                 </div>
              </div>

              {/* Row 2: Secondary Actions */}
              <div className="p-4 pt-0 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 overflow-x-auto">
                 <div className="flex gap-6 justify-center min-w-max px-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm active:bg-slate-200 transition-colors">
                           <Link size={24} className="text-slate-600" />
                        </div>
                        <span className="text-[10px] text-slate-500">复制链接</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm active:bg-slate-200 transition-colors">
                           <ImageIcon size={24} className="text-slate-600" />
                        </div>
                        <span className="text-[10px] text-slate-500">生成海报</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm active:bg-slate-200 transition-colors">
                           <Download size={24} className="text-slate-600" />
                        </div>
                        <span className="text-[10px] text-slate-500">保存到手机</span>
                    </div>
                 </div>
              </div>

              {/* Cancel Button */}
              <button 
                onClick={() => setShowShareSheet(false)}
                className="w-full bg-white py-4 text-sm font-medium text-slate-700 active:bg-slate-50"
              >
                取消
              </button>
           </div>
        </div>
      )}

      {/* Stakeholder Profile Modal - Fixed Structure for Mobile */}
      {selectedStakeholder && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Click Area */}
          <div className="absolute inset-0" onClick={handleCloseStakeholder}></div>
          
          <div 
             className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden z-10"
             style={{ animation: 'slideUp 0.3s ease-out forwards' }}
          >
            {/* Modal Header (Fixed) */}
            <div className="px-5 pt-5 pb-2 flex justify-between items-start shrink-0 bg-white z-10">
               <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md">
                     <img 
                        src={selectedStakeholder.avatarUrl} 
                        alt={selectedStakeholder.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?background=random&color=fff&name=' + selectedStakeholder.name;
                        }}
                      />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mt-1">
                      {selectedStakeholder.name}
                      {selectedStakeholder.age && <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{selectedStakeholder.age}岁</span>}
                    </h3>
                    <p className="text-teal-700 font-medium text-sm">{selectedStakeholder.role}</p>
                  </div>
               </div>
               
               <button 
                  onClick={(e) => { e.stopPropagation(); handleCloseStakeholder(); }}
                  className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors -mr-2 -mt-2"
                >
                  <X size={20} />
               </button>
            </div>

            {/* Modal Actions */}
            <div className="px-5 pb-4 shrink-0 border-b border-slate-50">
               <div className="flex gap-2">
                   <a 
                     href={`tel:${selectedStakeholder.phone}`} 
                     className="bg-teal-600 text-white text-xs px-4 py-2 rounded-full flex items-center active:bg-teal-700 shadow-md shadow-teal-200 transition-transform active:scale-95 hover:bg-teal-700"
                   >
                     <Phone size={14} className="mr-1.5" /> 拨打手机
                   </a>
                   <div className="px-3 py-2 rounded-full bg-slate-50 text-slate-500 text-xs font-mono flex items-center border border-slate-200">
                      {selectedStakeholder.phone}
                   </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-safe">
              
               {/* Hobbies / Lifestyle Section (New) */}
               {selectedStakeholder.hobbies && selectedStakeholder.hobbies.length > 0 && (
                 <div className="space-y-3">
                    <div className="flex items-center text-sm font-bold text-slate-700">
                      <Coffee size={16} className="mr-2 text-amber-500" /> 个人喜好
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStakeholder.hobbies.map((hobby, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-100 shadow-sm">
                          {hobby}
                        </span>
                      ))}
                    </div>
                 </div>
               )}

               {/* Contact Info (Address, Email, Wechat) */}
               <div className="space-y-3">
                 <div className="flex items-center text-sm font-bold text-slate-700">
                   <Briefcase size={16} className="mr-2 text-indigo-500" /> 联系信息
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    {/* Address */}
                    <div className="flex items-start">
                       <Home size={16} className="text-slate-400 mr-2 mt-0.5 shrink-0" />
                       <div className="text-sm text-slate-800 leading-tight">
                         <span className="block text-xs text-slate-400 mb-0.5">家庭住址</span>
                         {selectedStakeholder.address || '未录入'}
                       </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-start pt-2 border-t border-slate-200/50">
                       <Mail size={16} className="text-slate-400 mr-2 mt-0.5 shrink-0" />
                       <div className="text-sm text-slate-800 leading-tight truncate w-full">
                         <span className="block text-xs text-slate-400 mb-0.5">电子邮箱</span>
                         <a href={`mailto:${selectedStakeholder.email}`} className="text-teal-600 hover:underline truncate block">
                           {selectedStakeholder.email || '未录入'}
                         </a>
                       </div>
                    </div>
                     {/* WeChat */}
                     <div className="flex items-start pt-2 border-t border-slate-200/50">
                       <QrCode size={16} className="text-slate-400 mr-2 mt-0.5 shrink-0" />
                       <div className="w-full">
                         <span className="block text-xs text-slate-400 mb-1">微信联系</span>
                         {showQrCode ? (
                           <div className="mt-2 text-center bg-white p-2 rounded border border-slate-200 inline-block relative">
                              <button 
                                onClick={() => setShowQrCode(false)}
                                className="absolute -top-2 -right-2 bg-slate-200 rounded-full p-0.5 text-slate-500 hover:bg-slate-300"
                              >
                                <X size={12} />
                              </button>
                              <img 
                                src={selectedStakeholder.wechatQrUrl} 
                                alt="WeChat QR" 
                                className="w-32 h-32 object-contain"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">扫一扫添加好友</p>
                           </div>
                         ) : (
                           <button 
                             onClick={() => setShowQrCode(true)}
                             className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full flex items-center active:bg-emerald-600 transition-colors shadow-sm"
                           >
                             <QrCode size={12} className="mr-1.5" /> 显示微信二维码
                           </button>
                         )}
                       </div>
                    </div>
                 </div>
               </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center text-sm">
                   <div className="flex items-center text-slate-400 w-20 shrink-0">
                     <MapPin size={14} className="mr-2" /> 籍贯
                   </div>
                   <div className="text-slate-800 font-medium">
                     {selectedStakeholder.birthplace || '暂无信息'}
                   </div>
                </div>
              </div>

              {/* Family Info - Spouse & Children */}
              {(selectedStakeholder.spouse || (selectedStakeholder.children && selectedStakeholder.children.length > 0)) && (
                <div className="space-y-3">
                  <div className="flex items-center text-sm font-bold text-slate-700">
                    <Heart size={16} className="mr-2 text-rose-500" /> 家庭关系
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Spouse */}
                    {selectedStakeholder.spouse && (
                      <div className="p-3 border-b border-slate-50 flex items-start">
                        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mr-3 shrink-0">
                           <Heart size={14} fill="currentColor" />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-800">
                             配偶：{selectedStakeholder.spouse.name}
                           </div>
                           {selectedStakeholder.spouse.info && (
                             <div className="text-xs text-slate-500 mt-0.5">{selectedStakeholder.spouse.info}</div>
                           )}
                        </div>
                      </div>
                    )}
                    
                    {/* Children */}
                    {selectedStakeholder.children && selectedStakeholder.children.map((child, idx) => (
                      <div key={idx} className="p-3 border-b border-slate-50 flex items-start last:border-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mr-3 shrink-0">
                           <Baby size={16} />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                             {child.gender === '男' ? '儿子' : '女儿'} 
                             <span className="font-normal text-slate-400 text-xs">({child.age}岁)</span>
                           </div>
                           <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                             <BookOpen size={10} className="mr-1" /> {child.status}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              <div className="space-y-3">
                 <div className="flex items-center text-sm font-bold text-slate-700">
                   <GraduationCap size={16} className="mr-2 text-blue-500" /> 教育背景
                 </div>
                 <div className="space-y-2">
                    {selectedStakeholder.education && selectedStakeholder.education.length > 0 ? (
                      selectedStakeholder.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                           <div>
                             <div className="font-medium text-slate-800">{edu.school}</div>
                             <div className="text-xs text-slate-500">{edu.degree} {edu.major ? `· ${edu.major}` : ''}</div>
                           </div>
                           <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                             {edu.gradYear}年毕业
                           </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 pl-6">暂无信息</span>
                    )}
                 </div>
              </div>

              {/* Career Timeline */}
              <div>
                 <div className="flex items-center text-sm font-bold text-slate-700 mb-3">
                   <Briefcase size={16} className="mr-2 text-violet-500" /> 工作履历
                 </div>
                 
                 <div className="relative pl-2 ml-2 border-l-2 border-slate-200 space-y-6 pb-2">
                    {selectedStakeholder.career && selectedStakeholder.career.length > 0 ? (
                      selectedStakeholder.career.map((job, idx) => (
                        <div key={idx} className="relative pl-6">
                           {/* Timeline Dot */}
                           <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-violet-500' : 'bg-slate-300'}`}></div>
                           
                           {/* Content */}
                           <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-400 mb-0.5 font-mono">
                               {job.start} - {job.end}
                             </span>
                             <h4 className="text-sm font-bold text-slate-800">{job.company}</h4>
                             <div className="text-sm text-violet-700 font-medium mb-1">{job.role}</div>
                             {job.description && (
                               <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                                 {job.description}
                               </p>
                             )}
                           </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 pl-6">暂无详细履历信息。</p>
                    )}
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
