
export enum ProjectType {
  GENERATION = '电源-传统能源',
  GRID = '电网工程',
  NEW_ENERGY = '电源-新能源',
  INTERNATIONAL = '国际工程',
  MUNICIPAL = '市政工程',
  ENVIRONMENT = '生态环境',
  SURVEY = '勘测工程',
  DIGITAL = '数字化业务',
  GREEN_CHEM = '绿色化工'
}

export enum ProjectStatus {
  PROPOSAL = '项目建议书',
  FEASIBILITY = '可研',
  PRELIM_DESIGN = '初步设计',
  DRAWING = '施工图',
  CONSTRUCTION = '在建',
  COMPLETED = '已完工'
}

export enum FeedbackStatus {
  PENDING = '待处理',
  ASSIGNED = '已指派',
  IN_PROGRESS = '处理中',
  RESOLVED = '已响应'
}

// --- Approval Workflow Types ---
export enum ApprovalStatus {
  PENDING_LEVEL_2 = '待部门主任审核', // Updated: Level 2 (Department Director / Vice GM)
  PENDING_LEVEL_3 = '待总经理审批', // Level 3
  APPROVED = '已生效',
  REJECTED = '已驳回'
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  projectName: string;
  applicant: string; // Level 1: Submitter
  applicantId: string;
  submitDate: string;
  status: ApprovalStatus;
  
  // Data Snapshot
  fieldChanged: string; // e.g., "项目进度" or "合同额"
  oldValue: string | number;
  newValue: string | number;
  
  // Audit Trail
  level2Approver?: string;
  level2Date?: string;
  level3Approver?: string;
  level3Date?: string;
  rejectReason?: string;
}

export type BusinessType = '设计' | '总包';

// --- New User Profile Interface ---
export interface UserProfile {
  name: string;
  initials: string; // e.g. "张总" -> "张" or "GM"
  title: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  officeLocation: string;
  avatarColor: string; // Tailwind class e.g. "bg-teal-600"
  role: 'ADMIN' | 'MANAGER' | 'USER'; // Simple permission role
}

export interface Shareholder {
  name: string;
  type: '控股' | '参股';
  percentage: string;
}

export interface InvestorProfile {
  name: string;
  shareholders: Shareholder[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  gradYear: string; // 毕业年份
  major?: string;
}

export interface CareerEntry {
  start: string;
  end: string;
  company: string;
  role: string;
  description?: string;
}

export interface SpouseInfo {
  name: string;
  info?: string; // 工作单位或备注
}

export interface ChildInfo {
  gender: '男' | '女';
  age: number;
  status: string; // 就读学校或工作单位
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatarUrl: string; // Added avatar URL
  influence: 'High' | 'Medium' | 'Low';
  
  // New Contact Fields
  email?: string;
  address?: string; // Home Address
  wechatQrUrl?: string;

  // Personal Profile
  age?: number;
  birthplace?: string;
  hobbies?: string[]; // Added Hobbies
  education?: EducationEntry[];
  career?: CareerEntry[];
  spouse?: SpouseInfo;
  children?: ChildInfo[]; // New field for children
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  businessType: BusinessType; // New field: 承揽业务类型
  status: ProjectStatus;
  location: string;
  investor: InvestorProfile;
  capacity: string;
  manager: string;
  stakeholders: Stakeholder[];
  progress: number;
  
  // New Financial Fields
  contractValue: number; // Unit: 万元
  paymentReceived: number; // Unit: 万元
}

export interface Feedback {
  id: string;
  projectId: string;
  stakeholderId: string;
  content: string;
  receivedDate: string;
  status: FeedbackStatus;
  assignedTo: string;
  response?: string;
  isUrgent?: boolean; // New field for risk calculation
}
