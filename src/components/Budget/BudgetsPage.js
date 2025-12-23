import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./BudgetPage.module.css";
import { MdEdit, MdDelete } from "react-icons/md";

function BudgetsPage() {
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedCurrency = profile.currency || "₹";

  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || []
  );

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  function convertAmount(value, fromCurrency) {
    const source = fromCurrency || "₹";

    if (source === selectedCurrency) return Number(value);

    const inINR = Number(value) / rates[source];
    return inINR * rates[selectedCurrency];
  }

  function getSpentForCategory(cat) {
    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let total = 0;

    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];

      if (
        t.type === "Expense" &&
        t.category &&
        t.category.trim().toLowerCase() === cat.trim().toLowerCase() &&
        t.date &&
        t.date.slice(0, 7) === currentMonth
      ) {
        total += convertAmount(t.amount, t.currency);
      }
    }

    return total;
  }

  useEffect(() => {
    for (let i = 0; i < budgets.length; i++) {
      const spent = getSpentForCategory(budgets[i].category);
      const limit = convertAmount(budgets[i].amount, budgets[i].currency);

      if (spent > limit) {
        toast.warning("Budget exceeded for " + budgets[i].category);
      }
    }
  }, [budgets]);

  function handleSubmit(e) {
    e.preventDefault();

    if (category.trim() === "" || amount === "") {
      toast.error("Please enter category and amount");
      return;
    }

    const cleanCategory = category.trim().toLowerCase();

    for (let i = 0; i < budgets.length; i++) {
      if (
        budgets[i].category.toLowerCase() === cleanCategory &&
        i !== editIndex
      ) {
        toast.error("Category already exists");
        return;
      }
    }

    const budgetData = {
      category: category.trim(),
      amount: Number(amount),
      currency: selectedCurrency,
    };

    if (editIndex !== null) {
      const copy = [...budgets];
      copy[editIndex] = budgetData;
      setBudgets(copy);
      toast.success("Budget updated");
    } else {
      setBudgets([...budgets, budgetData]);
      toast.success("Budget added");
    }

    closeForm();
  }

  function openAdd() {
    setCategory("");
    setAmount("");
    setEditIndex(null);
    setShowForm(true);
  }

  function handleEdit(index) {
    setCategory(budgets[index].category);
    setAmount(budgets[index].amount);
    setEditIndex(index);
    setShowForm(true);
  }

  function closeForm() {
    setCategory("");
    setAmount("");
    setEditIndex(null);
    setShowForm(false);
  }

  function askDelete(index) {
    setDeleteIndex(index);
    setShowDelete(true);
  }

  function confirmDelete() {
    setBudgets(budgets.filter((_, i) => i !== deleteIndex));
    toast.success("Budget removed");
    setShowDelete(false);
  }

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer autoClose={2000} />

      <Row className="mb-3">
        <Col className="d-flex justify-content-between">
          <h2>Budgets</h2>
          <Button onClick={openAdd}>Add Budget</Button>
        </Col>
      </Row>
      <Modal show={showForm} onHide={closeForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Budget" : "Add Budget"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label>Category</label>
            <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}/>
            <label className="mt-2"> Amount ({selectedCurrency})</label>
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Budget</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this budget?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={classes.budgetTable}>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Spent / Budget</th>
              <th>Progress</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No budgets added
                </td>
              </tr>
            ) : (
              budgets.map((b, i) => {
                const spent = getSpentForCategory(b.category);
                const limit = convertAmount(b.amount, b.currency);
                const percent =
                  limit > 0 ? Math.round((spent * 100) / limit) : 0;

                return (
                  <tr key={i}>
                    <td>{b.category}</td>
                    <td>
                      {selectedCurrency} {spent.toFixed(2)} /{" "}
                      {selectedCurrency} {limit.toFixed(2)} ({percent}%)
                    </td>
                    <td>
                      <div className="progress" style={{ height: "12px" }}>
                        <div
                          className={ percent > 100 ? "progress-bar bg-danger" : "progress-bar" } style={{ width: percent > 100 ? "100%" : percent + "%",}}/>
                      </div>
                    </td>
                    <td>
                      <div className={classes.actions}>
                        <span className={classes.actionBtn} onClick={() => handleEdit(i)}>
                          <MdEdit size={20}/>
                        </span>
                        <span className={classes.actionBtn} onClick={() => askDelete(i)}>
                          <MdDelete size={20}/>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default BudgetsPage;
