import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Search, Filter, Edit } from "lucide-react";

const currency = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

const fmtDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid Date";
    }
};

// Helper function for date range filtering
function inRange(dateStr, period) {
    if (period === "All Time") return true;
    
    const d = new Date(dateStr);
    const now = new Date();
    const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const addDays = (x, n) => new Date(x.getFullYear(), x.getMonth(), x.getDate() + n);

    if (period === "Today") return startOfDay(d).getTime() === startOfDay(now).getTime();
    if (period === "This Week") {
        const day = now.getDay();
        const weekStart = addDays(startOfDay(now), -day);
        const weekEnd = addDays(weekStart, 7);
        return d >= weekStart && d < weekEnd;
    }
    if (period === "This Month") {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (period === "Last 30 Days") {
        const thirty = addDays(startOfDay(now), -30);
        return d >= thirty && d <= now;
    }
    if (period === "This Year") {
        return d.getFullYear() === now.getFullYear();
    }
    return true;
}

export default function ExpenseHistory({ expenses, categories = [], onEditExpense, onPageChange, paginationData, loading }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [period, setPeriod] = useState("All Time");
    const [sortBy, setSortBy] = useState("Date (Newest)");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Transform backend categories to include "All" option
    const categoryOptions = useMemo(() => {
        if (!categories || categories.length === 0) {
            return ["All", "Transportation", "Food & Dining", "Shopping", "Entertainment", "Bills & Utilities", "Health & Fitness", "Other"];
        }
        
        const categoryNames = categories.map(cat => cat.name);
        return ["All", ...categoryNames];
    }, [categories]);

    // CLIENT-SIDE FILTERING: Filter and sort expenses locally
    const filteredAndSortedExpenses = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        console.log("🔄 Applying client-side filters...");
        
        // Filter expenses based on search query, category, and period
        let filtered = expenses.filter((e) => {
            const matchesQuery = !query || 
                e.description?.toLowerCase().includes(query.toLowerCase()) ||
                e.category?.toLowerCase().includes(query.toLowerCase());
            
            const matchesCategory = category === "All" || e.category === category;
            const matchesPeriod = inRange(e.expenseDate || e.date, period);
            
            return matchesQuery && matchesCategory && matchesPeriod;
        });

        // Sort expenses
        switch (sortBy) {
            case "Date (Newest)":
                filtered.sort((a, b) => new Date(b.expenseDate || b.date) - new Date(a.expenseDate || a.date));
                break;
            case "Date (Oldest)":
                filtered.sort((a, b) => new Date(a.expenseDate || a.date) - new Date(b.expenseDate || b.date));
                break;
            case "Amount (High-Low)":
                filtered.sort((a, b) => b.amount - a.amount);
                break;
            case "Amount (Low-High)":
                filtered.sort((a, b) => a.amount - b.amount);
                break;
            default:
                break;
        }

        console.log(`✅ Filtered to ${filtered.length} expenses`);
        return filtered;
    }, [expenses, query, category, period, sortBy]);

    // Paginate the filtered results
    const paginatedExpenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedExpenses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedExpenses, currentPage, itemsPerPage]);

    // Calculate total pages for client-side pagination
    const totalPages = useMemo(() => {
        return Math.ceil(filteredAndSortedExpenses.length / itemsPerPage);
    }, [filteredAndSortedExpenses.length, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, category, period, sortBy]);

    // Load initial data when component mounts
    useEffect(() => {
        if (onPageChange && expenses.length === 0) {
            console.log("🔄 Loading initial expense data...");
            onPageChange({
                page: 0, // Backend uses 0-based
                size: 50, // Load more items initially for client-side filtering
                sort: "expenseDate,desc",
            });
        }
    }, [onPageChange, expenses.length]);

    const handleEditClick = (expense) => {
        console.log("📝 Editing expense:", expense);
        if (onEditExpense) {
            onEditExpense(expense);
        }
    };

    const handlePageChange = (page) => {
        console.log(`📄 Changing to page ${page}`);
        setCurrentPage(page);
    };

    // Calculate total from current page data
    const total = useMemo(() => {
        return paginatedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    }, [paginatedExpenses]);

    // Calculate total for all filtered expenses
    const totalFiltered = useMemo(() => {
        return filteredAndSortedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    }, [filteredAndSortedExpenses]);

    // Show loading state
    if (loading && expenses.length === 0) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2">Expense History</h2>
                <p className="text-gray-500 mb-4">View and manage your transactions</p>
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading expenses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Expense History</h2>
            <p className="text-gray-500 mb-4">View and manage your transactions</p>

            {/* Filters */}
            <div className="p-4 border rounded-lg bg-gray-50 mb-6 w-full">
                <div className="mb-3 flex items-center gap-2 text-gray-700 font-medium">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {categories.length === 0 && <span className="text-sm text-yellow-500">Loading categories...</span>}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search expenses..."
                            className="w-full border rounded-md p-2 text-sm"
                        />
                    </div>

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded-md p-2 text-sm"
                    >
                        {categoryOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Time Period */}
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border rounded-md p-2 text-sm"
                    >
                        {["All Time", "Today", "This Week", "This Month", "Last 30 Days", "This Year"].map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-md p-2 text-sm"
                    >
                        {["Date (Newest)", "Date (Oldest)", "Amount (High-Low)", "Amount (Low-High)"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* Total */}
                    <div className="ml-auto font-medium">
                        Page Total: {currency(total)}
                        {filteredAndSortedExpenses.length !== expenses.length && (
                            <div className="text-xs text-gray-500">
                                Filtered: {currency(totalFiltered)} ({filteredAndSortedExpenses.length} items)
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="mt-4">
                {paginatedExpenses.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <div className="text-5xl mb-2">🔍</div>
                        <p className="font-medium">No expenses found</p>
                        <p className="text-sm">
                            {filteredAndSortedExpenses.length === 0 && expenses.length > 0 
                                ? "Try changing your filters" 
                                : "Start by adding your first expense"
                            }
                        </p>
                        
                        {/* Debug Info */}
                        <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-left max-w-md mx-auto">
                            <p><strong>Debug Info:</strong></p>
                            <p>All Expenses: {expenses.length}</p>
                            <p>Filtered Expenses: {filteredAndSortedExpenses.length}</p>
                            <p>Current Page: {currentPage}</p>
                            <p>Total Pages: {totalPages}</p>
                            <p>Query: "{query}"</p>
                            <p>Category: "{category}"</p>
                            <p>Period: "{period}"</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ul className="divide-y">
                            {paginatedExpenses.map((e) => (
                                <li 
                                    key={e.id} 
                                    className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer group"
                                    onClick={() => handleEditClick(e)}
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{e.description}</div>
                                        <div className="text-sm text-gray-600">{e.category}</div>
                                        <div className="text-xs text-gray-400">
                                            {fmtDate(e.expenseDate || e.expense_date || e.date)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-blue-600">{currency(e.amount)}</div>
                                        <Edit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination - ONLY show if more than 1 page */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                                currentPage === page 
                                                    ? 'bg-blue-600 text-white border-blue-600' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50"
                                >
                                    Next
                                </button>

                                <span className="text-sm text-gray-500 ml-2">
                                    Page {currentPage} of {totalPages} 
                                    {` (${filteredAndSortedExpenses.length} total items)`}
                                </span>
                            </div>
                        )}

                        {/* Show message when only 1 page exists */}
                        {totalPages === 1 && filteredAndSortedExpenses.length > 0 && (
                            <div className="text-center text-gray-500 mt-4 text-sm">
                                Showing all {filteredAndSortedExpenses.length} expenses
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}