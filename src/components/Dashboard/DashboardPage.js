import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,PieChart,Pie,Legend,Cell,ResponsiveContainer} from "recharts";
import classes from "./Dashboard.module.css";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [view, setView] = useState("monthly");

  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = savedProfile.currency || "₹";

  const rateList = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convertValue(amount, fromCurrency) {
    const sourceCurrency = fromCurrency || "₹";

    if (sourceCurrency === currency) {
      return Number(amount);
    }

    const baseValue = Number(amount) / rateList[sourceCurrency];
    return baseValue * rateList[currency];
  }

  useEffect(() => {
    const savedData =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedData);
  }, []);

  const filteredData = transactions.filter((item) => {
    if (fromDate && item.date < fromDate) return false;
    if (toDate && item.date > toDate) return false;
    return true;
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = 0; i < filteredData.length; i++) {
    const row = filteredData[i];

    if (row.type === "Income") {
      totalIncome =
        totalIncome + convertValue(row.amount, row.currency);
    }

    if (row.type === "Expense") {
      totalExpense =
        totalExpense + convertValue(row.amount, row.currency);
    }
  }

  const balance = totalIncome - totalExpense;

  function getKeyByView(date) {
    if (view === "daily") {
      return date;
    }

    if (view === "weekly") {
      const d = new Date(date);
      const week = Math.ceil(d.getDate() / 7);
      return date.slice(0, 7) + "-W" + week;
    }

    return date.slice(0, 7);
  }

  const lineTotals = {};

  for (let i = 0; i < filteredData.length; i++) {
    const item = filteredData[i];

    if (item.type === "Expense") {
      const key = getKeyByView(item.date);

      if (!lineTotals[key]) {
        lineTotals[key] = 0;
      }

      lineTotals[key] =
        lineTotals[key] + convertValue(item.amount, item.currency);
    }
  }

  const lineData = [];

  for (let key in lineTotals) {
    lineData.push({
      label: key,
      amount: Number(lineTotals[key].toFixed(2)),
    });
  }

  const pieTotals = {};

  for (let i = 0; i < filteredData.length; i++) {
    const item = filteredData[i];

    if (item.type === "Expense") {
      const cat = item.category || "Other";

      if (!pieTotals[cat]) {
        pieTotals[cat] = 0;
      }

      pieTotals[cat] =
        pieTotals[cat] + convertValue(item.amount, item.currency);
    }
  }

  const pieData = [];

  for (let key in pieTotals) {
    pieData.push({
      name: key,
      value: Number(pieTotals[key].toFixed(2)),
    });
  }

  const remaining = totalIncome - totalExpense;

  if (remaining > 0) {
    pieData.push({
      name: "Income",
      value: Number(remaining.toFixed(2)),
    });
  }

  const chartColors = ["#ff4d4f", "#ffbb28", "#0088fe", "#a28cf0"];

  const selectedDay = toDate || fromDate;

  const expenseList = filteredData.filter((item) => {
    if (item.type !== "Expense") return false;
    if (selectedDay && item.date !== selectedDay) return false;
    return true;
  });

  function showAmount(val) {
    return `${currency} ${Number(val).toFixed(2)}`;
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
              {showAmount(totalIncome)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Expense</Card.Title>
              {showAmount(totalExpense)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              {showAmount(balance)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <Card.Title>Savings</Card.Title>
              {showAmount(balance)}
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
                    <YAxis tickFormatter={(val) => showAmount(val)}/>
                    <Tooltip formatter={(val) => showAmount(val)}/>
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
                        <Cell key={i} fill={ entry.name === "Income" ? "#00c49f" : chartColors[i % chartColors.length]}/>
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(val) => showAmount(val)}/>
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
                {expenseList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={classes.empty}>
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenseList.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td> {showAmount(convertValue(item.amount, item.currency))}</td>
                      <td>
                        <span className={classes.tag}>
                          {item.category}
                        </span>
                      </td>
                      <td>{item.description}</td>
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
