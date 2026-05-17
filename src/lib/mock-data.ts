import { Profile, Wallet, TaskMini, ProjectDetail, Submission, Notification } from './types';

export const mockProfile: Profile = {
  id: 'user_1',
  fullName: 'Alex Lightning',
  isValidator: true,
  activeRole: 'standard',
  membershipTier: 'pro',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Strategic systems architect specializing in Bitcoin L2 integrations and decentralized workforce protocols. High-intensity node contributor.',
  skills: ['Next.js', 'TypeScript', 'LND', 'Rust', 'Security Audit', 'System Design'],
  location: 'San Salvador, SV',
  reputation: 94,
  stats: {
    tasksCompleted: 48,
    projectsHired: 5,
    totalEarned: 142500,
    totalSpent: 92000,
  }
};

export const mockWallet: Wallet = {
  available_balance: 50500,
  pending_balance: 4200,
  locked_balance: 15000,
  total_rewarded: 142500,
  total_deposited: 100000,
  total_withdrawn: 50000,
  total_sats: 69700,
  transactions: [],
};

export const mockTasks: TaskMini[] = [
  {
    id: 't1',
    title: 'Audit L2 Bridge Documentation',
    short_description: 'Meticulously review the technical specification for the Satoshi-Bridge protocol.',
    description: 'Meticulously review the technical specification for the Satoshi-Bridge protocol.',
    category: { id: 'c1', name: 'Security', slug: 'security' },
    difficulty: 'medium',
    reward_amount: 1500,
    external_url: 'https://example.com/whitepaper',
    submissions_count: 8,
    proof_method: 'text',
    boost_multiplier: 1.0,
    boost_ends_at: null,
    boosted: 'no',
    created_at: new Date().toISOString()
  },
  {
    id: 't2',
    title: 'Validate Multi-sig Escrow Logic',
    short_description: 'Formal verification of the L2 multisig contract logic.',
    description: 'Formal verification of the L2 multisig contract logic.',
    category: { id: 'c2', name: 'Engineering', slug: 'engineering' },
    difficulty: 'hard',
    reward_amount: 7500,
    external_url: null,
    submissions_count: 2,
    proof_method: 'code_snippet',
    boost_multiplier: 1.5,
    boost_ends_at: new Date(Date.now() + 86400000).toISOString(),
    boosted: 'yes',
    created_at: new Date().toISOString()
  }
];

export const mockProjects: ProjectDetail[] = [
  {
    id: 'p1',
    title: 'Enterprise L2 Payroll Infrastructure',
    slug: 'enterprise-l2-payroll',
    short_description: 'Architecting a borderless payroll system for enterprise-grade remote workforces.',
    creator: 'user_1',
    description: 'Architecting a borderless payroll system for enterprise-grade remote workforces. Requires deep expertise in Lightning Network channel management.',
    requirements: '• Rust/LND expertise required\n• Experience with non-custodial wallet architecture',
    client_name: 'Satoshi Core Labs',
    budget: '150,000 - 450,000 SAT',
    budget_type: 'fixed',
    experience_level: 'expert',
    estimated_duration_days: 60,
    fee_cost: '250 SAT',
    bid_cost: 1,
    max_bids: 10,
    bids_count: 2,
    total_bids: '2 Proposals',
    avg_bid: 350000,
    available_slots: '1 Node',
    status: 'open',
    skills: [{ id: 's1', name: 'Rust' }, { id: 's2', name: 'LND' }],
    milestones: [
      { id: 'm1', title: 'Architecture Review', description: 'System design audit', amount: 50000, status: 'pending', order: 1, due_date: null, completed_at: null, created_at: new Date().toISOString() }
    ],
    hired_name: 'None',
    selected_bid: null,
    deadline: null,
    is_featured: true,
    is_remote: true,
    is_public: true,
    allow_bidding: true,
    image: null,
    attachment: null,
    views_count: 124,
    contract: null,
    delivery_count: '0 Deliveries',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bids: [
      {
        id: 'bid_1',
        project: 'p1',
        user: 99,
        user_display: 'AlphaNode Architect',
        amount: 380000,
        signal_fee: 500,
        is_boosted: true,
        timeline: '6 weeks',
        proposal_text: 'I have previously deployed L2 payment rails for three Fortune 500 equivalent crypto entities.',
        status: 'pending',
        status_display: 'Pending Review',
        submitted_count: 1,
        created_at: new Date().toISOString(),
        user_reputation: 98,
        membership_tier: 'elite'
      }
    ]
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub_1',
    task: 't1',
    user: 99,
    user_name: 'JungleNode',
    task_title: 'Audit L2 Bridge Documentation',
    status: 'pending',
    proof_text: 'Audit complete. Identified a potential double-spend vulnerability in logic.',
    ai_audit_result: null,
    ai_score: null,
    ai_notes: '',
    validator_notes: '',
    reviewer_name: 'Pending',
    reviewed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'reward',
    type_display: 'Yield Reward',
    status: 'unread',
    status_display: 'Unread Signal',
    title: 'Mission Yield Finalized',
    message: 'Your contribution to "L2 Bridge Implementation" has been verified. 12,000 SAT added.',
    link: '/settings?tab=wallet',
    read_at: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  }
];
