import React, { useState } from "react";
import { Calendar, DollarSign } from "lucide-react";

export default function ExpenseForm({ onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Health & Fitness",
    "Other",
  ];

  const quickAmounts = [5, 10, 20, 50, 100];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const expense = { amount, description, merchant, category, date };
    onSubmit?.(expense);

    // reset
    setAmount("");
    setDescription("");
    setCategory("Food & Dining");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded-lg"
    >
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5" />
        Add New Expense
      </h2>

      {/* Amount */}
      <label className="block text-sm font-medium">Amount *</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        className="w-full p-2 border rounded-md mb-4"
        required
      />

      {/* Description */}
      <label className="block text-sm font-medium">Description *</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What did you spend on?"
        className="w-full p-2 border rounded-md mb-4"
        required
      />

      {/* Category */}
      <label className="block text-sm font-medium">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Date */}
      <label className="block text-sm font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Date
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Expense
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>
      </div>

      {/* Quick Amounts */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt)}
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
