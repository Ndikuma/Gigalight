import { Profile, Wallet, Task, Project, TaskSubmission } from './types';

export const mockProfile: Profile = {
  id: 'user_1',
  fullName: 'Alex Lightning',
  isValidator: true,
  activeRole: 'standard',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Decentralized systems architect and Bitcoin enthusiast. Building the future of L2 micro-economies.',
  skills: ['React', 'TypeScript', 'Node.js', 'Solidity', 'Bitcoin L2'],
  location: 'San Salvador, SV',
  reputation: 92,
  stats: {
    tasksCompleted: 45,
    projectsHired: 3,
    totalEarned: 125000,
    totalSpent: 85000,
  }
};

export const mockWallet: Wallet = {
  availableBalance: 45000,
  pendingBalance: 1250,
  totalRewarded: 125000,
};

export const mockTasks: Task[] = [
  {
    id: 't1',
    creatorId: 'user_admin',
    title: 'Download & Review Gigalight App',
    rewardAmount: 500,
    difficulty: 'easy',
    shortDescription: 'Download our new mobile app from the testnet link and leave a thoughtful review.',
    proofMethod: 'screenshot',
    category: 'Marketing',
    status: 'active',
    submissionsCount: 12,
  },
  {
    id: 't2',
    creatorId: 'user_1', // Owned by current user
    title: 'Verify Smart Contract Integrity',
    rewardAmount: 5000,
    difficulty: 'hard',
    shortDescription: 'Audit the provided Solidity contract for vulnerabilities specifically related to reentrancy.',
    proofMethod: 'code_snippet',
    category: 'Security',
    status: 'active',
    submissionsCount: 3,
  },
  {
    id: 't3',
    creatorId: 'user_admin',
    title: 'Translate UX Microcopy to French',
    rewardAmount: 1200,
    difficulty: 'medium',
    shortDescription: 'Localize 200 strings of dashboard text for our French users. Ensure consistent tone.',
    proofMethod: 'text',
    category: 'Translation',
    status: 'active',
    submissionsCount: 8,
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    creatorId: 'user_1', // User is hiring for this
    title: 'Next.js SaaS Boilerplate Development',
    budgetMin: 50000,
    budgetMax: 150000,
    budgetType: 'fixed',
    experienceLevel: 'expert',
    description: 'We need a high-performance SaaS template with auth, payments, and dashboard built on Next.js 15.',
    skills: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    status: 'open',
    clientName: 'Future Labs',
    createdAt: new Date().toISOString(),
    bids: [
      {
        id: 'bid_1',
        userId: 'user_99',
        userName: 'Satoshi Nakamoto',
        userReputation: 99,
        amount: 120000,
        timeline: '3 weeks',
        proposalText: 'I have built over 20 SaaS apps with Next.js. I can deliver a pixel-perfect boilerplate with modular components.',
        createdAt: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: 'bid_2',
        userId: 'user_101',
        userName: 'Hal Finney',
        userReputation: 95,
        amount: 80000,
        timeline: '2 weeks',
        proposalText: 'Fast delivery, clean code. Check my portfolio for similar projects.',
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
    ]
  },
  {
    id: 'p2',
    creatorId: 'user_admin',
    title: 'Bitcoin L2 Integration Specialist',
    budgetMin: 5000,
    budgetMax: 8000,
    budgetType: 'hourly',
    experienceLevel: 'expert',
    description: 'Help us integrate Lightning Network payments into our existing e-commerce site using LND.',
    skills: ['Lightning Network', 'LND', 'Rust'],
    status: 'in_progress', // User is working on this
    clientName: 'SatsPay',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    creatorId: 'user_admin',
    title: 'UI Design for Wallet Interface',
    budgetMin: 12000,
    budgetMax: 18000,
    budgetType: 'fixed',
    experienceLevel: 'intermediate',
    description: 'Looking for a designer to create a dark-themed wallet UI with custom icons.',
    skills: ['Figma', 'UI Design', 'Icons'],
    status: 'open',
    clientName: 'Zebedee Inc',
    createdAt: new Date().toISOString(),
  }
];

export const mockSubmissions: TaskSubmission[] = [
  {
    id: 'sub_1',
    taskId: 't1',
    userId: 'user_99',
    userName: 'JungleNode',
    status: 'pending',
    proofText: 'Done! Review submitted as "CryptoEnthusiast" on the mobile store.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub_2',
    taskId: 't2',
    userId: 'user_102',
    userName: 'CipherPunk',
    status: 'pending',
    proofText: 'Found a potential issue in line 42 with the reentrancy guard order.',
    createdAt: new Date().toISOString(),
  }
];
