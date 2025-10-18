import React, { useEffect, useState } from "react";
import { Calendar, DollarSign } from "lucide-react";

// Form for creating/editing an expense
export default function ExpenseForm({
  categories = [],
  defaultCategoryId,
  onSubmit,
  onCancel,
  editingExpense = null,
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Predefined amount options
  const amountOptions = [5, 10, 20, 50, 100];

  // Helper function to find category ID by name
  const findCategoryIdByName = (categoryName) => {
    if (!categoryName || !categories.length) return null;

    // Exact match first
    let foundCategory = categories.find(
      (cat) => cat.name?.toLowerCase() === categoryName?.toLowerCase()
    );

    // If not found, try partial match
    if (!foundCategory) {
      foundCategory = categories.find(
        (cat) =>
          cat.name?.toLowerCase().includes(categoryName?.toLowerCase()) ||
          categoryName?.toLowerCase().includes(cat.name?.toLowerCase())
      );
    }

    return foundCategory?.id || null;
  };

  // When editingExpense changes or categories load, populate form
  useEffect(() => {
    console.log("🔍 ExpenseForm - editingExpense:", editingExpense);
    console.log("🔍 ExpenseForm - categories:", categories);

    if (editingExpense) {
      // Populate form with existing expense data
      setAmount(editingExpense.amount.toString());
      setDescription(editingExpense.description);
      setDate(editingExpense.expenseDate || editingExpense.date);

      // Find category ID by name from the expense data
      const expenseCategoryName = editingExpense.category;
      const foundCategoryId = findCategoryIdByName(expenseCategoryName);

      console.log("🔍 Mapping category:", {
        expenseCategory: expenseCategoryName,
        foundCategoryId: foundCategoryId,
        availableCategories: categories.map((c) => ({
          id: c.id,
          name: c.name,
        })),
      });

      if (foundCategoryId) {
        setCategoryId(foundCategoryId);
        // Also set the category name from the categories list
        const foundCategory = categories.find((c) => c.id === foundCategoryId);
        setCategoryName(foundCategory?.name || expenseCategoryName);
      } else if (categories.length > 0) {
        // Fallback to default category
        const defaultCategory =
          categories.find((c) => c.id === defaultCategoryId) || categories[0];
        setCategoryId(defaultCategory.id);
        setCategoryName(defaultCategory.name);
        console.warn("⚠️ Category not found, using fallback:", defaultCategory);
      }
    } else if (categories.length > 0) {
      // Default behavior for new expense - only set if not already set
      const def =
        categories.find((c) => String(c.id) === String(defaultCategoryId)) ||
        categories[0];
      if (def && !categoryId) {
        setCategoryId(def.id);
        setCategoryName(def.name || "");
      }
    }
  }, [editingExpense, categories, defaultCategoryId]); // Removed categoryId from dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    if (!categoryId) {
      console.error("❌ No category selected");
      return;
    }

    const expense = {
      id: editingExpense?.id,
      amount,
      description,
      categoryId,
      category: categoryName,
      date,
    };

    console.log("📤 Submitting expense:", expense);
    onSubmit?.(expense);

    // Only reset if not in edit mode
    if (!editingExpense) {
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      // Reset category to default for new expenses
      if (categories.length > 0) {
        const def =
          categories.find((c) => String(c.id) === String(defaultCategoryId)) ||
          categories[0];
        setCategoryId(def.id);
        setCategoryName(def.name || "");
      }
    }
  };

  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    setCategoryId(id);
    const found = categories.find((c) => c.id === id);
    const newCategoryName = found?.name || "";
    setCategoryName(newCategoryName);
    console.log("🔄 Category changed to:", { id, name: newCategoryName });
  };

  // Handle quick amount selection
  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const isEditing = !!editingExpense;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white"
    >
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4" /> Amount
        </label>

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {amountOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAmountSelect(option)}
              className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
                amount === option.toString()
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <DollarSign className="w-3 h-3" />
              {option}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-md p-2"
          placeholder="Or enter custom amount"
          required
        />
      </div>

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
        onChange={handleCategoryChange}
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

      {/* Debug info for editing */}
      {isEditing && (
        <div className="text-sm text-gray-500 bg-yellow-50 p-2 rounded">
          <div>Original Expense Category: "{editingExpense.category}"</div>
          <div>Mapped to Category ID: {categoryId}</div>
          <div>Current Selection: {categoryName}</div>
        </div>
      )}

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
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
