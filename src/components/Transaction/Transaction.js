import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function Transaction({ currency }) {
  const API_URL = "https://6898ac7fddf05523e55f8904.mockapi.io/Transaction";

  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [formData, setFormData] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  // Fetch all transactions from API
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    if (sortConfig.key === "amount") {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleShowModal = (index = null) => {
    if (index !== null) {
      setFormData(transactions[index]);
      setEditingIndex(index);
    } else {
      setFormData({
        type: "Income",
        amount: "",
        category: "",
        date: "",
        description: "",
      });
      setEditingIndex(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingIndex !== null) {
        const id = transactions[editingIndex].id;
        const res = await axios.put(`${API_URL}/${id}`, formData);
        const updated = [...transactions];
        updated[editingIndex] = res.data;
        setTransactions(updated);
      } else {
        const res = await axios.post(API_URL, formData);
        setTransactions((prev) => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const id = transactions[index].id;
      await axios.delete(`${API_URL}/${id}`);
      setTransactions((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-3">
      <h1 className="mb-4">Transaction List</h1>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Transaction
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th onClick={() => handleSort("type")} style={{ cursor: "pointer" }}>Type</th>
            <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>Amount</th>
            <th onClick={() => handleSort("category")} style={{ cursor: "pointer" }}>Category</th>
            <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((txn, index) => (
            <tr key={txn.id}>
              <td>{txn.type}</td>
              <td>{currency}{txn.amount}</td> {/* Use currency prop here */}
              <td>{txn.category}</td>
              <td>{txn.date}</td>
              <td>{txn.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(index)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No transactions yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Edit" : "Add"} Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Transaction;
