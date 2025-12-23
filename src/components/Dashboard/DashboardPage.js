import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,PieChart,Pie,Legend,Cell,ResponsiveContainer} from "recharts";
import classes from "./Dashboard.module.css";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [view, setView] = useState("monthly");

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedCurrency = profile.currency || "₹";

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convertAmount(value, fromCurrency) {
    const source = fromCurrency || "₹";

    if (source === selectedCurrency) {
      return Number(value);
    }

    const inINR = Number(value) / rates[source];
    return inINR * rates[selectedCurrency];
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(saved);
  }, []);

  const filteredList = transactions.filter((item) => {
    if (fromDate && item.date < fromDate) return false;
    if (toDate && item.date > toDate) return false;
    return true;
  });

  let income = 0;
  let expense = 0;

  for (let i = 0; i < filteredList.length; i++) {
    const item = filteredList[i];

    if (item.type === "Income") {
      income += convertAmount(item.amount, item.currency);
    }

    if (item.type === "Expense") {
      expense += convertAmount(item.amount, item.currency);
    }
  }

  const balance = income - expense;

  function getGroupKey(date) {
    if (view === "daily") return date;

    if (view === "weekly") {
      const d = new Date(date);
      const week = Math.ceil(d.getDate() / 7);
      return date.slice(0, 7) + "-W" + week;
    }

    return date.slice(0, 7);
  }

  const lineMap = {};

  for (let i = 0; i < filteredList.length; i++) {
    const item = filteredList[i];

    if (item.type === "Expense") {
      const key = getGroupKey(item.date);

      if (!lineMap[key]) lineMap[key] = 0;

      lineMap[key] += convertAmount(item.amount, item.currency);
    }
  }

  const lineData = Object.keys(lineMap).map((key) => ({
    label: key,
    amount: Number(lineMap[key].toFixed(2)),
  }));

  const pieMap = {};

  for (let i = 0; i < filteredList.length; i++) {
    const item = filteredList[i];

    if (item.type === "Expense") {
      const category = item.category || "Other";

      if (!pieMap[category]) pieMap[category] = 0;

      pieMap[category] += convertAmount(item.amount, item.currency);
    }
  }

  const pieData = Object.keys(pieMap).map((key) => ({
    name: key,
    value: Number(pieMap[key].toFixed(2)),
  }));

  const remaining = income - expense;

  if (remaining > 0) {
    pieData.push({
      name: "Income",
      value: Number(remaining.toFixed(2)),
    });
  }

  const colors = ["#ff4d4f", "#ffbb28", "#0088fe", "#a28cf0"];

  const selectedDate = toDate || fromDate;

  const expenseTable = filteredList.filter((item) => {
    if (item.type !== "Expense") return false;
    if (selectedDate && item.date !== selectedDate) return false;
    return true;
  });

  function formatCurrency(value) {
  return `${selectedCurrency} ${Number(value).toFixed(2)}`;
}

  return (
    <Container className="mt-4 mb-5">
      <h2 className={classes.pageTitle}>Dashboard</h2>

      <Row className="mb-3">
        <Col md={4}>
          <label>From</label>
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
        </Col>

        <Col md={4}>
          <label>To</label>
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)}/>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Income</Card.Title>
              {selectedCurrency} {income.toFixed(2)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Expense</Card.Title>
              {selectedCurrency} {expense.toFixed(2)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              {selectedCurrency} {balance.toFixed(2)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Savings</Card.Title>
              {selectedCurrency} {balance.toFixed(2)}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className={classes.chartCard}>
            <Card.Body>
              <Card.Title>Expense Trend</Card.Title>

              <select className="form-select mb-2" value={view} onChange={(e) => setView(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <div style={{ height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                      <YAxis tickFormatter={(val) => formatCurrency(val)} />
                      <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Line dataKey="amount" stroke="#ff4d4f" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={classes.chartCard}>
            <Card.Body>
              <Card.Title>Expense Categories & Income</Card.Title>

              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={80}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.name === "Income" ? "#00c49f": colors[i % colors.length]}/>
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Expenses</h4>

          <div className={classes.expenseTable}>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                {expenseTable.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={classes.empty}>
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenseTable.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {selectedCurrency}{" "}
                        {convertAmount(item.amount, item.currency).toFixed(2)}
                      </td>
                      <td>
                        <span className={classes.tag}>
                          {item.category}
                        </span>
                      </td>
                      <td>{item.description || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;
