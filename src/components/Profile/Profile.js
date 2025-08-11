import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";

function Profile({ currency, setCurrency }) {
  const API_URL = "https://6898ac7fddf05523e55f8904.mockapi.io/Transaction";

  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState({
    name: "Aditya Badgujar",
    email: "aditya@example.com",
  });

  const [formData, setFormData] = useState({ ...user });
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let expenses = 0;
    let income = 0;
    transactions.forEach((txn) => {
      if (txn.type === "Expense") expenses += parseFloat(txn.amount);
      else if (txn.type === "Income") income += parseFloat(txn.amount);
    });
    setTotalExpenses(expenses);
    setTotalSavings(income - expenses);
  }, [transactions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    setUser(formData);
    setShowEdit(false);
  };

  return (
    <Container fluid style={{ marginTop: "5rem"}}>
      <Row className="g-4">
        <Col md={5}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0 8px 16px rgba(0, 123, 255, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <Card.Title
                  style={{
                    fontWeight: "700",
                    fontSize: "2rem",
                    marginBottom: "1.2rem",
                    color: "#000000ff",
                    letterSpacing: "0.05em",
                  }}
                >
                Profile Details
                </Card.Title>
                <Card.Img src={require('../Img/User-Icon.jpg')} style={{width:'20rem'}}/>
                <hr style={{ borderColor: "#007bff33", marginBottom: "1.5rem" }} />
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  <strong>Name:</strong>{" "}
                  <span style={{ color: "#007bff" }}>{user.name}</span>
                </p>
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  <strong>Email:</strong>{" "}
                  <span style={{ color: "#007bff" }}>{user.email}</span>
                </p>
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  <strong>Currency:</strong>{" "}
                  <span style={{ color: "#007bff" }}>{currency}</span>
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowEdit(true)}
                className="mt-3 fw-bold"
                style={{
                  width: "100%",
                  letterSpacing: "0.07em",
                  fontSize: "1.1rem",
                  padding: "0.6rem 0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px #0f2027",
                  transition: "background-color 0.3s ease",
                  backgroundColor:'#0f2027',
                  border:'none'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2c5364")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0f2027")
                }
              >
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7} className="d-flex flex-column gap-4">
          <Card
            className="shadow-lg border-0 flex-grow-1"
            style={{
              borderRadius: "16px",
              backgroundColor: "#e6f7f1",
              boxShadow:
                "0 8px 20px rgba(59, 188, 128, 0.15), 0 4px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Card.Body className="text-center d-flex flex-column justify-content-center h-100 p-5">
              <Card.Title
                style={{
                  fontWeight: "700",
                  fontSize: "2rem",
                  marginBottom: "1.5rem",
                  color: "#000000ff",
                  letterSpacing: "0.05em",
                }}
              >
                Financial Summary
              </Card.Title>
              <hr style={{ borderColor: "#00000080", marginBottom: "2rem" }} />
              <div style={{ marginBottom: "3rem" }}>
                <h5
                  style={{
                    color: "#000000ff",
                    fontWeight: "700",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Total Expenses
                </h5>
                <h2
                  style={{
                    fontWeight: "900",
                    letterSpacing: "0.06em",
                    fontSize: "2.8rem",
                    color: "#ff4466ff",
                  }}
                >
                  {currency} {totalExpenses.toLocaleString()}
                </h2>
              </div>
              <div>
                <h5
                  style={{
                    color: "#000000ff",
                    fontWeight: "700",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Total Savings
                </h5>
                <h2
                  style={{
                    fontWeight: "900",
                    letterSpacing: "0.06em",
                    fontSize: "2.8rem",
                    color: "#32b079ff",
                  }}
                >
                  {currency} {totalSavings.toLocaleString()}
                </h2>
              </div>
            </Card.Body>
          </Card>

          <Card
            className="shadow-lg border-0"
            style={{
              borderRadius: "16px",
              backgroundColor: "#fff9e6",
              boxShadow:
                "0 6px 16px rgba(255, 183, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Card.Body className="p-4">
              <Card.Title
                style={{
                  fontWeight: "700",
                  fontSize: "1.9rem",
                  marginBottom: "1.3rem",
                  color: "#000000ff",
                  letterSpacing: "0.04em",
                }}
              >
                Settings
              </Card.Title>
              <hr style={{ borderColor: "#00000040", marginBottom: "1.5rem" }} />
              <Form.Group controlId="currency" className="mt-3">
                <Form.Label
                  style={{
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    color: "#000000ff",
                  }}
                >
                  Default Currency
                </Form.Label>
                <Form.Select
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="shadow-sm"
                  style={{
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    borderRadius: "8px",
                    padding: "0.4rem 0.8rem",
                    borderColor: "#000000ff",
                  }}
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="rounded-3"
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#007bff", fontWeight: "700" }}>
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoFocus
                style={{ fontSize: "1rem" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{ fontSize: "1rem" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEdit(false)}
            style={{ fontWeight: "600", letterSpacing: "0.03em" }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={saveChanges}
            style={{ fontWeight: "700", letterSpacing: "0.05em" }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
