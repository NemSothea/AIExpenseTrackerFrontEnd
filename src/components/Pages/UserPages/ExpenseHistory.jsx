import React, { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";

const currency = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

const fmtDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });

function inRange(dateStr, period) {
    const d = new Date(dateStr);
    const now = new Date();
    const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const addDays = (x, n) => new Date(x.getFullYear(), x.getMonth(), x.getDate() + n);

    if (period === "All Time") return true;
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

export default function ExpenseHistory({ expenses }) {
    const categories = [
        "All",
        "Transportation",
        "Food & Dining",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Health & Fitness",
        "Other",
    ];

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [period, setPeriod] = useState("All Time");
    const [sortBy, setSortBy] = useState("Date (Newest)");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = expenses.filter((e) => {
            const matchesQ =
                !q ||
                e.description?.toLowerCase().includes(q) ||
                e.merchant?.toLowerCase().includes(q) ||
                e.category?.toLowerCase().includes(q);
            const matchesCat = category === "All" || e.category === category;
            const matchesPeriod = inRange(e.date, period);
            return matchesQ && matchesCat && matchesPeriod;
        });

        switch (sortBy) {
            case "Date (Newest)":
                list.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "Date (Oldest)":
                list.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "Amount (High-Low)":
                list.sort((a, b) => b.amount - a.amount);
                break;
            case "Amount (Low-High)":
                list.sort((a, b) => a.amount - b.amount);
                break;
            default:
                break;
        }

        return list;
    }, [expenses, query, category, period, sortBy]);

    const total = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Expense History</h2>
            <p className="text-gray-500 mb-4">View and manage your transactions</p>

            {/* Filters */}
            <div className="p-4 border rounded-lg bg-gray-50 mb-6 w-full">
                {/* Header row: icon + text */}
                <div className="mb-3 flex items-center gap-2 text-gray-700 font-medium">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </div>

                {/* Controls row */}
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
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>

                    {/* Time Period */}
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border rounded-md p-2 text-sm"
                    >
                        {["All Time", "Today", "This Week", "This Month", "Last 30 Days", "This Year"].map((p) => (
                            <option key={p}>{p}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-md p-2 text-sm"
                    >
                        {["Date (Newest)", "Date (Oldest)", "Amount (High-Low)", "Amount (Low-High)"].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>

                    {/* Total */}
                    <div className="ml-auto font-medium">Total: {currency(total)}</div>
                </div>
            </div>



            {/* Transactions */}
            <div>
                {filtered.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <div className="text-5xl mb-2">🔍</div>
                        <p className="font-medium">No expenses found</p>
                        <p className="text-sm">Start by adding your first expense</p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {filtered.map((e) => (
                            <li key={e.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{e.description}</div>
                                    <div className="text-sm text-gray-600">
                                        {e.category} • {e.merchant || "Unknown"}
                                    </div>
                                    <div className="text-xs text-gray-400">{fmtDate(e.date)}</div>
                                </div>
                                <div className="font-semibold text-blue-600">{currency(e.amount)}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
