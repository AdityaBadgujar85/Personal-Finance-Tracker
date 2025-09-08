import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#6366F1", "#EF4444", "#F59E0B", "#10B981", "#3B82F6"];


function Dashboard(props) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("");
  const money = (x) => props.currency + Math.abs(x);
  const filtered = props.transactions.filter((d) => {
    const day = new Date(d.date);
    return (!from || day >= new Date(from)) && (!to || day <= new Date(to));
  });

  const income = filtered.filter((d) => d.type === "Income").reduce((a, b) => a + Number(b.amount), 0);
  const expenses = filtered.filter((d) => d.type === "Expense").reduce((a, b) => a + Number(b.amount), 0);

  const group = (key) => {
    const map = {};
    filtered.forEach((d) => {
      if (d.type === "Expense") {
        const k = key === "month" ? d.date.slice(0, 7) : d.category;
        map[k] = (map[k] || 0) + Number(d.amount);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayList = filtered.filter((d) => d.date === today && d.type === "Expense");

  return (
    <Container fluid style={{ fontFamily: "sans-serif", marginTop: "6rem" }}>
      <Row className="mb-3 align-items-center">
        <Col> 
        <label htmlFor="">Start Date:</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{padding:'0.5rem', border:'0.05rem solid grey', borderRadius:'1rem'}} />
        </Col>
        <Col>
          <label htmlFor="">End Date: </label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{padding:'0.5rem', border:'0.05rem solid grey', borderRadius:'1rem'}}  />
        </Col>
        <Col>
          <Button onClick={() => { setFrom(""); setTo(""); }}>Reset</Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col><Card body>Income: <b>{money(income)}</b></Card></Col>
        <Col><Card body>Expenses: <b>{money(expenses)}</b></Card></Col>
        <Col><Card body>Remaining Budget: <b>{money(income - expenses)}</b></Card></Col>
        <Col><Card body>Savings: <b>{money(income - expenses)}</b></Card></Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Card body style={{ height: 300 }}>
            <h5>Monthly Spending</h5>
            <ResponsiveContainer>
              <BarChart data={group("month")}>
                <XAxis dataKey="name" /><YAxis /><Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <Card body style={{ height: 300 }}>
            <h5>By Category</h5>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={group("cat")} dataKey="value" nameKey="name" outerRadius={80} label>
                  {group("cat").map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card body>
            <h5>Today's Expenses</h5>
            {todayList.length === 0 ? <p>No expenses today</p> : (
              <Table striped bordered hover>
                <thead>
                  <tr><th>Amount</th><th>Category</th><th>Description</th></tr>
                </thead>
                <tbody>
                  {todayList.map((d, i) => (
                    <tr key={i}>
                      <td>{money(d.amount)}</td><td>{d.category}</td><td>{d.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
