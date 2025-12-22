import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./BudgetPage.module.css";

function BudgetsPage() {
  const savedBudgets = JSON.parse(localStorage.getItem("budgets"));
  const [budgets, setBudgets] = useState(savedBudgets || []);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = profile.currency || "₹";

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  function getSpent(cat) {
    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let spent = 0;

    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];

      if (
        t.type === "Expense" &&
        t.category &&
        t.category.trim().toLowerCase() === cat.trim().toLowerCase() &&
        t.date &&
        t.date.slice(0, 7) === month
      ) {
        spent = spent + Number(t.amount);
      }
    }

    return spent;
  }

  useEffect(() => {
    for (let i = 0; i < budgets.length; i++) {
      const b = budgets[i];
      const spent = getSpent(b.category);

      if (spent > b.amount) {
        toast.warning("Budget exceeded for " + b.category);
      }
    }
  }, [budgets]);

  function handleSubmit(e) {
    e.preventDefault();

    if (category === "" || amount === "") {
      toast.error("Please enter category and amount");
      return;
    }

    const cleanCat = category.trim();
    const lowerCat = cleanCat.toLowerCase();

    for (let i = 0; i < budgets.length; i++) {
      if (
        budgets[i].category.trim().toLowerCase() === lowerCat &&
        i !== editIndex
      ) {
        toast.error("Category already exists");
        return;
      }
    }

    const data = {
      category: cleanCat,
      amount: Number(toINR(amount)),
    };

    if (editIndex !== null) {
      const copy = [...budgets];
      copy[editIndex] = data;
      setBudgets(copy);
      setEditIndex(null);
      toast.success("Budget updated");
    } else {
      setBudgets([...budgets, data]);
      toast.success("Budget added");
    }

    setCategory("");
    setAmount("");
  }

  function handleEdit(i) {
    setCategory(budgets[i].category);
    setAmount(convert(budgets[i].amount));
    setEditIndex(i);
  }

  function handleDelete(i) {
    const copy = budgets.filter((_, index) => index !== i);
    setBudgets(copy);
    toast.success("Budget removed");
  }

  function convert(val) {
    return (val * rates[currency]).toFixed(2);
  }
  function toINR(val) {
  return val / rates[currency];
}

  return (
    <Container className={classes.mainContainer}>
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>Budgets</h2>

      <form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={5}>
            <input className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/>
          </Col>

          <Col md={4}>
            <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </Col>

          <Col md={3}>
            <Button type="submit">
              {editIndex !== null ? "Update" : "Add"}
            </Button>
          </Col>
        </Row>
      </form>

      <table className="table table-bordered">
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
              const spent = getSpent(b.category);
              let percent = 0;

              if (b.amount > 0) {
                percent = Math.round((spent * 100) / b.amount);
              }

              return (
                <tr key={i}>
                  <td>{b.category}</td>
                  <td>
                    {currency} {convert(spent)} / {currency}{" "}
                    {convert(b.amount)} ({percent}%)
                  </td>
                  <td>
                    <div className="progress" style={{ height: "12px" }}>
                      <div
                        className={ percent > 100 ? "progress-bar bg-danger" : "progress-bar" } style={{width: percent > 100 ? "100%" : percent + "%",}}/>
                    </div>
                  </td>
                  <td>
                    <Container>
                      <Row>
                        <Col md={6} xs={12}>
                         <Button size="sm" variant="outline-secondary"  style={{width:'100%'}} onClick={() => handleEdit(i)}>Edit</Button>
                        </Col>
                        <Col md={6} xs={12}>
                         <Button size="sm" variant="outline-danger"style={{width:'100%'}}  onClick={() => handleDelete(i)}>Delete</Button>
                        </Col>
                      </Row>
                     </Container>
                     </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Container>
  );
}

export default BudgetsPage;
