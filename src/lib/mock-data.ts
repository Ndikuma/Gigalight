import { Profile, Wallet, Task, Project, TaskSubmission, Notification } from './types';

export const mockProfile: Profile = {
  id: 'user_1',
  fullName: 'Alex Lightning',
  isValidator: true,
  activeRole: 'standard',
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
  availableBalance: 50500,
  pendingBalance: 4200,
  totalRewarded: 142500,
};

export const mockTasks: Task[] = [
  {
    id: 't1',
    creatorId: 'user_admin',
    title: 'Audit L2 Bridge Documentation',
    rewardAmount: 1500,
    difficulty: 'medium',
    shortDescription: 'Meticulously review the latest technical specification for the Satoshi-Bridge protocol. Identify logical inconsistencies in the settlement flow.',
    proofMethod: 'text',
    category: 'Security',
    status: 'active',
    submissionsCount: 8,
  },
  {
    id: 't2',
    creatorId: 'user_1', // Owned by current user
    title: 'Validate Multi-sig Escrow Logic',
    rewardAmount: 7500,
    difficulty: 'hard',
    shortDescription: 'Formal verification of the L2 multisig contract logic. Focus on edge cases during partial release scenarios.',
    proofMethod: 'code_snippet',
    category: 'Engineering',
    status: 'active',
    submissionsCount: 2,
  },
  {
    id: 't3',
    creatorId: 'user_admin',
    title: 'UX Stress Test: Mobile Node',
    rewardAmount: 800,
    difficulty: 'easy',
    shortDescription: 'Perform a high-intensity interaction session on the mobile node simulator. Log any latency spikes during satoshi settlement.',
    proofMethod: 'screenshot',
    category: 'Quality Assurance',
    status: 'active',
    submissionsCount: 24,
  },
  {
    id: 't4',
    creatorId: 'user_admin',
    title: 'Translate Technical Roadmap (Spanish)',
    rewardAmount: 2200,
    difficulty: 'medium',
    shortDescription: 'Accurately localize the 2024 network roadmap for the Spanish-speaking community. Maintain technical precision.',
    proofMethod: 'text',
    category: 'Localization',
    status: 'active',
    submissionsCount: 5,
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    creatorId: 'user_1', // User is hiring for this
    title: 'Enterprise L2 Payroll Infrastructure',
    budgetMin: 150000,
    budgetMax: 450000,
    budgetType: 'fixed',
    experienceLevel: 'expert',
    description: 'We are architecting a borderless payroll system for enterprise-grade remote workforces. Requires deep expertise in Lightning Network channel management and automated multi-sig release protocols.',
    skills: ['Rust', 'LND', 'Distributed Systems', 'Cryptography'],
    status: 'open',
    clientName: 'Satoshi Core Labs',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    bids: [
      {
        id: 'bid_1',
        userId: 'node_alpha',
        userName: 'AlphaNode Architect',
        userReputation: 98,
        amount: 380000,
        timeline: '6 weeks',
        proposalText: 'I have previously deployed L2 payment rails for three Fortune 500 equivalent crypto entities. My proposed architecture utilizes a non-custodial hub-and-spoke model for maximum throughput.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending'
      },
      {
        id: 'bid_2',
        userId: 'node_delta',
        userName: 'Delta Labs',
        userReputation: 92,
        amount: 320000,
        timeline: '4 weeks',
        proposalText: 'Fast implementation focus. We use a proprietary SDK for rapid channel balancing that can reduce integration time by 30%.',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        status: 'pending'
      }
    ]
  },
  {
    id: 'p2',
    creatorId: 'user_admin',
    title: 'Global Compliance Integration Node',
    budgetMin: 8000,
    budgetMax: 12000,
    budgetType: 'hourly',
    experienceLevel: 'expert',
    description: 'Integrating borderless tax and regulatory tools into the L2 workforce dashboard. Must be familiar with international digital asset reporting standards.',
    skills: ['Legal Tech', 'API Integration', 'Data Security'],
    status: 'in_progress', // User is working on this
    clientName: 'Regulon Network',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'p3',
    creatorId: 'user_admin',
    title: 'High-Fidelity Wallet UI Redesign',
    budgetMin: 45000,
    budgetMax: 65000,
    budgetType: 'fixed',
    experienceLevel: 'intermediate',
    description: 'Transforming the existing wallet interface into a professional strategic tool. Focus on data density, dark-mode aesthetics, and transaction clarity.',
    skills: ['Figma', 'UI/UX Design', 'Motion Graphics'],
    status: 'open',
    clientName: 'OmniWallet',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    bids: [
      {
        id: 'bid_3',
        userId: 'user_design_pro',
        userName: 'PixelPioneer',
        userReputation: 89,
        amount: 55000,
        timeline: '3 weeks',
        proposalText: 'Expert in high-contrast dark interfaces. I will provide a full design system and interactive prototypes.',
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
    ]
  }
];

export const mockSubmissions: TaskSubmission[] = [
  {
    id: 'sub_1',
    taskId: 't1',
    userId: 'user_99',
    userName: 'JungleNode',
    status: 'pending',
    proofText: 'Audit complete. Identified a potential double-spend vulnerability in the off-chain channel closing logic on page 14.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub_2',
    taskId: 't2',
    userId: 'user_102',
    userName: 'CipherPunk',
    status: 'pending',
    proofText: 'The multisig logic fails when one of the signatories has a zero balance. See attached snippet for the fix.',
    createdAt: new Date().toISOString(),
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user_1',
    title: 'Mission Yield Finalized',
    description: 'Your contribution to "L2 Bridge Implementation" has been verified. 12,000 SAT added to your liquid balance.',
    type: 'reward',
    status: 'unread',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    link: '/wallet'
  },
  {
    id: 'n2',
    userId: 'user_1',
    title: 'New Bid Propagated',
    description: 'PixelPioneer has submitted a proposal for "High-Fidelity Wallet UI Redesign".',
    type: 'bid',
    status: 'unread',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    link: '/my-projects/p3'
  },
  {
    id: 'n3',
    userId: 'user_1',
    title: 'Network Audit Required',
    description: 'A critical proof submission for "Validate Multi-sig Escrow Logic" requires peer validation.',
    type: 'audit',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    link: '/audits'
  },
  {
    id: 'n4',
    userId: 'user_1',
    title: 'Protocol Upgrade Imminent',
    description: 'L2 Settlement protocols will undergo high-intensity maintenance at 04:00 UTC.',
    type: 'system',
    status: 'unread',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
  }
];
