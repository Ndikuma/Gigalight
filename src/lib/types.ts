export type UserRole = 'standard' | 'validator';

export interface Profile {
  id: string;
  fullName: string;
  isValidator: boolean;
  avatarUrl?: string;
  activeRole: UserRole;
  bio?: string;
  skills: string[];
  location?: string;
  reputation: number; // 0-100
  stats: {
    tasksCompleted: number;
    projectsHired: number;
    totalEarned: number;
    totalSpent: number;
  };
}

export interface Wallet {
  availableBalance: number;
  pendingBalance: number;
  totalRewarded: number;
}

export interface Task {
  id: string;
  title: string;
  rewardAmount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  shortDescription: string;
  proofMethod: 'screenshot' | 'text' | 'link' | 'code_snippet';
  category: string;
  status: 'active' | 'completed';
}

export interface Project {
  id: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  budgetType: 'fixed' | 'hourly';
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  description: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed';
  clientName: string;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  proofText?: string;
  proofImageUri?: string;
  createdAt: string;
  aiAuditResult?: {
    status: string;
    rationale: string;
  };
}
