import {
  mockFamilyMembers,
  mockGoals,
  mockShieldRules,
  mockTransactions,
  type Card,
  type FamilyMember,
  type Goal,
  type ShieldRule,
  type Transaction,
} from '../stores/appStore';

const cards: Card[] = [
  { id: 'card-1', name: 'Everyday card', cardType: 'debit', lastFour: '4821', brand: 'Visa', balance: 2840.5, currency: 'EUR', color: '#3b82f6', isActive: true },
  { id: 'card-2', name: 'Family savings', cardType: 'debit', lastFour: '7314', brand: 'Mastercard', balance: 6120, currency: 'EUR', color: '#10b981', isActive: true },
];

function readMembers(): FamilyMember[] {
  try {
    const stored = localStorage.getItem('nataconnect_members');
    return stored ? JSON.parse(stored) : mockFamilyMembers;
  } catch {
    return mockFamilyMembers;
  }
}

export const piAPI = {
  async getStatus() {
    return { online: true, mode: 'local-demo' };
  },
  async getMembers() {
    return readMembers();
  },
  async verifyPin(memberId: string, pin: string) {
    const member = readMembers().find(item => item.id === memberId);
    return { success: Boolean(member && (!member.pin || member.pin === pin)) };
  },
  async getCards(_memberId: string): Promise<Card[]> {
    return cards;
  },
  async getGoals(_memberId: string): Promise<Goal[]> {
    return mockGoals;
  },
  async getShieldRules(_memberId: string): Promise<ShieldRule[]> {
    return mockShieldRules;
  },
  async getTransactions(_memberId: string): Promise<Transaction[]> {
    return mockTransactions;
  },
};
