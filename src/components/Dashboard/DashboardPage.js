import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,PieChart,Pie,Legend,Cell,ResponsiveContainer} from "recharts";


function DashboardPage() {
  const [list, setList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [view, setView] = useState("monthly");

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = profile.currency || "₹";

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convert(val) {
    return (val * rates[currency]).toFixed(2);
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];
    setList(saved);
  }, []);

  const filtered = list.filter((item) => {
    if (fromDate && item.date < fromDate) return false;
    if (toDate && item.date > toDate) return false;
    return true;
  });

  let income = 0;
  let expense = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i].type === "Income") {
      income += Number(filtered[i].amount);
    }
    if (filtered[i].type === "Expense") {
      expense += Number(filtered[i].amount);
    }
  }

  const balance = income - expense;

  function getKey(date) {
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

  const lineMap = {};

  for (let i = 0; i < filtered.length; i++) {
    const t = filtered[i];

    if (t.type === "Expense") {
      const key = getKey(t.date);

      if (!lineMap[key]) {
        lineMap[key] = 0;
      }

      lineMap[key] = lineMap[key] + Number(t.amount);
    }
  }

  const lineData = Object.keys(lineMap).map((k) => ({
    label: k,
    amount: Number(convert(lineMap[k])),
  }));

  const pieMap = {};

  for (let i = 0; i < filtered.length; i++) {
    const t = filtered[i];

    if (t.type === "Expense") {
      const cat = t.category || "Other";

      if (!pieMap[cat]) {
        pieMap[cat] = 0;
      }

      pieMap[cat] = pieMap[cat] + Number(t.amount);
    }
  }

  const pieData = Object.keys(pieMap).map((c) => ({
    name: c,
    value: Number(convert(pieMap[c])),
  }));

  const remaining = income - expense;

  if (remaining > 0) {
    pieData.push({
      name: "Income",
      value: Number(convert(remaining)),
    });
  }

  const colors = ["#ff4d4f", "#ffbb28", "#00c49f", "#0088fe", "#a28cf0"];

  const selectedDate = toDate || fromDate;

  const tableList = filtered.filter((t) => {
    if (t.type !== "Expense") return false;
    if (selectedDate && t.date !== selectedDate) return false;
    return true;
  });

  return (
    <Container className="mt-4 mb-5">
      <h2>Dashboard</h2>
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
          <Card>
            <Card.Body>
              <Card.Title>Income</Card.Title>
              {currency} {convert(income)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Expense</Card.Title>
              {currency} {convert(expense)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              {currency} {convert(balance)}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Savings</Card.Title>
              {currency} {convert(balance)}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Expense Trend</Card.Title>

              <select className="form-select mb-2" value={view} onChange={(e) => setView(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="amount" stroke="#ff4d4f" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Expense Categories & Income</Card.Title>

              {pieData.length === 0 ? (
                <p className="text-center">No data available</p>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Expenses</h4>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {tableList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No expenses found
                  </td>
                </tr>
              ) : (
                tableList.map((t, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{currency} {convert(t.amount)}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;
