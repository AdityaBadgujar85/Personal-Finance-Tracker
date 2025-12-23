import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transaction from "./Transaction";
import classes from "./TransactionForm.module.css";

function TransactionFormPage() {
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedCurrency = profile.currency || "₹";

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formValues, setFormValues] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    description: "",
    currency: selectedCurrency,
  });

  const [transactionList, setTransactionList] = useState(
    JSON.parse(localStorage.getItem("transactions") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactionList));
  }, [transactionList]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  function resetForm() {
    setFormValues({
      type: "Income",
      amount: "",
      category: "",
      date: "",
      description: "",
      currency: selectedCurrency,
    });
    setEditingIndex(null);
    setShowForm(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { type, amount, category, date, description } = formValues;

    if (!type || !amount || !category || !date || !description) {
      toast.error("All fields required");
      return;
    }

    let totalIncome = 0;
    let totalExpense = 0;

    transactionList.forEach((item, index) => {
      if (editingIndex !== null && index === editingIndex) 
        return;

      if (item.type === "Income") 
        totalIncome += Number(item.amount);
      if (item.type === "Expense") 
        totalExpense += Number(item.amount);
    });

    if (
      type === "Expense" &&
      totalExpense + Number(amount) > totalIncome
    ) {
      toast.error("Expense cannot be more than income");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...transactionList];
      updated[editingIndex] = formValues;
      setTransactionList(updated);
      toast.success("Transaction updated");
    } else {
      setTransactionList([...transactionList, formValues]);
      toast.success("Transaction added");
    }

    resetForm();
  }

  function handleEdit(index) {
    setFormValues(transactionList[index]);
    setEditingIndex(index);
    setShowForm(true);
  }

  function askDelete(index) {
    setDeleteIndex(index);
    setShowDelete(true);
  }

  function confirmDelete() {
    const item = transactionList[deleteIndex];

    if (item.type === "Income") {
      let income = 0;
      let expense = 0;

      transactionList.forEach((t, i) => {
        if (i !== deleteIndex) {
          if (t.type === "Income") income += Number(t.amount);
          if (t.type === "Expense") expense += Number(t.amount);
        }
      });

      if (expense > income) {
        toast.error("Cannot delete income. Expenses depend on it.");
        setShowDelete(false);
        return;
      }
    }

    const updated = [...transactionList];
    updated.splice(deleteIndex, 1);
    setTransactionList(updated);
    toast.success("Transaction deleted");
    setShowDelete(false);
  }

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer autoClose={2000} />

      <Row>
        <Col style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Transactions</h2>
          <Button onClick={() => setShowForm(true)}>Add Transaction</Button>
        </Col>
      </Row>

      <Modal show={showForm} onHide={resetForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingIndex !== null ? "Edit Transaction" : "Add Transaction"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label>Type</label>
            <select name="type" className="form-select" value={formValues.type} onChange={handleChange}>
              <option>Income</option>
              <option>Expense</option>
            </select>

            <label className="mt-2"> Amount ({selectedCurrency})</label>
            <input name="amount" type="number" className="form-control" value={formValues.amount} onChange={handleChange}/>

            <label className="mt-2">Category</label>
            <input name="category" className="form-control" value={formValues.category} onChange={handleChange}/>

            <label className="mt-2">Date</label>
            <input name="date" type="date" className="form-control" max={new Date().toISOString().split("T")[0]} value={formValues.date} onChange={handleChange}/>

            <label className="mt-2">Description</label>
            <textarea name="description" className="form-control" value={formValues.description} onChange={handleChange}/>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={resetForm}> Cancel </Button>
              <Button type="submit">
                {editingIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this transaction?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}> Cancel </Button>
          <Button variant="danger" onClick={confirmDelete}> Delete</Button>
        </Modal.Footer>
      </Modal>

      <Transaction transactions={transactionList} EditFunction={handleEdit} DeleteFunction={askDelete}/>
    </Container>
  );
}

export default TransactionFormPage;
