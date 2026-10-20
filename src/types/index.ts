export type Currency = 'KES' | 'USD' | 'EUR' | 'GBP' | 'UGX' | 'TZS';

export type AccountType = 'Cash' | 'MPesa' | 'Bank' | 'Savings';

export type CategoryGroup = 'Needs' | 'Wants' | 'Savings' | 'Debt';

export type TransactionType = 'income' | 'expense';

export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export type WishlistPriority = 'High' | 'Medium' | 'Low';

export type WishlistStatus = 'Planned' | 'Saving' | 'Bought';

/** Set once — applied to whatever income you actually log that month */
export interface BudgetPercents {
  needs: number;   // e.g. 50
  wants: number;   // e.g. 30
  savings: number; // e.g. 15
  debt: number;    // e.g. 5
  // should sum to 100
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  currency: Currency;
  monthStartDay: number;
  /** Expected / last known income — NOT the source of truth for budgets */
  monthlyIncome: number;
  /** Fixed split — does not change when income is 200 or 10,000 */
  budgetPercents: BudgetPercents;
  onboardingComplete: boolean;
  darkMode: boolean;
  budgetRollover: boolean;
  emergencyFundMonths: number; // 3-6
}

export interface AuthUser {
  email: string;
  /** Simple local hash — replace with Supabase for real security */
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface Account {
  id: string;
  name: AccountType;
  balance: number;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  group: CategoryGroup;
  icon: string;
  color: string;
  monthlyLimit: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string; // ISO
  note: string;
  recurring?: RecurringFrequency | null;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string; // YYYY-MM
  limit: number;
  spent: number;
}

export interface RecurringItem {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: RecurringFrequency;
  nextDueDate: string;
  isActive: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  isEmergency: boolean;
  createdAt: string;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  note: string;
}

export interface Debt {
  id: string;
  name: string;
  lender: string;
  totalAmount: number;
  balance: number;
  interestRate: number;
  minPayment: number;
  dueDate: string; // day of month or ISO
  createdAt: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  note: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  estimatedCost: number;
  amountSaved: number;
  priority: WishlistPriority;
  targetDate: string;
  category: string;
  notes: string;
  link?: string;
  status: WishlistStatus;
  createdAt: string;
}

export type QuickAddType =
  | 'expense'
  | 'income'
  | 'bill'
  | 'debt'
  | 'savings'
  | 'future';
