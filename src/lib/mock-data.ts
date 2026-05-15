
import { Profile, Wallet, Task, Project, TaskSubmission, Notification } from './types';

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
    shortDescription: 'Meticulously review the technical specification for the Satoshi-Bridge protocol.',
    instructions: '1. Access the whitepaper at the external link. 2. Verify Section 4.2 logic regarding channel closure. 3. Submit a brief text summary identifying any logical gaps.',
    proofMethod: 'text',
    category: 'Security',
    status: 'active',
    submissionsCount: 8,
    validatorGuidelines: 'Ensure the response identifies the missing edge case in the multi-sig release delay.',
    externalUrl: 'https://example.com/whitepaper',
    externalUrlLabel: 'Access Whitepaper'
  },
  {
    id: 't2',
    creatorId: 'user_1',
    title: 'Validate Multi-sig Escrow Logic',
    rewardAmount: 7500,
    difficulty: 'hard',
    shortDescription: 'Formal verification of the L2 multisig contract logic.',
    instructions: 'Examine the provided code snippet for re-entrancy vulnerabilities during partial SAT release. Provide a fixed version or proof of safety.',
    proofMethod: 'code_snippet',
    category: 'Engineering',
    status: 'active',
    submissionsCount: 2,
    validatorGuidelines: 'Check for standard re-entrancy guards and LND specific timeout handling.'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    creatorId: 'user_1',
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
        membershipTier: 'elite',
        amount: 380000,
        signalFee: 500,
        isBoosted: true,
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
        membershipTier: 'pro',
        amount: 320000,
        signalFee: 200,
        isBoosted: false,
        timeline: '4 weeks',
        proposalText: 'Fast implementation focus. We use a proprietary SDK for rapid channel balancing that can reduce integration time by 30%.',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
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
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/wallet'
  }
];
