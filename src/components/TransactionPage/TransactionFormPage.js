import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transaction from "./Transaction";
import classes from "./TransactionForm.module.css";

function TransactionFormPage() {
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = savedProfile.currency || "₹";

  const rateMap = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  const [formData, setFormData] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function clearForm() {
    setFormData({
      type: "Income",
      amount: "",
      category: "",
      date: "",
      description: "",
    });
    setEditIndex(null);
    setShowForm(false);
  }

  function inputChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function getTotals(skipIndex = null) {
    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
      if (i === skipIndex) continue;

      const t = transactions[i];

      if (t.type === "Income") {
        income = income + Number(t.amount);
      }

      if (t.type === "Expense") {
        expense = expense + Number(t.amount);
      }
    }

    return { income, expense };
  }

  function submitHandler(e) {
    e.preventDefault();

    const { type, amount, category, date, description } = formData;

    if (!type || !amount || !category || !date || !description) {
      toast.error("All fields required");
      return;
    }

    const baseAmount = Number(amount) / rateMap[currency];
    const totals = getTotals(editIndex);

    if (type === "Expense") {
      if (totals.expense + baseAmount > totals.income) {
        toast.error("Expense cannot exceed income");
        return;
      }
    }

    if (type === "Income" && editIndex !== null) {
      if (baseAmount < totals.expense) {
        toast.error("Income cannot be less than total expense");
        return;
      }
    }

    const newTransaction = {
      type,
      amount: baseAmount,
      category,
      date,
      description,
    };

    if (editIndex !== null) {
      const copy = [...transactions];
      copy[editIndex] = newTransaction;
      setTransactions(copy);
      toast.success("Transaction updated");
    } else {
      setTransactions([...transactions, newTransaction]);
      toast.success("Transaction added");
    }

    clearForm();
  }

  function editTransaction(index) {
    const t = transactions[index];
    setFormData({...t,amount: (t.amount * rateMap[currency]).toFixed(2)});

    setEditIndex(index);
    setShowForm(true);
  }

  function requestDelete(index) {
    setDeleteIndex(index);
    setShowDelete(true);
  }

  function deleteTransaction() {
    const item = transactions[deleteIndex];
    const totals = getTotals(deleteIndex);

    if (item.type === "Income" && totals.expense > totals.income) {
      toast.error("Cannot delete income. Expenses depend on it.");
      setShowDelete(false);
      return;
    }

    const updated = [...transactions];
    updated.splice(deleteIndex, 1);
    setTransactions(updated);

    toast.success("Transaction deleted");
    setShowDelete(false);
  }

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer autoClose={2000} />

      <Row>
        <Col className="d-flex justify-content-between">
          <h2>Transactions</h2>
          <Button style={{ background: "#234C6A", border: "none" }} onClick={() => setShowForm(true)}> Add Transaction </Button>
        </Col>
      </Row>

      <Modal show={showForm} onHide={clearForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Transaction" : "Add Transaction"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={submitHandler}>
            <label>Type</label>
            <select name="type" className="form-select" value={formData.type} onChange={inputChange}>
              <option>Income</option>
              <option>Expense</option>
            </select>

            <label className="mt-2">Amount ({currency})</label>
            <input type="number" name="amount" className="form-control" value={formData.amount} onChange={inputChange}/>

            <label className="mt-2">Category</label>
            <input name="category" className="form-control" value={formData.category} onChange={inputChange}/>

            <label className="mt-2">Date</label>
            <input type="date" name="date" className="form-control" max={new Date().toISOString().split("T")[0]} value={formData.date} onChange={inputChange}/>

            <label className="mt-2">Description</label>
            <textarea name="description" className="form-control" value={formData.description} onChange={inputChange}/>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={clearForm}>Cancel</Button>
              <Button type="submit" style={{ background: "#234C6A", border: "none" }}>
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTransaction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Transaction transactions={transactions} EditFunction={editTransaction} DeleteFunction={requestDelete}/>
    </Container>
  );
}

export default TransactionFormPage;
