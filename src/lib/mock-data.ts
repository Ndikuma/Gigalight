
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
  },
  {
    id: 't3',
    creatorId: 'user_2',
    title: 'UI Protocol Audit (Next.js)',
    rewardAmount: 2500,
    difficulty: 'medium',
    shortDescription: 'Audit the frontend architecture of the Lightning node dashboard.',
    instructions: 'Review components for hydration mismatches and accessibility standards. Submit report.',
    proofMethod: 'text',
    category: 'Design',
    status: 'active',
    submissionsCount: 15,
    validatorGuidelines: 'Ensure all hydration issues are correctly identified.'
  },
  {
    id: 't4',
    creatorId: 'user_3',
    title: 'Satoshi-Network Node Config',
    rewardAmount: 5000,
    difficulty: 'easy',
    shortDescription: 'Verify and optimize the peer-to-peer configuration of network nodes.',
    instructions: 'Provide a screenshot of your node status page showing healthy peer connections.',
    proofMethod: 'image',
    category: 'Engineering',
    status: 'active',
    submissionsCount: 124,
    validatorGuidelines: 'Check for minimum of 5 peer connections.'
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
    requirements: '• Rust/LND expertise required\n• Experience with non-custodial wallet architecture\n• Proven track record in Satoshi-denominated settlement systems',
    skills: ['Rust', 'LND', 'Distributed Systems', 'Cryptography'],
    status: 'open',
    clientName: 'Satoshi Core Labs',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    milestones: [
      { id: 'm1', title: 'Technical Architecture Review', description: 'Complete system design audit and channel strategy.', amount: 50000, status: 'pending' },
      { id: 'm2', title: 'Alpha Integration', description: 'Core multi-sig contract deployment on testnet.', amount: 100000, status: 'pending' }
    ],
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
  },
  {
    id: 'p2',
    creatorId: 'user_4',
    title: 'DEX Liquidity Optimization Node',
    budgetMin: 50000,
    budgetMax: 120000,
    budgetType: 'hourly',
    experienceLevel: 'intermediate',
    description: 'Development of an automated liquidity rebalancing node for an L2-based decentralized exchange.',
    requirements: '• Experience with automated trading bots\n• Knowledge of L2 liquidity protocols\n• Python/TypeScript expertise',
    skills: ['Python', 'L2 Protocols', 'Automation'],
    status: 'open',
    clientName: 'Liquid-X Protocol',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    bids: []
  },
  {
    id: 'p3',
    creatorId: 'user_5',
    title: 'Cross-Chain Bridge Security Audit',
    budgetMin: 300000,
    budgetMax: 800000,
    budgetType: 'fixed',
    experienceLevel: 'expert',
    description: 'Comprehensive security audit for a high-volume cross-chain bridge between Bitcoin L2s.',
    requirements: '• Deep security audit experience\n• Understanding of bridge protocols\n• Formal verification experience',
    skills: ['Security', 'Auditing', 'Solidity', 'Rust'],
    status: 'open',
    clientName: 'BridgeGuard',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    bids: []
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
