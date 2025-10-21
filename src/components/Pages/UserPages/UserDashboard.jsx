import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  History,
  BadgePlus,
  TrendingUp,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import {
  fetchDashboard,
  createExpense,
  updateExpense,
  fetchCategories,
  fetchExpensesPagination, // ADD THIS IMPORT
} from "../../../Redux/API/API";

import { Banner, Footer } from "../../Reusable/Banner";
import ExpenseForm from "./ExpenseForm";
import ExpenseHistory from "./ExpenseHistory";
import { toast } from "sonner";

// Currency helper
const currency = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(n) ? n : 0);

export default function UserDashboard() {
  const dispatch = useDispatch();

  // UI state
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Data state
  const [expenses, setExpenses] = useState([]);
  const [serverTotals, setServerTotals] = useState(null);
  const [serverTop, setServerTop] = useState(null);
  const [categories, setCategories] = useState([]);

  // ADD PAGINATION STATE
  const [paginationData, setPaginationData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const now = new Date();
  const end = now.toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const start = startDate.toISOString().split("T")[0];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserId(parsed.id);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  // Load categories once
  useEffect(() => {
    dispatch(fetchCategories()).then((res) => {
      if (res.type.endsWith("/fulfilled")) {
        setCategories(Array.isArray(res.payload) ? res.payload : []);
      }
    });
  }, [dispatch]);

  // Load dashboard data
  useEffect(() => {
    if (!userId) {
      console.log("⏳ Waiting for userId... current userId:", userId);
      return;
    }
    dispatch(
      fetchDashboard({
        userId,
        start: start,
        end: end,
        topLimit: 5,
        recentLimit: 10,
      })
    ).then((result) => {
      if (result.type.endsWith("/rejected")) {
        console.error("❌ Dashboard request rejected:", result.payload);
        return;
      }
      console.log("✅ Dashboard request successful:", result.payload);
      const data = result.payload || {};
      setServerTotals(data.totals || null);
      setServerTop((data.top_categories && data.top_categories[0]) || null);

      const normalized = (data.recent_expenses || []).map((e) => ({
        id: e.id,
        amount: Number(e.amount || 0),
        description: e.description,
        category: e.category,
        categoryId: e.categoryId,
        date: e.expenseDate,
        categoryName: e.category,
        expense_date: e.expenseDate,
      }));
      setExpenses(normalized);
    });
  }, [dispatch, userId]);
  useEffect(() => {
    if (currentView === "history" && !paginationData) {
      console.log("🔄 Switching to history tab, loading initial data...");
      handlePageChange({
        page: 0,
        size: 50, // Load more items for client-side filtering
        sort: "expenseDate,desc",
      });
    }
  }, [currentView]);
  const handlePageChange = async (filters) => {
    if (!userId) {
      toast.error("Missing user id");
      return;
    }

    console.log("🔍 Page change filters:", filters);
    setHistoryLoading(true);

    try {
      const requestParams = {
        page: filters.page,
        size: filters.size,
        sort: filters.sort,
        userId: userId,
      };

      console.log("🔄 Sending request with params:", requestParams);

      const result = await dispatch(fetchExpensesPagination(requestParams));

      if (result.type.endsWith("/fulfilled")) {
        const data = result.payload || {};
        console.log("✅ Pagination response:", data);

        const normalized = (data.content || []).map((e) => ({
          id: e.id,
          amount: Number(e.amount || 0),
          description: e.description,
          category: e.category,
          categoryId: e.categoryId,
          date: e.expenseDate,
          categoryName: e.category,
          expense_date: e.expenseDate,
        }));

        setExpenses(normalized);
        setPaginationData({
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          currentPage: data.pageable?.pageNumber + 1 || 1,
          size: data.size,
          first: data.first,
          last: data.last,
        });
      } else {
        console.error("❌ Pagination request rejected:", result.payload);
        toast.error("Failed to load expenses");
      }
    } catch (error) {
      console.error("❌ Error loading paginated expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setHistoryLoading(false); // MAKE SURE THIS IS CALLED
    }
  };

  // Handle edit expense from ExpenseHistory
  const handleEditExpense = (expense) => {
    console.log("📝 Starting edit for expense:", expense);
    console.log("📝 Expense category:", expense.category);
    console.log("📝 Available categories:", categories);

    // Find the category in categories list
    const matchedCategory = categories.find(
      (cat) => cat.name?.toLowerCase() === expense.category?.toLowerCase()
    );
    console.log("📝 Matched category:", matchedCategory);

    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  // Handle both create and update expense
  const handleSaveExpense = async (form) => {
    if (!userId) {
      toast.error("Missing user id");
      return;
    }
    if (!form?.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setSaving(true);

    const isEditing = !!form.id;

    try {
      let res;

      if (isEditing) {
        // Update existing expense
        const payload = {
          expenseId: form.id,
          userId: userId,
          categoryId: form.categoryId,
          amount: Number(form.amount),
          description: form.description,
          expenseDate: form.date,
        };

        console.log("🔄 Updating expense with payload:", payload);
        res = await dispatch(updateExpense(payload));
      } else {
        // Create new expense
        const payload = {
          userId,
          categoryId: form.categoryId,
          amount: Number(form.amount),
          description: form.description,
          expenseDate: form.date,
        };

        console.log("🔄 Creating expense with payload:", payload);
        res = await dispatch(createExpense(payload));
      }

      if (res.type.endsWith("/rejected")) {
        toast.error(
          res.payload?.message ||
            `Failed to ${isEditing ? "update" : "create"} expense`
        );
        setSaving(false);
        return;
      }

      toast.success(
        isEditing
          ? "Expense updated successfully"
          : "Expense added successfully"
      );
      handleCloseModal();

      // Refresh dashboard data
      await refreshDashboardData();

      // If we're on history view, refresh the paginated data too
      if (currentView === "history" && paginationData) {
        await handlePageChange({
          page: paginationData.currentPage,
          size: paginationData.size || 10,
          sort: "expenseDate,desc",
          query: "",
          category: "All",
          period: "All Time",
        });
      }
    } catch (error) {
      console.error("❌ Error saving expense:", error);
      toast.error("Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  // Refresh dashboard data
  const refreshDashboardData = async () => {
    dispatch(
      fetchDashboard({
        start: start,
        end: end,
        topLimit: 5,
        recentLimit: 10,
      })
    ).then((r) => {
      if (r.type.endsWith("/fulfilled")) {
        const data = r.payload || {};
        const normalized = (data.recent_expenses || []).map((e) => ({
          id: e.id,
          amount: Number(e.amount || 0),
          description: e.description,
          merchant: "",
          category: e.category,
          date: e.expenseDate,
          categoryName: e.category,
          expense_date: e.expenseDate,
        }));
        setExpenses(normalized);
        setServerTotals(data.totals || null);
        setServerTop((data.top_categories && data.top_categories[0]) || null);
      }
    });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  // Handle add new expense button
  const handleAddNewExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const totalSpent = useMemo(() => {
    if (serverTotals?.total_expenses != null)
      return serverTotals.total_expenses;
    return expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [serverTotals, expenses]);

  const avgTransaction = useMemo(() => {
    if (serverTotals?.average_expense != null)
      return serverTotals.average_expense;
    return expenses.length ? totalSpent / expenses.length : 0;
  }, [serverTotals, totalSpent, expenses]);

  const topCategory = useMemo(() => {
    if (serverTop)
      return {
        name: serverTop.name,
        pct: Math.round(serverTop.pctOfTotal ?? 0),
      };
    const byCategory = expenses.reduce((m, e) => {
      const key = e.categoryName ?? e.category ?? "";
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
  }, [serverTop, expenses, totalSpent]);

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
            onClick={handleAddNewExpense}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
          >
            <BadgePlus className="h-5 w-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* ===== Single tabs row ===== */}
      <div className="mx-auto w-full max-w-7xl px-4 mt-4 overflow-x-auto">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              icon: <Home className="w-4 h-4 mr-1" />,
            },
            {
              key: "history",
              label: "History",
              icon: <History className="w-4 h-4 mr-1" />,
            },
          ].map((tab) => {
            const active = currentView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition
                ${
                  active
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
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
              <div className="mt-3 text-3xl font-bold">
                {currency(totalSpent)}
              </div>
              <div className="mt-1 text-sm text-gray-400">All time</div>
            </div>

            {/* Avg Transaction */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Avg Transaction</div>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 text-3xl font-bold">
                {currency(avgTransaction)}
              </div>
              <div className="mt-1 text-sm text-gray-400">Per transaction</div>
            </div>

            {/* Top Category */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Top Category</div>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 text-xl font-semibold">
                {topCategory.name}
              </div>
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
                    <li
                      key={e.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {e.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {e.categoryName ?? e.category ?? "Category"} •{" "}
                          {e.expense_date ?? e.date}
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
            expenses={expenses}
            categories={categories}
            onEditExpense={handleEditExpense}
            onPageChange={handlePageChange}
            paginationData={paginationData}
            loading={historyLoading}
          />
        </div>
      )}

      {/* ===== Modal: Add/Edit Expense ===== */}
      {showExpenseForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-form-title"
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
              <h3 id="expense-form-title" className="text-lg font-semibold">
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {/* body */}
            <div className="p-6">
              <ExpenseForm
                categories={categories}
                defaultCategoryId={26}
                onSubmit={handleSaveExpense}
                onCancel={handleCloseModal}
                editingExpense={editingExpense}
              />
              {saving && (
                <div className="mt-3 text-sm text-gray-500">Saving…</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close modal with ESC */}
      {showExpenseForm && <EscCloser onClose={handleCloseModal} />}

      <Footer />
    </div>
  );
}

// tiny helper to close on Escape
function EscCloser({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return null;
}
