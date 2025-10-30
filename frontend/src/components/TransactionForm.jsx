import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTransaction,
  updateTransaction,
  fetchTransactions,
} from "../redux/transactionSlice";
import toast from "react-hot-toast";

export default function TransactionForm({ editingTransaction, setEditingTransaction }) {
  const [form, setForm] = useState({
    type: "select",
    amount: "",
    category: "",
    description: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        description: editingTransaction.description || "",
        id: editingTransaction._id,
      });
    }
  }, [editingTransaction]);

  const validateForm = () => {
    if (!form.amount || form.amount <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!form.category.trim()) {
      toast.error("Please enter a category");
      return false;
    }
    if (form.type === "select") {
      toast.error("Please select a transaction type");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (form.id) {
        // Edit mode
        await dispatch(updateTransaction(form)).unwrap();
        toast.success("Transaction updated successfully 🎉");
      } else {
        // Add new
        await dispatch(addTransaction({ ...form, date: new Date() })).unwrap();
        toast.success("Transaction added successfully 🎉");
      }
      await dispatch(fetchTransactions());
      setForm({ type: "expense", amount: "", category: "", description: "", id: null });
      setEditingTransaction(null);
    } catch {
      toast.error("Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ type: "expense", amount: "", category: "", description: "", id: null });
    setEditingTransaction(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        {form.id ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-4">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="select">Select type</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 col-span-2"
        />

        <div className="col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white py-3 rounded-lg font-medium transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
            } flex-1`}
          >
            {loading ? (form.id ? "Updating..." : "Adding...") : form.id ? "Update Transaction" : "+ Add Transaction"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition flex-1"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
