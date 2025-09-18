import React, { useMemo, useState } from "react";
import { Home, History, BadgePlus, TrendingUp, Wallet, CreditCard } from "lucide-react";
import { Banner, Footer } from "../../Reusable/Banner";
import ExpenseForm from "./ExpenseForm";
import ExpenseHistory from "./ExpenseHistory";

// Currency helper
const currency = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })
    .format(Number.isFinite(n) ? n : 0);

export default function UserDashboard() {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" | "history"

  // ✅ Keep expenses in state so both Dashboard and History see updates
  const [expenses, setExpenses] = useState([
    // Example:
    // {
    //   id: 1,
    //   amount: 18.5,
    //   description: "Grab bike",
    //   merchant: "Grab",
    //   category: "Transportation",
    //   date: "2025-09-15",
    //   // also store these two for your "Recent Expenses" list rendering:
    //   categoryName: "Transportation",
    //   expense_date: "2025-09-15",
    // },
  ]);

  // ---- Derived stats
  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );
  const avgTransaction = useMemo(
    () => (expenses.length ? totalSpent / expenses.length : 0),
    [expenses, totalSpent]
  );

  const topCategory = useMemo(() => {
    const byCategory = expenses.reduce((m, e) => {
      const key = e.categoryName ?? e.category ?? "Unknown";
      m[key] = (m[key] || 0) + Number(e.amount || 0);
      return m;
    }, {});
    const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return topEntry
      ? {
        name: topEntry[0],
        pct: Math.round((topEntry[1] / (totalSpent || 1)) * 100),
      }
      : { name: "N/A", pct: 0 };
  }, [expenses, totalSpent]);

  // ---- Handlers
  const handleAddExpense = () => setShowExpenseForm(true);

  const handleFormSubmit = (expenseData) => {
    // Normalize so BOTH components work:
    //  - ExpenseHistory uses: {id, amount, description, merchant, category, date}
    //  - Your Recent list uses: categoryName, expense_date
    const normalized = {
      id: Date.now(),
      amount: Number(expenseData.amount),
      description: expenseData.description,
      merchant: expenseData.merchant || "",
      category: expenseData.category,
      date: expenseData.date, // ISO string "YYYY-MM-DD"
      categoryName: expenseData.category,
      expense_date: expenseData.date,
    };
    setExpenses((prev) => [normalized, ...prev]);
    setShowExpenseForm(false);
  };

  const handleFormCancel = () => setShowExpenseForm(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />

      {/* ===== Header at the very top ===== */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">AI Expense</div>
              <div className="-mt-0.5 text-xs text-gray-500">
                Smart Financial Tracking
              </div>
            </div>

            {/* Total chip */}
            <div className="ml-4 hidden md:flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-gray-700">
              <TrendingUp className="h-4 w-4" />
              <span>Total:</span>
              <span className="font-semibold">{currency(totalSpent)}</span>
            </div>
          </div>

          <button
            onClick={handleAddExpense}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
          >
            <BadgePlus className="h-5 w-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* ===== Single tabs row (only one) ===== */}
      <div className="mx-auto w-full max-w-7xl px-4 mt-4 overflow-x-auto">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {[
            { key: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4 mr-1" /> },
            { key: "history", label: "History", icon: <History className="w-4 h-4 mr-1" /> },
          ].map((tab) => {
            const active = currentView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition
            ${active ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Content by tab ===== */}
      {currentView === "dashboard" ? (
        <>
          {/* Stat cards */}
          <div className="mx-auto w-full max-w-7xl px-4 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Spent */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Total Spent</div>
                <Wallet className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 text-3xl font-bold">{currency(totalSpent)}</div>
              <div className="mt-1 text-sm text-gray-400">All time</div>
            </div>

            {/* Avg Transaction */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Avg Transaction</div>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 text-3xl font-bold">{currency(avgTransaction)}</div>
              <div className="mt-1 text-sm text-gray-400">Per transaction</div>
            </div>

            {/* Top Category */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Top Category</div>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 text-xl font-semibold">{topCategory.name}</div>
              <div className="mt-1 text-sm text-gray-400">
                {topCategory.pct}% of spending
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="mx-auto w-full max-w-7xl px-4 mt-6 mb-10">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  Recent Expenses
                </div>
              </div>

              {expenses.length === 0 ? (
                <div className="mt-8 flex items-center justify-center rounded-xl border border-dashed py-10 text-gray-400">
                  No expenses yet
                </div>
              ) : (
                <ul className="mt-4 divide-y">
                  {expenses.slice(0, 5).map((e) => (
                    <li key={e.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {e.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(e.categoryName ?? e.category ?? "Category")} • {e.expense_date ?? e.date}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {currency(Number(e.amount || 0))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        // History tab
        <div className="mx-auto w-full max-w-7xl px-4 pt-4">
          <ExpenseHistory
            expenses={
              // Ensure History receives the shape it expects
              expenses.map((e) => ({
                id: e.id,
                amount: e.amount,
                description: e.description,
                merchant: e.merchant,
                category: e.category ?? e.categoryName,
                date: e.date ?? e.expense_date,
              }))
            }
          />
        </div>
      )}

      {/* ===== Modal: Add Expense ===== */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <ExpenseForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
