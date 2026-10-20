import type {
  Profile,
  Account,
  Category,
  Transaction,
  SavingsGoal,
  Debt,
  WishlistItem,
  RecurringItem,
} from '../types';
import { getMonthKey, uid } from '../lib/utils';

const today = new Date();
const monthKey = getMonthKey(today);

export const defaultCategories: Category[] = [
  // Needs
  { id: 'cat-rent', name: 'Rent', group: 'Needs', icon: 'Home', color: '#0B3D2E', monthlyLimit: 25000, isDefault: true },
  { id: 'cat-food', name: 'Food & Groceries', group: 'Needs', icon: 'ShoppingCart', color: '#1E8E3E', monthlyLimit: 15000, isDefault: true },
  { id: 'cat-transport', name: 'Transport', group: 'Needs', icon: 'Bus', color: '#2E7D32', monthlyLimit: 8000, isDefault: true },
  { id: 'cat-airtime', name: 'Airtime & Data', group: 'Needs', icon: 'Smartphone', color: '#388E3C', monthlyLimit: 2000, isDefault: true },
  { id: 'cat-utilities', name: 'Utilities', group: 'Needs', icon: 'Zap', color: '#43A047', monthlyLimit: 5000, isDefault: true },
  // Wants
  { id: 'cat-entertainment', name: 'Entertainment', group: 'Wants', icon: 'Film', color: '#D4A017', monthlyLimit: 3000, isDefault: true },
  { id: 'cat-eating', name: 'Eating Out', group: 'Wants', icon: 'Utensils', color: '#E6B422', monthlyLimit: 4000, isDefault: true },
  { id: 'cat-shopping', name: 'Shopping', group: 'Wants', icon: 'ShoppingBag', color: '#C9A227', monthlyLimit: 5000, isDefault: true },
  // Savings
  { id: 'cat-emergency', name: 'Emergency Fund', group: 'Savings', icon: 'Shield', color: '#0B3D2E', monthlyLimit: 10000, isDefault: true },
  { id: 'cat-goals', name: 'Savings Goals', group: 'Savings', icon: 'Target', color: '#1B5E20', monthlyLimit: 5000, isDefault: true },
  // Debt
  { id: 'cat-debt', name: 'Debt Payments', group: 'Debt', icon: 'CreditCard', color: '#C0392B', monthlyLimit: 8000, isDefault: true },
];

export const defaultAccounts: Account[] = [
  { id: 'acc-cash', name: 'Cash', balance: 5200, color: '#0B3D2E' },
  { id: 'acc-mpesa', name: 'MPesa', balance: 18450, color: '#1E8E3E' },
  { id: 'acc-bank', name: 'Bank', balance: 45600, color: '#1565C0' },
  { id: 'acc-savings', name: 'Savings', balance: 32000, color: '#D4A017' },
];

export const sampleProfile: Profile = {
  id: 'user-1',
  name: 'Stephen',
  email: 'stephen@gawa.app',
  currency: 'KES',
  monthStartDay: 1,
  monthlyIncome: 85000,
  budgetPercents: { needs: 50, wants: 30, savings: 15, debt: 5 },
  onboardingComplete: false,
  darkMode: false,
  budgetRollover: true,
  emergencyFundMonths: 3,
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const sampleTransactions: Transaction[] = [
  { id: uid(), type: 'income', amount: 85000, categoryId: 'cat-goals', accountId: 'acc-bank', date: daysAgo(12), note: 'October salary', createdAt: daysAgo(12) },
  { id: uid(), type: 'expense', amount: 25000, categoryId: 'cat-rent', accountId: 'acc-bank', date: daysAgo(10), note: 'October rent', createdAt: daysAgo(10) },
  { id: uid(), type: 'expense', amount: 4200, categoryId: 'cat-food', accountId: 'acc-mpesa', date: daysAgo(8), note: 'Naivas groceries', createdAt: daysAgo(8) },
  { id: uid(), type: 'expense', amount: 1500, categoryId: 'cat-transport', accountId: 'acc-mpesa', date: daysAgo(7), note: 'Uber & matatu', createdAt: daysAgo(7) },
  { id: uid(), type: 'expense', amount: 800, categoryId: 'cat-airtime', accountId: 'acc-mpesa', date: daysAgo(6), note: 'Safaricom data', createdAt: daysAgo(6) },
  { id: uid(), type: 'expense', amount: 2800, categoryId: 'cat-utilities', accountId: 'acc-mpesa', date: daysAgo(5), note: 'KPLC + water', createdAt: daysAgo(5) },
  { id: uid(), type: 'expense', amount: 1200, categoryId: 'cat-eating', accountId: 'acc-cash', date: daysAgo(4), note: 'Lunch with team', createdAt: daysAgo(4) },
  { id: uid(), type: 'expense', amount: 3500, categoryId: 'cat-shopping', accountId: 'acc-mpesa', date: daysAgo(3), note: 'New shoes', createdAt: daysAgo(3) },
  { id: uid(), type: 'expense', amount: 5000, categoryId: 'cat-debt', accountId: 'acc-bank', date: daysAgo(2), note: 'Loan repayment', createdAt: daysAgo(2) },
  { id: uid(), type: 'expense', amount: 2000, categoryId: 'cat-emergency', accountId: 'acc-savings', date: daysAgo(1), note: 'Emergency top-up', createdAt: daysAgo(1) },
  { id: uid(), type: 'income', amount: 3500, categoryId: 'cat-goals', accountId: 'acc-mpesa', date: daysAgo(1), note: 'Freelance side hustle', createdAt: daysAgo(1) },
];

export const sampleSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal-emergency',
    name: 'Emergency Fund',
    targetAmount: 150000,
    currentAmount: 42000,
    deadline: daysFromNow(180),
    color: '#0B3D2E',
    isEmergency: true,
    createdAt: daysAgo(60),
  },
  {
    id: 'goal-laptop',
    name: 'New Laptop',
    targetAmount: 120000,
    currentAmount: 28000,
    deadline: daysFromNow(120),
    color: '#D4A017',
    isEmergency: false,
    createdAt: daysAgo(30),
  },
  {
    id: 'goal-holiday',
    name: 'Mombasa Trip',
    targetAmount: 45000,
    currentAmount: 12000,
    deadline: daysFromNow(90),
    color: '#1E8E3E',
    isEmergency: false,
    createdAt: daysAgo(20),
  },
];

export const sampleDebts: Debt[] = [
  {
    id: 'debt-1',
    name: 'Personal Loan',
    lender: 'Equity Bank',
    totalAmount: 150000,
    balance: 98000,
    interestRate: 13.5,
    minPayment: 6500,
    dueDate: '5',
    createdAt: daysAgo(90),
  },
  {
    id: 'debt-2',
    name: 'Phone Credit',
    lender: 'M-Kopa',
    totalAmount: 35000,
    balance: 12500,
    interestRate: 0,
    minPayment: 2500,
    dueDate: '15',
    createdAt: daysAgo(45),
  },
];

export const sampleWishlist: WishlistItem[] = [
  {
    id: 'wish-1',
    name: 'Samsung Galaxy A55',
    estimatedCost: 48000,
    amountSaved: 8000,
    priority: 'High',
    targetDate: daysFromNow(150),
    category: 'Electronics',
    notes: 'Need better camera for side hustle',
    status: 'Saving',
    createdAt: daysAgo(25),
  },
  {
    id: 'wish-2',
    name: 'Office Chair',
    estimatedCost: 15000,
    amountSaved: 0,
    priority: 'Medium',
    targetDate: daysFromNow(60),
    category: 'Home',
    notes: 'Back support for long work days',
    status: 'Planned',
    createdAt: daysAgo(10),
  },
];

export const sampleRecurring: RecurringItem[] = [
  {
    id: 'rec-1',
    name: 'Rent',
    type: 'expense',
    amount: 25000,
    categoryId: 'cat-rent',
    accountId: 'acc-bank',
    frequency: 'monthly',
    nextDueDate: daysFromNow(5),
    isActive: true,
  },
  {
    id: 'rec-2',
    name: 'Internet (Zuku)',
    type: 'expense',
    amount: 3500,
    categoryId: 'cat-utilities',
    accountId: 'acc-mpesa',
    frequency: 'monthly',
    nextDueDate: daysFromNow(12),
    isActive: true,
  },
  {
    id: 'rec-3',
    name: 'Salary',
    type: 'income',
    amount: 85000,
    categoryId: 'cat-goals',
    accountId: 'acc-bank',
    frequency: 'monthly',
    nextDueDate: daysFromNow(18),
    isActive: true,
  },
];

export { monthKey };
