import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./BudgetPage.module.css";
import { MdEdit, MdDelete } from "react-icons/md";

function BudgetsPage() {
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = savedProfile.currency || "₹";

  const rateMap = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || []
  );

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  function calculateSpent(categoryName) {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let totalSpent = 0;

    for (let i = 0; i < savedTransactions.length; i++) {
      const item = savedTransactions[i];

      if (
        item.type === "Expense" &&
        item.category &&
        item.category.toLowerCase() === categoryName.toLowerCase() &&
        item.date &&
        item.date.slice(0, 7) === currentMonth
      ) {
        totalSpent = totalSpent + Number(item.amount || 0);
      }
    }

    return totalSpent;
  }

  function submitHandler(e) {
    e.preventDefault();

    if (category.trim() === "" || amount === "") {
      toast.error("Enter category and amount");
      return;
    }

    const lowerName = category.trim().toLowerCase();

    for (let i = 0; i < budgets.length; i++) {
      if (
        budgets[i].category.toLowerCase() === lowerName &&
        i !== editIndex
      ) {
        toast.error("Category already exists");
        return;
      }
    }

    const baseAmount = Number(amount) / rateMap[currency];

    const newBudget = {
      category: category.trim(),
      amount: baseAmount,
    };

    if (editIndex !== null) {
      const copy = [...budgets];
      copy[editIndex] = newBudget;
      setBudgets(copy);
      toast.success("Budget updated");
    } else {
      setBudgets([...budgets, newBudget]);
      toast.success("Budget added");
    }

    closeForm();
  }

  function openAddForm() {
    setCategory("");
    setAmount("");
    setEditIndex(null);
    setShowForm(true);
  }

  function editBudget(index) {
    const selected = budgets[index];
    setCategory(selected.category);
    setAmount((selected.amount * rateMap[currency]).toFixed(2));
    setEditIndex(index);
    setShowForm(true);
  }

  function closeForm() {
    setCategory("");
    setAmount("");
    setEditIndex(null);
    setShowForm(false);
  }

  function requestDelete(index) {
    setDeleteIndex(index);
    setShowDelete(true);
  }

  function deleteBudget() {
    const updated = budgets.filter((_, i) => i !== deleteIndex);
    setBudgets(updated);
    toast.success("Budget removed");
    setShowDelete(false);
  }

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer autoClose={2000} />

      <Row className="mb-3">
        <Col className="d-flex justify-content-between">
          <h2>Budgets</h2>
          <Button style={{ background: "#234C6A", border: "none" }} onClick={openAddForm}> Add Budget </Button>
        </Col>
      </Row>

      <Modal show={showForm} onHide={closeForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit Budget" : "Add Budget"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={submitHandler}>
            <label>Category</label>
            <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}/>

            <label className="mt-2">Amount ({currency})</label>
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)}/>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={closeForm}> Cancel </Button>
              <Button type="submit" style={{ background: "#234C6A", border: "none" }}>
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
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}> Cancel </Button>
          <Button variant="danger" onClick={deleteBudget}> Delete </Button>
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
              budgets.map((item, index) => {
                const spentBase = calculateSpent(item.category);
                const limitBase = item.amount;

                const spent = spentBase * rateMap[currency];
                const limit = limitBase * rateMap[currency];

                let percent = 0;
                if (limitBase > 0) {
                  percent = Math.round((spentBase * 100) / limitBase);
                }

                return (
                  <tr key={index}>
                    <td>{item.category}</td>
                    <td>
                      {currency} {spent.toFixed(2)} / {currency}{" "}
                      {limit.toFixed(2)}
                    </td>
                    <td>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: percent > 100 ? "100%" : percent + "%", background: "#234C6A"}}>{percent}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={classes.actions}>
                        <span className={classes.actionBtn} onClick={() => editBudget(index)}>
                          <MdEdit size={20} />
                        </span>
                        <span className={classes.actionBtn} onClick={() => requestDelete(index)}>
                          <MdDelete size={20} />
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
