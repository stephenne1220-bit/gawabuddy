import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Profile,
  Account,
  Category,
  Transaction,
  SavingsGoal,
  Debt,
  DebtPayment,
  WishlistItem,
  RecurringItem,
  SavingsTransaction,
  Currency,
  BudgetPercents,
  AuthUser,
} from '../types';
import {
  sampleProfile,
  defaultAccounts,
  defaultCategories,
  sampleTransactions,
  sampleSavingsGoals,
  sampleDebts,
  sampleWishlist,
  sampleRecurring,
} from '../data/sample';
import { uid, getMonthKey } from '../lib/utils';

/** Simple local hash — fine for personal device; use Supabase for real security */
function hashPassword(password: string): string {
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  }
  return `gawa_${Math.abs(h).toString(16)}_${password.length}`;
}

/** Apply fixed % split to an income amount → category monthly limits */
function limitsFromIncome(
  categories: Category[],
  income: number,
  percents: BudgetPercents
): Category[] {
  const groupPool: Record<string, number> = {
    Needs: income * (percents.needs / 100),
    Wants: income * (percents.wants / 100),
    Savings: income * (percents.savings / 100),
    Debt: income * (percents.debt / 100),
  };
  const counts: Record<string, number> = { Needs: 0, Wants: 0, Savings: 0, Debt: 0 };
  categories.forEach((c) => {
    counts[c.group] = (counts[c.group] || 0) + 1;
  });
  return categories.map((c) => {
    const n = counts[c.group] || 1;
    const limit = Math.round((groupPool[c.group] || 0) / n);
    return { ...c, monthlyLimit: limit };
  });
}

const defaultPercents: BudgetPercents = { needs: 50, wants: 30, savings: 15, debt: 5 };

interface AppState {
  profile: Profile;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  savingsTransactions: SavingsTransaction[];
  debts: Debt[];
  debtPayments: DebtPayment[];
  wishlist: WishlistItem[];
  recurring: RecurringItem[];
  selectedMonth: string;
  showOnboarding: boolean;
  fabOpen: boolean;
  authUser: AuthUser | null;
  isAuthenticated: boolean;

  updateProfile: (partial: Partial<Profile>) => void;
  completeOnboarding: (income: number, template: boolean) => void;
  setCurrency: (c: Currency) => void;
  toggleDarkMode: () => void;
  setSelectedMonth: (m: string) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, partial: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateCategoryLimit: (id: string, limit: number) => void;
  apply503020: () => void;
  setBudgetPercents: (p: BudgetPercents) => void;
  recalculateBudgetsFromHistory: (monthKey?: string) => void;
  getMonthIncome: (monthKey?: string) => number;
  addSavingsGoal: (g: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount'>) => void;
  updateSavingsGoal: (id: string, partial: Partial<SavingsGoal>) => void;
  addSavingsTransaction: (st: Omit<SavingsTransaction, 'id'>) => void;
  addDebt: (d: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: string, partial: Partial<Debt>) => void;
  addDebtPayment: (p: Omit<DebtPayment, 'id'>) => void;
  addWishlistItem: (w: Omit<WishlistItem, 'id' | 'createdAt' | 'amountSaved' | 'status'>) => void;
  updateWishlistItem: (id: string, partial: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  moveWishlistToSavings: (id: string) => void;
  addRecurring: (r: Omit<RecurringItem, 'id'>) => void;
  markRecurringPaid: (id: string) => void;
  setFabOpen: (open: boolean) => void;
  setShowOnboarding: (v: boolean) => void;
  register: (email: string, password: string, name: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  resetData: () => void;
}

const initialState = {
  profile: {
    ...sampleProfile,
    budgetPercents: sampleProfile.budgetPercents || defaultPercents,
  },
  accounts: defaultAccounts,
  categories: defaultCategories,
  transactions: sampleTransactions,
  savingsGoals: sampleSavingsGoals,
  savingsTransactions: [] as SavingsTransaction[],
  debts: sampleDebts,
  debtPayments: [] as DebtPayment[],
  wishlist: sampleWishlist,
  recurring: sampleRecurring,
  selectedMonth: getMonthKey(),
  showOnboarding: !sampleProfile.onboardingComplete,
  fabOpen: false,
  authUser: null as AuthUser | null,
  isAuthenticated: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateProfile: (partial) =>
        set((s) => ({ profile: { ...s.profile, ...partial } })),

      completeOnboarding: (income, applyTemplate) => {
        const percents = applyTemplate
          ? defaultPercents
          : get().profile.budgetPercents || defaultPercents;
        const today = new Date().toISOString().slice(0, 10);
        // Wipe demo data — only keep the income you typed (e.g. 5000)
        const starterIncome: Transaction = {
          id: uid(),
          type: 'income',
          amount: income,
          categoryId: 'cat-goals',
          accountId: 'acc-bank',
          date: today,
          note: 'Starting income',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          profile: {
            ...s.profile,
            monthlyIncome: income,
            budgetPercents: percents,
            onboardingComplete: true,
          },
          showOnboarding: false,
          transactions: [starterIncome],
          categories: limitsFromIncome(s.categories, income, percents),
        }));
      },

      setCurrency: (c) =>
        set((s) => ({ profile: { ...s.profile, currency: c } })),

      toggleDarkMode: () =>
        set((s) => {
          const next = !s.profile.darkMode;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next);
          }
          return { profile: { ...s.profile, darkMode: next } };
        }),

      setSelectedMonth: (m) => {
        set({ selectedMonth: m });
        get().recalculateBudgetsFromHistory(m);
      },

      getMonthIncome: (monthKey) => {
        const key = monthKey || get().selectedMonth;
        return get()
          .transactions.filter((t) => t.type === 'income' && t.date.startsWith(key))
          .reduce((sum, t) => sum + t.amount, 0);
      },

      recalculateBudgetsFromHistory: (monthKey) => {
        const key = monthKey || get().selectedMonth;
        const percents = get().profile.budgetPercents || defaultPercents;
        let income = get().getMonthIncome(key);
        if (income <= 0) income = get().profile.monthlyIncome || 0;
        set((s) => ({
          categories: limitsFromIncome(s.categories, income, percents),
        }));
      },

      setBudgetPercents: (p) => {
        // Always save so the Settings inputs can change
        set((s) => ({ profile: { ...s.profile, budgetPercents: p } }));
        const total = p.needs + p.wants + p.savings + p.debt;
        // Only rebuild category limits when the split is valid
        if (total === 100) {
          get().recalculateBudgetsFromHistory();
        }
      },

      addTransaction: (t) => {
        set((s) => ({
          transactions: [
            {
              ...t,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        }));
        if (t.type === 'income') {
          const month = t.date.slice(0, 7);
          get().recalculateBudgetsFromHistory(month);
          const monthIncome = get().getMonthIncome(month);
          if (month === get().selectedMonth) {
            set((s) => ({
              profile: { ...s.profile, monthlyIncome: monthIncome },
            }));
          }
        }
      },

      updateTransaction: (id, partial) => {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...partial } : t
          ),
        }));
        get().recalculateBudgetsFromHistory();
      },

      deleteTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        }));
        get().recalculateBudgetsFromHistory();
      },

      updateCategoryLimit: (id, limit) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, monthlyLimit: limit } : c
          ),
        })),

      apply503020: () => {
        get().setBudgetPercents(defaultPercents);
      },

      register: (email, password, name) => {
        const normalized = email.trim().toLowerCase();
        if (!normalized || !password || password.length < 4) {
          return { ok: false, error: 'Email and password (min 4 chars) required' };
        }
        const existing = localStorage.getItem('gawa-auth-users');
        const users: AuthUser[] = existing ? JSON.parse(existing) : [];
        if (users.some((u) => u.email === normalized)) {
          return { ok: false, error: 'Account already exists — please log in' };
        }
        const user: AuthUser = {
          email: normalized,
          passwordHash: hashPassword(password),
          name: name.trim() || normalized.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem('gawa-auth-users', JSON.stringify(users));
        set((s) => ({
          authUser: user,
          isAuthenticated: true,
          profile: { ...s.profile, email: user.email, name: user.name },
        }));
        return { ok: true };
      },

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const existing = localStorage.getItem('gawa-auth-users');
        const users: AuthUser[] = existing ? JSON.parse(existing) : [];
        const user = users.find((u) => u.email === normalized);
        if (!user || user.passwordHash !== hashPassword(password)) {
          return { ok: false, error: 'Invalid email or password' };
        }
        set((s) => ({
          authUser: user,
          isAuthenticated: true,
          profile: {
            ...s.profile,
            email: user.email,
            name: user.name || s.profile.name,
          },
        }));
        return { ok: true };
      },

      logout: () => set({ isAuthenticated: false, authUser: null }),

      addSavingsGoal: (g) =>
        set((s) => ({
          savingsGoals: [
            ...s.savingsGoals,
            {
              ...g,
              id: uid(),
              currentAmount: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSavingsGoal: (id, partial) =>
        set((s) => ({
          savingsGoals: s.savingsGoals.map((g) =>
            g.id === id ? { ...g, ...partial } : g
          ),
        })),

      addSavingsTransaction: (st) =>
        set((s) => {
          const goals = s.savingsGoals.map((g) => {
            if (g.id !== st.goalId) return g;
            const delta = st.type === 'deposit' ? st.amount : -st.amount;
            return {
              ...g,
              currentAmount: Math.max(0, g.currentAmount + delta),
            };
          });
          return {
            savingsGoals: goals,
            savingsTransactions: [{ ...st, id: uid() }, ...s.savingsTransactions],
          };
        }),

      addDebt: (d) =>
        set((s) => ({
          debts: [
            ...s.debts,
            { ...d, id: uid(), createdAt: new Date().toISOString() },
          ],
        })),

      updateDebt: (id, partial) =>
        set((s) => ({
          debts: s.debts.map((d) => (d.id === id ? { ...d, ...partial } : d)),
        })),

      addDebtPayment: (p) =>
        set((s) => {
          const debts = s.debts.map((d) => {
            if (d.id !== p.debtId) return d;
            return { ...d, balance: Math.max(0, d.balance - p.amount) };
          });
          return {
            debts,
            debtPayments: [{ ...p, id: uid() }, ...s.debtPayments],
            transactions: [
              {
                id: uid(),
                type: 'expense' as const,
                amount: p.amount,
                categoryId: 'cat-debt',
                accountId: 'acc-bank',
                date: p.date,
                note: p.note || 'Debt payment',
                createdAt: new Date().toISOString(),
              },
              ...s.transactions,
            ],
          };
        }),

      addWishlistItem: (w) =>
        set((s) => ({
          wishlist: [
            ...s.wishlist,
            {
              ...w,
              id: uid(),
              amountSaved: 0,
              status: 'Planned' as const,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateWishlistItem: (id, partial) =>
        set((s) => ({
          wishlist: s.wishlist.map((w) =>
            w.id === id ? { ...w, ...partial } : w
          ),
        })),

      deleteWishlistItem: (id) =>
        set((s) => ({
          wishlist: s.wishlist.filter((w) => w.id !== id),
        })),

      moveWishlistToSavings: (id) => {
        const item = get().wishlist.find((w) => w.id === id);
        if (!item) return;
        get().addSavingsGoal({
          name: item.name,
          targetAmount: item.estimatedCost,
          deadline: item.targetDate,
          color: '#D4A017',
          isEmergency: false,
        });
        get().updateWishlistItem(id, { status: 'Saving' });
      },

      addRecurring: (r) =>
        set((s) => ({
          recurring: [...s.recurring, { ...r, id: uid() }],
        })),

      markRecurringPaid: (id) => {
        const item = get().recurring.find((r) => r.id === id);
        if (!item) return;
        get().addTransaction({
          type: item.type,
          amount: item.amount,
          categoryId: item.categoryId,
          accountId: item.accountId,
          date: new Date().toISOString().slice(0, 10),
          note: `${item.name} (recurring)`,
          recurring: item.frequency,
        });
        const next = new Date(item.nextDueDate);
        if (item.frequency === 'weekly') next.setDate(next.getDate() + 7);
        else if (item.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
        else next.setFullYear(next.getFullYear() + 1);
        set((s) => ({
          recurring: s.recurring.map((r) =>
            r.id === id
              ? { ...r, nextDueDate: next.toISOString().slice(0, 10) }
              : r
          ),
        }));
      },

      setFabOpen: (open) => set({ fabOpen: open }),
      setShowOnboarding: (v) => set({ showOnboarding: v }),

      resetData: () => {
        localStorage.removeItem('gawa-storage');
        set({
          ...initialState,
          showOnboarding: true,
          isAuthenticated: false,
          authUser: null,
        });
      },
    }),
    {
      name: 'gawa-storage',
      partialize: (s) => ({
        profile: s.profile,
        accounts: s.accounts,
        categories: s.categories,
        transactions: s.transactions,
        savingsGoals: s.savingsGoals,
        savingsTransactions: s.savingsTransactions,
        debts: s.debts,
        debtPayments: s.debtPayments,
        wishlist: s.wishlist,
        recurring: s.recurring,
        authUser: s.authUser,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

export function useMonthTransactions() {
  const transactions = useStore((s) => s.transactions);
  const selectedMonth = useStore((s) => s.selectedMonth);
  return transactions.filter((t) => t.date.startsWith(selectedMonth));
}

export function useMonthStats() {
  const txs = useMonthTransactions();
  const income = txs
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const spent = txs
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  return {
    income,
    spent,
    remaining: income - spent,
    netSavings: income - spent,
  };
}
