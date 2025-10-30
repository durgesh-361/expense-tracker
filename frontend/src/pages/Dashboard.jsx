import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "../redux/transactionSlice";
import TransactionForm from "../components/TransactionForm";
import SummaryChart from "../components/SummaryChart";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.transactions);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
        Swal.fire("Deleted!", "Transaction has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete transaction. Try again.", "error");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          💰 Expense Tracker Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track your income & expenses effortlessly
        </p>
      </header>

      {/* Top Row: Form + Chart */}
      <section className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full">
        <TransactionForm
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
        <SummaryChart />
      </section>

      {/* Transactions List */}
      <section className="mt-8 w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6 w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">All Transactions</h2>

          {status === "loading" ? (
            <p className="text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-right">Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr
                      key={t._id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">{t.category}</td>
                      <td className="py-3 px-4">{t.description || "-"}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            t.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {t.amount}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 text-xs">
                        {formatDate(t.date)}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2 hover:bg-blue-100 rounded-full transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-2 hover:bg-red-100 rounded-full transition"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
