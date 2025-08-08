import type { UserProfile } from '../lib/auth/types';

/**
 * Authorized investor allowlist
 * 
 * Add investor emails here to grant access to the pitch deck.
 * Tiers:
 * - partner: Full access, decision makers
 * - associate: Full access, evaluators
 * - analyst: Full access, researchers
 * - demo: Limited access for demos
 */
export const investors: Record<string, UserProfile> = {
  // Example investors - replace with real ones
  'demo@camber.ai': {
    email: 'demo@camber.ai',
    name: 'Demo User',
    firm: 'Camber',
    tier: 'demo',
    metadata: {
      addedDate: '2025-01-08',
      notes: 'Internal demo account'
    }
  },
  
  // Sequoia Capital
  'john.doe@sequoiacap.com': {
    email: 'john.doe@sequoiacap.com',
    name: 'John Doe',
    firm: 'Sequoia Capital',
    tier: 'partner',
    metadata: {
      addedDate: '2025-01-08',
      focus: 'B2B SaaS, Supply Chain'
    }
  },

  // Andreessen Horowitz
  'jane.smith@a16z.com': {
    email: 'jane.smith@a16z.com',
    name: 'Jane Smith',
    firm: 'Andreessen Horowitz',
    tier: 'partner',
    metadata: {
      addedDate: '2025-01-08',
      focus: 'AI, Enterprise Software'
    }
  },

  // Accel
  'alex.johnson@accel.com': {
    email: 'alex.johnson@accel.com',
    name: 'Alex Johnson',
    firm: 'Accel',
    tier: 'associate',
    metadata: {
      addedDate: '2025-01-08',
      focus: 'Marketplace, B2B'
    }
  },

  // First Round Capital
  'sarah.chen@firstround.com': {
    email: 'sarah.chen@firstround.com',
    name: 'Sarah Chen',
    firm: 'First Round Capital',
    tier: 'partner',
    metadata: {
      addedDate: '2025-01-08',
      focus: 'Seed, Early Stage'
    }
  },

  // Add more investors as needed...
};

/**
 * Get investor profile by email
 */
export function getInvestor(email: string): UserProfile | undefined {
  return investors[email.toLowerCase().trim()];
}

/**
 * Check if email is authorized
 */
export function isInvestorAuthorized(email: string): boolean {
  return !!getInvestor(email);
}

/**
 * Get all investor emails (for admin purposes)
 */
export function getAllInvestorEmails(): string[] {
  return Object.keys(investors);
}

/**
 * Get investors by firm
 */
export function getInvestorsByFirm(firm: string): UserProfile[] {
  return Object.values(investors).filter(
    investor => investor.firm?.toLowerCase() === firm.toLowerCase()
  );
}

/**
 * Get investors by tier
 */
export function getInvestorsByTier(tier: UserProfile['tier']): UserProfile[] {
  return Object.values(investors).filter(
    investor => investor.tier === tier
  );
}