
export type UserRole = 'standard' | 'validator';
export type MembershipTier = 'basic' | 'pro' | 'elite';

export interface Profile {
  id: string;
  fullName: string;
  isValidator: boolean;
  avatarUrl?: string;
  activeRole: UserRole;
  membershipTier: MembershipTier;
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

export type ProofMethod = 'image' | 'video' | 'text' | 'link' | 'file' | 'code_snippet' | 'gps' | 'qr_scan';

export interface Task {
  id: string;
  creatorId: string;
  title: string;
  rewardAmount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  shortDescription: string;
  instructions: string;
  proofMethod: ProofMethod;
  category: string;
  status: 'active' | 'completed' | 'paused';
  submissionsCount: number;
  externalUrl?: string;
  externalUrlLabel?: string;
  validatorGuidelines?: string;
  targetCompletions?: number;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userReputation: number;
  membershipTier: MembershipTier;
  amount: number;
  signalFee: number;
  isBoosted: boolean;
  timeline: string;
  proposalText: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Project {
  id: string;
  creatorId: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  budgetType: 'fixed' | 'hourly';
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  description: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  clientName: string;
  createdAt: string;
  bids?: Bid[];
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  userName?: string;
  status: 'pending' | 'approved' | 'rejected';
  proofText?: string;
  proofImageUri?: string;
  proofLink?: string;
  createdAt: string;
  aiAuditResult?: {
    suggestedStatus: string;
    rationale: string;
    discrepancies: string[];
  };
}

export type NotificationType = 'reward' | 'audit' | 'bid' | 'system' | 'milestone';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: NotificationType;
  status: 'unread' | 'read';
  createdAt: string;
  link?: string;
}
