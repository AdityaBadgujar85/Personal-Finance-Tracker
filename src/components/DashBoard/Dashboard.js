import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const SAMPLE_TRANSACTIONS = [
  { id: 1, date: "2025-08-09", amount: 1200, category: "Salary", note: "August salary" },
  { id: 2, date: "2025-08-09", amount: -50, category: "Food", note: "Lunch" },
  { id: 3, date: "2025-08-08", amount: -20, category: "Transport", note: "Taxi" },
  { id: 4, date: "2025-07-25", amount: -200, category: "Rent", note: "July Rent" },
  { id: 5, date: "2025-07-17", amount: -40, category: "Food", note: "Groceries" },
  { id: 6, date: "2025-06-02", amount: -300, category: "Shopping", note: "Clothes" },
  { id: 7, date: "2025-06-10", amount: 800, category: "Freelance", note: "Project payment" },
  { id: 8, date: "2025-08-01", amount: -120, category: "Utilities", note: "Electricity" },
  { id: 9, date: "2025-08-03", amount: -30, category: "Entertainment", note: "Movie" },
  { id: 10, date: "2025-08-09", amount: -15, category: "Food", note: "Snacks" },
];

function formatCurrency(v) {
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  return `${sign}₹${abs.toLocaleString()}`;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    if (!fromDate && !toDate) return transactions;
    const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
    const to = toDate ? new Date(toDate) : new Date("3000-01-01");
    to.setHours(23, 59, 59, 999);
    return transactions.filter((t) => {
      const d = new Date(t.date + "T00:00:00");
      return d >= from && d <= to;
    });
  }, [transactions, fromDate, toDate]);

  const { totalIncome, totalExpenses, remainingBudget, savings } = useMemo(() => {
    const income = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const budget = 50000;
    const rem = Math.max(0, budget - expenses);
    const save = Math.max(0, income - expenses);
    return { totalIncome: income, totalExpenses: expenses, remainingBudget: rem, savings: save };
  }, [filtered]);

  const monthlyTrend = useMemo(() => {
    const map = new Map();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = m.toLocaleString("default", { month: "short", year: "numeric" });
      map.set(key, 0);
    }
    filtered.forEach((t) => {
      const d = new Date(t.date + "T00:00:00");
      const key = d.toLocaleString("default", { month: "short", year: "numeric" });
      if (!map.has(key)) map.set(key, 0);
      if (t.amount < 0) map.set(key, map.get(key) + Math.abs(t.amount));
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const categorySplit = useMemo(() => {
    const byCat = {};
    filtered.forEach((t) => {
      const c = t.category || "Uncategorized";
      if (!byCat[c]) byCat[c] = 0;
      if (t.amount < 0) byCat[c] += Math.abs(t.amount);
    });
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const todaysDate = useMemo(() => {
    if (fromDate && toDate && fromDate === toDate) return fromDate;
    if (!fromDate && toDate) return toDate;
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, [fromDate, toDate]);

  const todaysExpenses = useMemo(() => {
    return filtered.filter((t) => t.date === todaysDate && t.amount < 0);
  }, [filtered, todaysDate]);

  function addDemoExpense() {
    const nextId = transactions.length + 1;
    const now = new Date().toISOString().slice(0, 10);
    const demo = { id: nextId, date: now, amount: -Math.floor(Math.random() * 500), category: "Misc", note: "Demo" };
    setTransactions((s) => [demo, ...s]);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col p-8">
      <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm">From:</label>
          <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="p-2 rounded-md border" />
          <label className="text-sm">To:</label>
          <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="p-2 rounded-md border" />
          <button onClick={() => { setFromDate(""); setToDate(""); }} className="ml-2 px-3 py-2 rounded-md bg-slate-200">Reset</button>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={addDemoExpense} className="px-4 py-2 rounded shadow bg-indigo-600 text-white hover:opacity-95">Add Demo Expense</button>
          <div className="text-sm text-slate-600">Showing {filtered.length} transactions</div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white shadow-sm">
          <div className="text-sm text-slate-500">Total Income</div>
          <div className="text-2xl font-semibold mt-2">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm">
          <div className="text-sm text-slate-500">Total Expenses</div>
          <div className="text-2xl font-semibold mt-2">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm">
          <div className="text-sm text-slate-500">Remaining Budget</div>
          <div className="text-2xl font-semibold mt-2">{formatCurrency(remainingBudget)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm">
          <div className="text-sm text-slate-500">Savings</div>
          <div className="text-2xl font-semibold mt-2">{formatCurrency(savings)}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Monthly Spending Trend</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="value" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Category-wise Split</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {categorySplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-3 p-4 rounded-2xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Today's Expenses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase">
                  <th className="py-2">Amount</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Note</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {todaysExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No expenses for this day</td>
                  </tr>
                ) : (
                  todaysExpenses.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3">{formatCurrency(t.amount)}</td>
                      <td className="py-3">{t.category}</td>
                      <td className="py-3">{t.note}</td>
                      <td className="py-3">{t.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
