import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axios from "axios";

function Budget({ currency }) {
  // API Endpoints
  const API_TRANSACTIONS = "https://6898ac7fddf05523e55f8904.mockapi.io/Transaction";
  const API_BUDGETS = "https://6898ac7fddf05523e55f8904.mockapi.io/Budget"; // <-- Create this in MockAPI

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });
  const [alertCategory, setAlertCategory] = useState(null);

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      const res = await axios.get(API_BUDGETS);
      setBudgets(res.data || []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_TRANSACTIONS);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, []);

  // Calculate "spent" for each budget category
  useEffect(() => {
    if (budgets.length > 0 && transactions.length > 0) {
      const spentByCategory = transactions
        .filter((t) => (t.type || "").toLowerCase() === "expense")
        .reduce((acc, t) => {
          const category = t.category || "Other";
          acc[category] = (acc[category] || 0) + Number(t.amount || 0);
          return acc;
        }, {});

      setBudgets((prev) =>
        prev.map((b) => ({
          ...b,
          spent: spentByCategory[b.category] || 0,
        }))
      );
    }
  }, [transactions, budgets.length]);

  // Add or Update budget in API
  const handleAddBudget = async () => {
    if (!newBudget.category || !newBudget.amount) return;

    try {
      const existing = budgets.find(
        (b) => b.category.toLowerCase() === newBudget.category.toLowerCase()
      );

      if (existing) {
        // Update existing budget
        await axios.put(`${API_BUDGETS}/${existing.id}`, {
          ...existing,
          amount: Number(newBudget.amount),
        });
      } else {
        // Create new budget
        await axios.post(API_BUDGETS, {
          category: newBudget.category,
          amount: Number(newBudget.amount),
          spent: 0,
        });
      }
      setNewBudget({ category: "", amount: "" });
      fetchBudgets();
    } catch (err) {
      console.error("Error adding/updating budget:", err);
    }
  };

  // Delete budget from API
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BUDGETS}/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  // Show overspending alert
  useEffect(() => {
    budgets.forEach((b) => {
      if (b.spent > b.amount) {
        setAlertCategory(b.category);
        setTimeout(() => setAlertCategory(null), 4000);
      }
    });
  }, [budgets]);

  return (
    <Container className="mt-4" fluid>
      <h2>Monthly Budgets</h2>

      {alertCategory && (
        <Alert variant="danger">
          ⚠ Overspent in <strong>{alertCategory}</strong>!
        </Alert>
      )}

      {/* Add / Update Budget */}
      <Form className="d-flex gap-2 my-3">
        <Form.Control
          type="text"
          placeholder="Category"
          name="category"
          value={newBudget.category}
          onChange={(e) =>
            setNewBudget({ ...newBudget, category: e.target.value })
          }
        />
        <Form.Control
          type="number"
          placeholder={`Budget Amount (${currency})`}
          name="amount"
          value={newBudget.amount}
          onChange={(e) =>
            setNewBudget({ ...newBudget, amount: e.target.value })
          }
        />
        <Button onClick={handleAddBudget} style={{backgroundColor:'#0f2027',
                  border:'none'}} onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2c5364")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0f2027")
                }>Add / Update</Button>
      </Form>

      {/* Budgets Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Category</th>
            <th>Budget ({currency})</th>
            <th>Spent ({currency})</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => {
            const progress =
              budget.amount > 0
                ? Math.min((budget.spent / budget.amount) * 100, 100)
                : 0;

            return (
              <tr key={budget.id}>
                <td>{budget.category}</td>
                <td>{currency} {budget.amount}</td>
                <td>{currency} {budget.spent || 0}</td>
                <td>
                  <ProgressBar
                    now={progress}
                    label={`${progress.toFixed(0)}%`}
                    style={{
                      height: "30px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      borderRadius: "25px",
                      overflow: "hidden",
                    }}
                    variant={
                      budget.spent > budget.amount
                        ? "danger"
                        : budget.spent / budget.amount > 0.8
                        ? "warning"
                        : "success"
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
          {budgets.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No budgets added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default Budget;
