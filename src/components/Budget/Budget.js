import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Budget({ transactions, budgets, setBudgets, currency = "₹" }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const saveBudget = () => {
    if (!category || !amount) {
      toast.error("Please enter category and amount!");
      return;
    }
    if (editingIndex !== null) {
      const updated = [...budgets];
      updated[editingIndex] = { category, amount: Number(amount) };
      setBudgets(updated);
      toast.success("Budget updated!");
      setEditingIndex(null);
    } else {
      setBudgets([...budgets, { category, amount: Number(amount) }]);
      toast.success("Budget added!");
    }

    setCategory("");
    setAmount("");
  };
  const editBudget = (index) => {
    const b = budgets[index];
    setCategory(b.category);
    setAmount(b.amount);
    setEditingIndex(index);
  };
  const deleteBudget = (index) => {
    const updated = budgets.filter((_, i) => i !== index);
    setBudgets(updated);
    toast.info("Budget deleted!");
  };
  const getSpent = (cat) =>
    transactions
      .filter((t) => t.type === "Expense" && t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <Container style={{marginTop:'6rem'}}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Row className="mb-3">
        <Col><h2>Monthly Budgets</h2></Col>
      </Row>
      <Row className="mb-4">
        <Col md={4}>
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control"/>
        </Col>
        <Col md={4}>
          <input type="number" placeholder="Budget Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control"/>
        </Col>
        <Col md={4}>
          <Button onClick={saveBudget}>
            {editingIndex !== null ? "Update Budget" : "Add Budget"}
          </Button>
          {editingIndex !== null && (
            <Button onClick={() => { setEditingIndex(null); setCategory(""); setAmount(""); }} className="ms-2">
              Cancel
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        {budgets.length === 0 ? (
          <Col><p>No budgets yet</p></Col>
        ) : (
          budgets.map((b, i) => {
            const spent = getSpent(b.category);
            const percent = Math.min((spent / b.amount) * 100, 100);

            if (spent > b.amount) {
              toast.warn(`Budget exceeded for ${b.category}!`);
            }
            return (
              <Col md={6} key={i} className="mb-3">
                <Card body>
                  <h5>{b.category}</h5>
                  <p>Budget: {currency}{b.amount} | Spent: {currency}{spent}</p>
                  <div style={{ height: 20, width: "100%", background: "#ddd", borderRadius: 5 }}>
                    <div style={{width: `${percent}%`,height: "100%",background: spent > b.amount ? "red" : "green",borderRadius: 5}}/>
                  </div>
                  {spent > b.amount && <p className="text-danger mt-2">Overspent!</p>}
                  <div className="mt-2">
                    <Button size="sm" onClick={() => editBudget(i)} className="me-2">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteBudget(i)}>Delete</Button>
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
}
export default Budget;
