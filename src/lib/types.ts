/**
 * @fileOverview Professional Type Definitions synchronized with Django models and OpenAPI schema.
 */

export type UserStatus = 'active' | 'suspended' | 'banned';
export type UserRole = 'standard' | 'validator';

export interface User {
  id: number;
  email: string;
  display_name: string;
  tier?: string; // UUID string
  status: UserStatus;
  is_validator: boolean;
  reputation: number;
  tasks_completed: number;
  projects_hired: number;
  total_earned: number;
  total_spent: number;
  current_tier?: {
    id: string;
    name: string;
    display_label: string;
    fee_task: number;
    fee_project: number;
    cost_sats: number;
    icon: string;
  };
  profile: ProfileData;
  wallet?: {
    available_balance: number;
    pending_balance: number;
    total_rewarded: number;
  };
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

export interface Tier {
  id: string;
  name: string;
  display_label: string;
  fee_task: number;
  fee_project: number;
  cost_sats: number;
  sort_order: number;
  is_active: boolean;
  description: string;
  benefits: string;
  icon: string;
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface TierPaymentResponse {
  transaction_id: string;
  payment_request: string;
  payment_hash: string;
  amount_sats: number;
  expires_at: string;
  expires_in: number;
  qr_code: string;
  tier: Partial<Tier>;
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

export interface DepositStatusResponse {
  transaction_id: string;
  payment_hash: string;
  payment_request: string;
  amount_sats: number;
  blink_status?: string;
  status: WalletTransactionStatus;
  balance_after: number;
  pending_balance: number;
  available_balance: number;
  created_at: string;
  settled_at: string | null;
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

export type TaskStatus = 'pending' | 'active' | 'approved' | 'completed' | 'paused' | 'archived';
export type SubmissionStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'needs_revision';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TaskInstructions {
  summary?: string;
  steps: {
    title: string;
    description?: string;
    required?: boolean;
  }[];
  proof_requirements: string[];
  disallowed?: string[];
  estimated_minutes?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  is_active: boolean;
  task_count: number;
  created_at: string;
}

export interface SubTask {
  id: string | number;
  title: string;
  description: string;
  order: number;
  reward_amount: number;
  is_installment: boolean;
  submission_fee_sats: number;
  submitter_pays_fee_upfront: boolean;
  effective_submission_fee_sats: number;
  effective_submitter_pays_fee_upfront: boolean;
  fee_payment_timing: 'submit' | 'payout';
  submissions_count: number;
  approved_count: number;
}

export interface TaskMini {
  id: string;
  creator: number | string;
  creator_display: string;
  title: string;
  short_description: string;
  description: string;
  instructions: TaskInstructions;
  category: { id: string; name: string; slug: string; icon?: string };
  difficulty: Difficulty;
  status: TaskStatus;
  reward_amount: number;
  target_completions: number;
  submissions_count: number;
  submission_fee_sats: number;
  submitter_pays_fee_upfront: boolean;
  submission_fee_payment_timing: 'submit' | 'payout';
  proof_method: ProofMethod;
  external_url: string | null;
  boost_multiplier: number;
  boost_ends_at: string | null;
  boosted: boolean;
  subtasks: SubTask[];
  created_at: string;
}

export interface TaskWorkbench {
  task: TaskMini;
  mode: 'task' | 'subtasks';
  instructions: TaskInstructions;
  submit_url: string;
  total_steps: number;
  approved_steps: number;
  submitted_steps: number;
  pending_steps: number;
  total_reward: number;
  earned_reward: number;
  next_subtask: SubTask | null;
  submissions: Submission[];
}

export interface TaskManagement {
  task: TaskMini;
  mode: 'task' | 'subtasks';
  instructions: TaskInstructions;
  target_completions: number;
  completed_workers: number;
  reward_per_worker: number;
  potential_total_reward: number;
  paid_sats: number;
  remaining_slots: number;
  submission_counts: {
    pending: number;
    submitted: number;
    approved: number;
    rejected: number;
    needs_revision: number;
  };
  subtasks: SubTask[];
  review_queue: Submission[];
  recent_submissions: Submission[];
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
  total_bids: number | string;
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
  task_title: string;
  subtask?: string | number;
  subtask_title?: string;
  user: number | string;
  worker_name: string;
  status: SubmissionStatus;
  reward_amount: number;
  reward_amount_snapshot: number;
  fee_amount_snapshot: number;
  fee_paid_upfront: boolean;
  fee_due_on_payout: boolean;
  fee_payment_timing: 'submit' | 'payout';
  net_reward_amount: number;
  is_paid: boolean;
  proof_text: string;
  proof_image_uri: string;
  proof_link: string;
  proof_file_uri: string;
  proof_metadata: any;
  ai_audit_result: any;
  ai_score: number | null;
  validator_notes: string;
  submitted_at: string;
  reviewed_at: string | null;
  paid_at: string | null;
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

export interface ProfessionalService {
  id: string;
  creator: number | string;
  creator_display: string;
  title: string;
  description: string;
  short_description: string;
  price_sats: number;
  delivery_days: number;
  category: string;
  skills: Skill[];
  is_active: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
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
