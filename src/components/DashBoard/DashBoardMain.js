import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card, Form } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import axios from "axios";

function DashBoardMain({ currency }) {
  const API_URL = "https://6898ac7fddf05523e55f8904.mockapi.io/Transaction";

  const [dataDisplay, setDataDisplay] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch transactions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const cleaned = res.data.map(txn => ({
          ...txn,
          amount: parseFloat(txn.amount)
        }));
        setDataDisplay(cleaned);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchData();
  }, []);

  // Category lists
  const incomeCategories = ["salary", "income", "bonus", "investment return"];
  const expenseCategories = ["food", "shopping", "entertainment", "rent", "bills"];

  // Total Income
  const totalIncome = dataDisplay
    .filter(i => {
      const category = i.category?.toLowerCase() || "";
      return i.amount > 0 && !expenseCategories.includes(category);
    })
    .reduce((sum, i) => sum + Math.abs(i.amount), 0);

  // Total Expenses
  const totalExpenses = dataDisplay
    .filter(i => {
      const category = i.category?.toLowerCase() || "";
      return i.amount < 0 || expenseCategories.includes(category);
    })
    .reduce((sum, i) => sum + Math.abs(i.amount), 0);

  // Remaining Budget
  const remainingBudget = totalIncome - totalExpenses;

  // Total Savings
  const totalSavings = dataDisplay
    .filter(i => i.category?.toLowerCase() === "savings" && i.amount > 0)
    .reduce((sum, i) => sum + Math.abs(i.amount), 0);

  // Monthly spending trend (Only Expenses)
  const monthlyData = Object.values(
    dataDisplay.reduce((acc, item) => {
      const month = item.date?.slice(0, 7); // YYYY-MM
      const category = item.category?.toLowerCase();
      if (!acc[month]) acc[month] = { month, total: 0 };
      if (item.amount < 0 || expenseCategories.includes(category)) {
        acc[month].total += Math.abs(item.amount);
      }
      return acc;
    }, {})
  );

  // Category-wise expenses
  const categoryData = Object.values(
    dataDisplay.reduce((acc, item) => {
      const category = item.category?.toLowerCase();
      if (item.amount < 0 || expenseCategories.includes(category)) {
        if (!acc[category]) acc[category] = { name: item.category, value: 0 };
        acc[category].value += Math.abs(item.amount);
      }
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F", "#FF4444", "#AA66CC"];

  // Date Filter
  const filteredTransactions = dataDisplay.filter(item => {
    const itemDate = new Date(item.date);
    const isAfterStart = startDate ? itemDate >= new Date(startDate) : true;
    const isBeforeEnd = endDate ? itemDate <= new Date(endDate) : true;
    return isAfterStart && isBeforeEnd;
  });

  return (
    <Container style={{ marginTop: "6rem", marginBottom: "6rem" }} fluid>
      {/* Top Summary Cards */}
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Income</Card.Title>
              <Card.Text style={{ color: "green", fontWeight: "bold" }}>
                {currency}{totalIncome.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Expenses</Card.Title>
              <Card.Text style={{ color: "red", fontWeight: "bold" }}>
                {currency}{totalExpenses.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Remaining Budget</Card.Title>
              <Card.Text style={{ fontWeight: "bold" }}>
                {currency}{remainingBudget.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Savings</Card.Title>
              <Card.Text style={{ fontWeight: "bold" }}>
                {currency}{totalSavings.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction List with Date Filter */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-3 p-3">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card>
            <Card.Body>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item, idx) => (
                  <Card
                    key={idx}
                    className="mb-2 shadow-sm border-0"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f8f9fa",
                      padding: "10px 15px",
                      borderRadius: "10px"
                    }}
                  >
                    <Card.Body
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        padding: 0
                      }}
                    >
                      <Card.Text
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "5px"
                        }}
                      >
                        {item.category}:{" "}
                        <span
                          style={{
                            color:
                              item.amount < 0 ||
                              expenseCategories.includes(item.category?.toLowerCase())
                                ? "red"
                                : "green"
                          }}
                        >
                          {currency}{Math.abs(item.amount).toLocaleString()}
                        </span>
                      </Card.Text>
                      <Card.Text
                        style={{
                          color: "#6c757d",
                          fontSize: "0.9rem",
                          margin: 0
                        }}
                      >
                        {item.description}
                      </Card.Text>
                    </Card.Body>

                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#495057" }}>
                        {item.date}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted">
                  No transactions found for this date range
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Charts Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>📈 Monthly Spending Trend</Card.Title>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currency}${value.toLocaleString()}`} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>📊 Category-wise Expense Split</Card.Title>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={(entry) => `${entry.name}: ${currency}${entry.value.toLocaleString()}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${currency}${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashBoardMain;
