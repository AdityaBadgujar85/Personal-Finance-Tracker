import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Transaction.module.css";
import { MdEdit, MdDelete } from "react-icons/md";

function Transaction(props) {
  const { transactions, EditFunction, DeleteFunction } = props;

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedCurrency = profile.currency || "₹";

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function showAmount(amount, fromCurrency) {
    const sourceCurrency = fromCurrency || "₹";

    if (sourceCurrency === selectedCurrency) {
      return Number(amount).toFixed(2);
    }

    const amountInINR = Number(amount) / rates[sourceCurrency];
    return (amountInINR * rates[selectedCurrency]).toFixed(2);
  }

  return (
    <Container className="mt-3 p-0">
      <Row>
        <Col>
          <div className={classes.tableDesign}>
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No transaction yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, index) => (
                    <tr key={index}>
                      <td>{t.type}</td>
                      <td className={classes.amount}>
                        {selectedCurrency}{" "}
                        {showAmount(t.amount, t.currency)}
                      </td>
                      <td>
                        <span className={classes.tag}>
                          {t.category || "Other"}
                        </span>
                      </td>
                      <td>{t.date}</td>
                      <td>{t.description || "-"}</td>
                      <td>
                        <div className={classes.actions}>
                          <span className={classes.actionBtn} onClick={() => EditFunction(index)}>
                            <MdEdit size={20}/>
                          </span>
                          <span className={classes.actionBtn} onClick={() => DeleteFunction(index)}>
                            <MdDelete size={20}/>
                          </span>
                        </div>
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
