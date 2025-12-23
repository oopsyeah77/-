
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import ProjectList from './views/ProjectList';
import ProjectDetail from './views/ProjectDetail';
import ProjectEdit from './views/ProjectEdit'; // Import ProjectEdit
import FeedbackManager from './views/FeedbackManager';
import Profile from './views/Profile';
import { MOCK_PROJECTS, MOCK_FEEDBACKS } from './constants';
import { Project, Feedback, UserProfile, ChangeRequest, ApprovalStatus } from './types';

// Default User (General Manager)
const DEFAULT_USER: UserProfile = {
  name: '张总',
  initials: 'GM',
  title: '南方总部总经理',
  department: '总经办',
  employeeId: 'NEPDI-S-001',
  email: 'zhang.gm@nepdi.com.cn',
  phone: '138 0013 8000',
  officeLocation: '广东省深圳市南山区科苑南路3176号 彩讯科技大厦30层',
  avatarColor: 'bg-slate-700',
  role: 'ADMIN' // Level 3 Approver
};

// Wrapper component to handle routing logic inside HashRouter context
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Maintenance Workflow State
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);

  // Favorites State with LocalStorage Persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nepdi_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync internal tab state with URL path
  useEffect(() => {
    const path = location.pathname.substring(1); 
    if (['dashboard', 'projects', 'feedback', 'profile'].includes(path)) {
      setActiveTab(path);
      if (path === 'projects') {
          setSelectedProject(null);
          setEditProject(null);
      }
    } else if (path === '') {
        setActiveTab('dashboard');
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem('nepdi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}`);
  };

  const handleUpdateFeedback = (updatedFeedback: Feedback) => {
    setFeedbacks(prev => prev.map(f => f.id === updatedFeedback.id ? updatedFeedback : f));
  };

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };

  // --- Login Simulation ---
  const handleLoginSwitch = (method: string) => {
    if (method === 'wecom') {
         // GM
         setCurrentUser(DEFAULT_USER);
    } else if (method === 'wechat') {
         // Dept Manager / Director (Level 2)
         setCurrentUser({
            name: '王主任',
            initials: 'VP', // Vice President / Principal
            title: '工程部主任 (分管副总)',
            department: '工程管理部',
            employeeId: 'NEPDI-S-020',
            email: 'wang.dm@nepdi.com.cn',
            phone: '139 2222 3333',
            officeLocation: '广东省深圳市南山区科苑南路3176号 彩讯科技大厦30层',
            avatarColor: 'bg-indigo-600',
            role: 'MANAGER' // Level 2 Approver
         });
    } else {
        // Project Manager (User)
        setCurrentUser({
            name: '李工',
            initials: 'PM',
            title: '项目经理',
            department: '工程管理部',
            employeeId: 'NEPDI-S-042',
            email: 'li.project@nepdi.com.cn',
            phone: '139 1234 5678',
            officeLocation: '广东省深圳市南山区科苑南路3176号 彩讯科技大厦30层',
            avatarColor: 'bg-teal-600',
            role: 'USER' // Level 1 Submitter
        });
    }
  };

  // --- Maintenance Workflow ---
  
  const handleEditProject = (project: Project) => {
     setEditProject(project);
     navigate(`/projects/${project.id}/edit`);
  };

  const handleSubmitChange = (projectId: string, field: string, oldVal: any, newVal: any) => {
     const project = projects.find(p => p.id === projectId);
     if (!project) return;

     const newReq: ChangeRequest = {
        id: `cr_${Date.now()}`,
        projectId: projectId,
        projectName: project.name,
        applicant: currentUser.name,
        applicantId: currentUser.employeeId,
        submitDate: new Date().toISOString().split('T')[0],
        status: ApprovalStatus.PENDING_LEVEL_2, // Submit -> Pending Level 2
        fieldChanged: field,
        oldValue: oldVal,
        newValue: newVal
     };

     setChangeRequests(prev => [newReq, ...prev]);
     alert('提交成功！已发送至部门主任(分管副总)审核。');
  };

  const handleApprove = (reqId: string) => {
     setChangeRequests(prev => prev.map(req => {
        if (req.id !== reqId) return req;

        // Workflow Logic
        if (req.status === ApprovalStatus.PENDING_LEVEL_2) {
            // Level 2 Approved -> Move to Level 3
            return {
                ...req,
                status: ApprovalStatus.PENDING_LEVEL_3,
                level2Approver: currentUser.name,
                level2Date: new Date().toISOString().split('T')[0]
            };
        } else if (req.status === ApprovalStatus.PENDING_LEVEL_3) {
            // Level 3 Approved -> Finalize
            
            // ACTUALLY UPDATE DATA
            applyProjectUpdate(req);

            return {
                ...req,
                status: ApprovalStatus.APPROVED,
                level3Approver: currentUser.name,
                level3Date: new Date().toISOString().split('T')[0]
            };
        }
        return req;
     }));
  };

  const handleReject = (reqId: string) => {
      setChangeRequests(prev => prev.map(req => 
         req.id === reqId ? { ...req, status: ApprovalStatus.REJECTED, rejectReason: '信息核对不符' } : req
      ));
  };

  const applyProjectUpdate = (req: ChangeRequest) => {
      setProjects(prevProjects => prevProjects.map(p => {
          if (p.id !== req.projectId) return p;
          
          const updated = { ...p };
          // Simple parsing logic for the demo
          if (req.fieldChanged === '项目进度') {
             updated.progress = parseInt(String(req.newValue).replace('%', ''));
          } else if (req.fieldChanged === '项目阶段') {
             updated.status = req.newValue as any;
          } else if (req.fieldChanged === '累计回款') {
             updated.paymentReceived = parseInt(String(req.newValue).replace('¥', '').replace('万', ''));
          }
          return updated;
      }));
      // Update selected project if it's the one being edited
      if (selectedProject?.id === req.projectId) {
         const p = projects.find(pp => pp.id === req.projectId);
         if(p) {
            // Re-apply update logic locally to selectedProject state
             const updated = { ...p };
             if (req.fieldChanged === '项目进度') {
                updated.progress = parseInt(String(req.newValue).replace('%', ''));
             } else if (req.fieldChanged === '项目阶段') {
                updated.status = req.newValue as any;
             } else if (req.fieldChanged === '累计回款') {
                updated.paymentReceived = parseInt(String(req.newValue).replace('¥', '').replace('万', ''));
             }
             setSelectedProject(updated);
         }
      }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange} 
      title="东北院南方总部项目通"
      currentUser={currentUser}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              projects={projects} 
              feedbacks={feedbacks} 
              favorites={favorites}
              onNavigate={handleTabChange}
              onSelectProject={handleProjectSelect}
            />
          } 
        />
        
        <Route 
          path="/projects" 
          element={
            <ProjectList 
              projects={projects} 
              favorites={favorites}
              onSelectProject={handleProjectSelect}
              onToggleFavorite={toggleFavorite}
            />
          } 
        />

        <Route 
          path="/projects/:id" 
          element={
            selectedProject ? (
              <ProjectDetail 
                project={selectedProject} 
                feedbacks={feedbacks}
                favorites={favorites}
                onBack={() => navigate('/projects')}
                onToggleFavorite={toggleFavorite}
                onEdit={handleEditProject} // Pass edit handler
              />
            ) : (
              <Navigate to="/projects" replace />
            )
          } 
        />

        {/* Maintenance Route */}
        <Route 
          path="/projects/:id/edit"
          element={
             editProject ? (
               <ProjectEdit 
                  project={editProject}
                  currentUser={currentUser}
                  onBack={() => {
                      setEditProject(null);
                      navigate(`/projects/${editProject.id}`);
                  }}
                  onSubmitChange={handleSubmitChange}
               />
             ) : (
                <Navigate to="/projects" replace />
             )
          }
        />
        
        <Route 
          path="/feedback" 
          element={
            <FeedbackManager 
              feedbacks={feedbacks} 
              projects={projects}
              onUpdateFeedback={handleUpdateFeedback}
            />
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <Profile 
              user={currentUser} 
              pendingApprovals={changeRequests}
              onLoginSwitch={handleLoginSwitch}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          } 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
