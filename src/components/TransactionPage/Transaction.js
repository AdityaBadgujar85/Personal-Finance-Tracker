import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Transaction.module.css";
import { MdEdit, MdDelete } from "react-icons/md";

function Transaction(props) {
  const transactions = props.transactions;
  const onEdit = props.EditFunction;
  const onDelete = props.DeleteFunction;

  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  const currency = savedProfile.currency || "₹";

  const rateMap = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function getDisplayAmount(amount, fromCurrency) {
    const source = fromCurrency || "₹";

    if (source === currency) {
      return Number(amount).toFixed(2);
    }

    const baseValue = Number(amount) / rateMap[source];
    const finalValue = baseValue * rateMap[currency];

    return finalValue.toFixed(2);
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
                  transactions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.type}</td>
                      <td className={classes.amount}>{currency} {getDisplayAmount(item.amount, item.currency)}</td>
                      <td>
                        <span className={classes.tag}>
                          {item.category || "Other"}
                        </span>
                      </td>
                      <td>{item.date}</td>
                      <td>{item.description || "-"}</td>
                      <td>
                        <div className={classes.actions}>
                          <span className={classes.actionBtn} onClick={() => onEdit(index)}>
                            <MdEdit size={20} />
                          </span>
                          <span className={classes.actionBtn} onClick={() => onDelete(index)}>
                            <MdDelete size={20} />
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
