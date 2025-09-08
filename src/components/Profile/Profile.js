import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function Profile({ currency, setCurrency, transactions }) {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("User@example.com");
  const [editing, setEditing] = useState(false);
  const totalExpenses = transactions
    ? transactions.filter(t => t.type === "Expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)
    : 0;

  const totalIncome = transactions
    ? transactions.filter(t => t.type === "Income")
        .reduce((sum, t) => sum + Number(t.amount), 0)
    : 0;

  const totalSavings = totalIncome - totalExpenses;

  return (
    <Container style={{marginTop:'6rem'}}>
      <Row className="g-4">
        <Col md={5}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Profile Details</Card.Title>
              <div className="text-center mb-3">
                <img src={require("../Img/User-Icon.jpg")} alt="User" style={{ width: "80%", borderRadius: "50%" }} />
              </div>
              {editing ? (
                <div>
                  <label>Name:</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}/>
                  <label>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: "0.5rem" }}/>
                  <Button onClick={() => setEditing(false)} style={{ marginTop: "0.5rem" }}>Save</Button>
                </div>
              ) : (
                <div>
                  <p><strong>Name:</strong> <span style={{ color: "#007bff" }}>{name}</span></p>
                  <p><strong>Email:</strong> <span style={{ color: "#007bff" }}>{email}</span></p>
                  <p><strong>Currency:</strong> <span style={{ color: "#007bff" }}>{currency}</span></p>
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Financial Summary</Card.Title>
              <hr />
              <p>Total Expenses:</p>
              <h2>{currency} {totalExpenses.toLocaleString()}</h2>
              <p>Total Savings:</p>
              <h2>{currency} {totalSavings.toLocaleString()}</h2>
              <div style={{ marginTop: "1rem" }}>
                <label>Default Currency:</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}>
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
