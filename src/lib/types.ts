/**
 * @fileOverview Professional Type Definitions synchronized with Django models and OpenAPI schema.
 */

export type UserStatus = 'active' | 'suspended' | 'banned';
export type UserRole = 'standard' | 'validator';

export interface User {
  id: number;
  email: string;
  display_name: string;
  tier?: string; // UUID
  status: UserStatus;
  is_validator: boolean;
  reputation: number;
  tasks_completed: number;
  projects_hired: number;
  total_earned: number;
  total_spent: number;
  profile: ProfileData;
}

export interface ProfileData {
  avatar_url?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  website?: string;
  skills?: any;
  completed_tasks: number;
  successful_projects: number;
  total_earned: number;
  total_spent: number;
}

export interface Wallet {
  available_balance: number;
  pending_balance: number;
  locked_balance: number;
  total_rewarded: number;
  total_deposited: number;
  total_withdrawn: number;
  total_sats: number;
  transactions: WalletTransaction[];
}

export interface DepositInvoiceResponse {
  transaction_id: string;
  payment_request: string;
  payment_hash: string;
  amount_sats: number;
  expires_at: string;
  expires_in: number;
  qr_code: string;
}

export type WalletTransactionStatus = 'pending' | 'confirmed' | 'failed' | 'refunded' | 'expired';
export type WalletTransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'reward_payout' 
  | 'bid_lock' 
  | 'bid_release' 
  | 'escrow_in' 
  | 'escrow_out' 
  | 'task_fee_deduction';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  type_display: string;
  amount: number;
  balance_after: number;
  lnd_invoice: string;
  lnd_payment_hash: string;
  status: WalletTransactionStatus;
  status_display: string;
  description: string;
  linked_object_type: string;
  linked_object_id: string;
  created_at: string;
  settled_at: string | null;
}

export type ProofMethod = 
  | 'image' | 'screenshot' | 'video' | 'text' | 'response' | 'link' | 'social_link' 
  | 'file' | 'confirm' | 'account_action' | 'app_install' | 'email_confirm' 
  | 'qr_scan' | 'gps' | 'code_snippet';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  is_active: boolean;
  task_count: number;
  created_at: string;
}

export interface TaskMini {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: { id: string; name: string; slug: string; icon?: string };
  difficulty: Difficulty;
  reward_amount: number;
  external_url: string | null;
  submissions_count: number;
  proof_method: ProofMethod;
  boost_multiplier: number;
  boost_ends_at: string | null;
  boosted: string;
  created_at: string;
}

export type BudgetType = 'fixed' | 'hourly';
export type ExperienceLevel = 'entry' | 'intermediate' | 'expert';
export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'under_review' | 'completed' | 'cancelled' | 'disputed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'active' | 'submitted' | 'approved' | 'paid' | 'disputed';
  order: number;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Budget {
  min: number;
  max: number;
  type: BudgetType;
}

export interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  creator: string;
  description: string;
  requirements: string;
  client_name: string;
  budget: Budget;
  budget_type: BudgetType;
  experience_level: ExperienceLevel;
  estimated_duration_days: number | null;
  fee_cost: number;
  bid_cost: number;
  max_bids: number;
  bids_count: number;
  total_bids: number;
  avg_bid: number;
  available_slots: number;
  status: ProjectStatus;
  skills: Skill[];
  milestones: Milestone[];
  hired_name: string | null;
  selected_bid: string | null;
  deadline: string | null;
  is_featured: boolean;
  is_remote: boolean;
  is_public: boolean;
  allow_bidding: boolean;
  image: string | null;
  attachment: string | null;
  views_count: number;
  contract: any;
  delivery_count: number;
  created_at: string;
  updated_at: string;
  bids?: Bid[];
}

export interface Submission {
  id: string;
  task: string;
  user: number | string;
  user_name: string;
  task_title: string;
  status: 'pending' | 'approved' | 'rejected' | 'disputed';
  proof_text: string;
  ai_audit_result: any;
  ai_score: number | null;
  ai_notes: string;
  validator_notes: string;
  reviewer_name: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  project: string;
  user: number | string;
  user_display: string;
  amount: number;
  signal_fee: number;
  is_boosted: boolean;
  timeline: string;
  proposal_text: string;
  status: 'pending' | 'accepted' | 'rejected';
  status_display: string;
  submitted_count: number;
  created_at: string;
  user_reputation?: number;
  membership_tier?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon?: string;
}

export type NotificationType = 'reward' | 'audit' | 'bid' | 'system' | 'milestone' | 'payment';

export interface Notification {
  id: string;
  type: NotificationType;
  type_display: string;
  status: 'unread' | 'read';
  status_display: string;
  title: string;
  message: string;
  link: string;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
