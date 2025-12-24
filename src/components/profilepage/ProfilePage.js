import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import classes from "./Profile.module.css";

function ProfilePage() {
  const [currency, setCurrency] = useState("₹");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const currencyRates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convertAmount(amount) {
    const rate = currencyRates[currency];
    return (amount * rate).toFixed(2);
  }

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      if (profileData.currency) {
        setCurrency(profileData.currency);
      }
    }

    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let incomeSum = 0;
    let expenseSum = 0;

    for (let index = 0; index < savedTransactions.length; index++) {
      const currentItem = savedTransactions[index];

      if (currentItem.type === "Income") {
        incomeSum = incomeSum + Number(currentItem.amount || 0);
      } else {
        expenseSum = expenseSum + Number(currentItem.amount || 0);
      }
    }

    setTotalIncome(incomeSum);
    setTotalExpense(expenseSum);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("profile",JSON.stringify({
          currency: currency,
        })
      );
    }
  }, [currency, isReady]);

  const remainingAmount = totalIncome - totalExpense;

  return (
    <Container className={classes.mainContainer}>
      <Card className={classes.profileContainer}>
        <Row className={classes.topRow}>
          <Col md={6} className={classes.userInfo}>
            <img src={require("../Img/Profile.jpg")} alt="Profile" className={classes.profileImg}/>
            <div>
              <h4>Aditya Badgujar</h4>
              <p>aditya@gmail.com</p>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className={classes.statsRow}>
          <Col md={3}>
            <p className={classes.statTitle}>Currency</p>
            <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="₹">₹ Rupee</option>
              <option value="$">$ Dollar</option>
              <option value="€">€ Euro</option>
              <option value="£">£ Pound</option>
            </select>
          </Col>

          <Col md={3}>
            <p className={classes.statTitle}>Total Income</p>
            <h3>
              {currency} {convertAmount(totalIncome)}
            </h3>
          </Col>

          <Col md={3}>
            <p className={classes.statTitle}>Total Expense</p>
            <h3>
              {currency} {convertAmount(totalExpense)}
            </h3>
          </Col>

          <Col md={3}>
            <p className={classes.statTitle}>Remaining</p>
            <h3>
              {currency} {convertAmount(remainingAmount)}
            </h3>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProfilePage;
