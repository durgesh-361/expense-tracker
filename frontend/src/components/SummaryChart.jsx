import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

export default function SummaryChart() {
  const data = useSelector((state) => state.transactions.items);

  const income = data.filter(d => d.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = data.filter(d => d.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expense</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-xl font-bold text-green-600">₹{income.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="text-xl font-bold text-red-600">₹{expense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
