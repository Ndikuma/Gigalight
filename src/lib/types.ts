export type UserRole = 'user' | 'validator';

export interface Profile {
  id: string;
  fullName: string;
  isValidator: boolean;
  avatarUrl?: string;
  activeRole: UserRole;
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
  proofMethod: string;
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
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  proofText?: string;
  proofImageUri?: string;
  createdAt: string;
}
