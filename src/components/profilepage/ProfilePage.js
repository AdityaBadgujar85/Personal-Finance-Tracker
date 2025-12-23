import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import classes from "./Profile.module.css";

function ProfilePage() {
  const [currency, setCurrency] = useState("₹");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convert(value) {
    return (value * rates[currency]).toFixed(2);
  }
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile && savedProfile.currency) {
      setCurrency(savedProfile.currency);
    }

    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let inc = 0;
    let exp = 0;

    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === "Income") {
        inc += Number(transactions[i].amount || 0);
      } else {
        exp += Number(transactions[i].amount || 0);
      }
    }

    setIncome(inc);
    setExpense(exp);
    setLoaded(true);
  }, []);


  useEffect(() => {
    if (loaded) {
      localStorage.setItem("profile", JSON.stringify({ currency }));
    }
  }, [currency, loaded]);

  const remaining = income - expense;

  return (
    <Container className={classes.mainContainer}>
      <Card className={classes.profileWrapper}>
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
            <h3>{currency} {convert(income)}</h3>
          </Col>

          <Col md={3}>
            <p className={classes.statTitle}>Total Expense</p>
            <h3>{currency} {convert(expense)}</h3>
          </Col>

          <Col md={3}>
            <p className={classes.statTitle}>Remaining</p>
            <h3>{currency} {convert(remaining)}</h3>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default ProfilePage;
