import React, { useState } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

function Transaction({ currency = "₹", transactions, setTransactions }) {
  const [form, setForm] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const saveTransaction = () => {
    if (!form.amount || !form.category || !form.date) return;

    if (editingIndex !== null) {
      const updated = [...transactions];
      updated[editingIndex] = form;
      setTransactions(updated);
    } else {
      setTransactions([...transactions, form]);
    }
    setForm({ type: "Income", amount: "", category: "", date: "", description: "" });
    setEditingIndex(null);
    setShowForm(false);
  };
  const editTransaction = (index) => {
    setForm(transactions[index]);
    setEditingIndex(index);
    setShowForm(true);
  };
 function deleteTransaction(index) {
  const newTransactions = transactions.filter((item, i) => i !== index);
  setTransactions(newTransactions);
}

  return (
    <Container style={{marginTop:'6rem'}}>
      <Row className="mb-3">
        <Col>
          <h2>Transactions</h2>
          <Button variant="primary" onClick={() => setShowForm(true)}>+ Add Transaction</Button>
        </Col>
      </Row>
      {showForm && (
        <Row className="mb-4">
          <Col>
            <div className="p-3 border rounded">
              <label className="d-block mb-2">
                Type:
                <select name="type" value={form.type} onChange={handleChange} className="form-select">
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </label>
              <label className="d-block mb-2">
                Amount:
                <input type="number" name="amount" value={form.amount} onChange={handleChange} className="form-control"/>
              </label>
              <label className="d-block mb-2">
                Category:
                <input type="text" name="category" value={form.category} onChange={handleChange} className="form-control"/>
              </label>
              <label className="d-block mb-2">
                Date:
                <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control"/>
              </label>
              <label className="d-block mb-2">
                Description:
                <input type="text" name="description" value={form.description} onChange={handleChange} className="form-control"/>
              </label>
              <Button variant="success" className="me-2" onClick={saveTransaction}>
                {editingIndex !== null ? "Update" : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No transactions yet</td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.type}</td>
                    <td>{currency}{t.amount}</td>
                    <td>{t.category}</td>
                    <td>{t.date}</td>
                    <td>{t.description}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => editTransaction(i)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => deleteTransaction(i)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
export default Transaction;
