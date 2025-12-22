import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Transaction from "./Transaction";
import classes from "./TransactionForm.module.css";

function TransactionFormPage() {
  const [currentSlip, setCurrentSlip] = useState({
    type: "Income",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [moneyList, setMoneyList] = useState(() =>
    JSON.parse(localStorage.getItem("transactions") || "[]")
  );

  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(moneyList));
  }, [moneyList]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "amount") {
      setCurrentSlip({ ...currentSlip, amount: Number(value) });
    } else {
      setCurrentSlip({ ...currentSlip, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { type, amount, category, date, description } = currentSlip;
    if (!type || !amount || !category || !date || !description) {
      toast.error("All fields are required!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      toast.error("Date cannot be greater than today!");
      return;
    }

    const totalIncome = moneyList
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = moneyList
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    if (
      type === "Expense" &&
      totalExpense + amount > totalIncome
    ) {
      toast.error("Expense cannot be more than total income!");
      return;
    }

    if (editingRow !== null) {
      const updated = [...moneyList];
      updated[editingRow] = currentSlip;
      setMoneyList(updated);
      setEditingRow(null);
      toast.success("Transaction updated successfully");
    } else {
      setMoneyList([...moneyList, currentSlip]);
      toast.success("Transaction added successfully");
    }

    setCurrentSlip({
      type: "Income",
      amount: "",
      category: "",
      date: "",
      description: "",
    });
  }

  function handleDelete(index) {
    const updated = [...moneyList];
    updated.splice(index, 1);
    setMoneyList(updated);
    toast.success("Transaction deleted");
  }

  function handleEdit(index) {
    setCurrentSlip(moneyList[index]);
    setEditingRow(index);
  }

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>{editingRow !== null ? "Edit Transaction" : "Add Transaction"}</h2>
      <Row className="px-2">
      <form onSubmit={handleSubmit}>
        <Row className="d-flex gap-2">
          <Col xs={6} className="p-0">
            <label>Type</label>
            <select name="type" className="form-select" value={currentSlip.type} onChange={handleChange}>
              <option>Income</option>
              <option>Expense</option>
            </select>

            <label className="mt-2">Amount</label>
            <input name="amount" type="number" className="form-control" value={currentSlip.amount} onChange={handleChange}/>
          </Col>

          <Col className="p-0">
            <label>Category</label>
            <input name="category" type="text" placeholder="eg: Salary, Food, Entertainment" className="form-control" value={currentSlip.category} onChange={handleChange}/>

           <label className="mt-2">Date</label>
            <input name="date" type="date" className="form-control" value={currentSlip.date} onChange={handleChange}/>
          </Col>
        </Row>
        <Row>   
           <label className="mt-2">Description</label>
            <textarea name="description" type="text" placeholder="eg: Entertainent: Movies" className="form-control" value={currentSlip.description} onChange={handleChange}/>
          <Button type="submit" className="mt-3">
              {editingRow !== null ? "Update" : "Add"}
            </Button>
        </Row>
      </form>
      </Row>
        <Transaction transactions={moneyList} DeleteFunction={handleDelete} EditFunction={handleEdit}/>
    </Container>
  );
}

export default TransactionFormPage;
