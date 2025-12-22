import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import classes from "./Transaction.module.css";

function Transaction(props) {
  const { transactions, EditFunction, DeleteFunction } = props;

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = profile.currency || "₹";

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convert(amount) {
    return (amount * rates[currency]).toFixed(2);
  }

  return (
    <Container className="mt-5 p-0">
      <Row>
        <Col>
          <h2>Transactions</h2>

          <div className={classes.tableWrapper}>
            <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No transaction yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.type}</td>
                      <td>
                        {currency} {convert(t.amount)}
                      </td>
                      <td>{t.category}</td>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>
                        <Button size="sm" variant="outline-secondary" onClick={() => EditFunction(i)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => DeleteFunction(i)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Transaction;
