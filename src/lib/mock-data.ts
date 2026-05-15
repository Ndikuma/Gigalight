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
    title: 'Download & Review Gigalight App',
    rewardAmount: 500,
    difficulty: 'easy',
    shortDescription: 'Download our new mobile app from the testnet link and leave a thoughtful review.',
    proofMethod: 'screenshot',
    category: 'Marketing',
    status: 'active',
  },
  {
    id: 't2',
    title: 'Verify Smart Contract Integrity',
    rewardAmount: 5000,
    difficulty: 'hard',
    shortDescription: 'Audit the provided Solidity contract for vulnerabilities specifically related to reentrancy.',
    proofMethod: 'code_snippet',
    category: 'Security',
    status: 'active',
  },
  {
    id: 't3',
    title: 'Translate UX Microcopy to French',
    rewardAmount: 1200,
    difficulty: 'medium',
    shortDescription: 'Localize 200 strings of dashboard text for our French users. Ensure consistent tone.',
    proofMethod: 'text',
    category: 'Translation',
    status: 'active',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
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
  },
  {
    id: 'p2',
    title: 'Bitcoin L2 Integration Specialist',
    budgetMin: 5000,
    budgetMax: 8000,
    budgetType: 'hourly',
    experienceLevel: 'expert',
    description: 'Help us integrate Lightning Network payments into our existing e-commerce site using LND.',
    skills: ['Lightning Network', 'LND', 'Rust'],
    status: 'open',
    clientName: 'SatsPay',
    createdAt: new Date().toISOString(),
  },
];

export const mockSubmissions: TaskSubmission[] = [
  {
    id: 'sub_1',
    taskId: 't1',
    userId: 'user_99',
    status: 'pending',
    proofText: 'Done! Review submitted as "CryptoEnthusiast" on the mobile store.',
    createdAt: new Date().toISOString(),
  }
];
