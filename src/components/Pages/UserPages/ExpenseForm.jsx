import React, { useEffect, useState } from "react";
import { Calendar, DollarSign } from "lucide-react";

// Form for creating an expense
export default function ExpenseForm({
  categories = [],
  defaultCategoryId,
  onSubmit,
  onCancel,
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );

  // When categories load, preselect defaultCategoryId (e.g., 26 for Utilities) or first item
  useEffect(() => {
    if (!categories.length) return;
    if (!categoryId) {
      const def =
        categories.find((c) => String(c.id) === String(defaultCategoryId)) ||
        categories[0];
      if (def) {
        setCategoryId(def.id);
        setCategoryName(def.name || "");
      }
    } else {
      const found = categories.find((c) => String(c.id) === String(categoryId));
      if (found && found.name !== categoryName) {
        setCategoryName(found.name || "");
      }
    }
  }, [categories, defaultCategoryId, categoryId, categoryName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    if (!categoryId) return;

    const expense = {
      amount,
      description,
      categoryId,
      category: categoryName, // send name as well if caller wants to display immediately
      date,
    };
    onSubmit?.(expense);

    // reset
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white"
    >
      {/* Amount */}
      <label className="block text-sm font-medium flex items-center gap-2">
        <DollarSign className="w-4 h-4" /> Amount
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-md p-2"
        required
      />

      {/* Description */}
      <label className="block text-sm font-medium">Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded-md p-2"
        placeholder="e.g., Health check Oct"
        required
      />

      {/* Category */}
      <label className="block text-sm font-medium">Category</label>
      <select
        value={categoryId}
        onChange={(e) => {
          const id = Number(e.target.value);
          setCategoryId(id);
          const found = categories.find((c) => c.id === id);
          setCategoryName(found?.name || "");
        }}
        className="w-full border rounded-md p-2"
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
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
        className="w-full border rounded-md p-2"
        required
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 border rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
