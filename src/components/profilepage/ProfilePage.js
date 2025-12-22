import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import classes from "./Profile.module.css";

function ProfilePage() {
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    currency: "₹",
  });

  const [editMode, setEditMode] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const rates = {
    "₹": 1,
    "$": 0.012,
    "€": 0.011,
    "£": 0.0095,
  };

  function convert(amount) {
    return (amount * rates[profileDetails.currency]).toFixed(2);
  }

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) {
      setProfileDetails(savedProfile);
    }

    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === "Income") {
        income += Number(transactions[i].amount);
      }

      if (transactions[i].type === "Expense") {
        expense += Number(transactions[i].amount);
      }
    }

    setTotalIncome(income);
    setTotalExpense(expense);
  }, []);

  const savings = totalIncome - totalExpense;

  function updateProfile(e) {
    setProfileDetails({
      ...profileDetails,
      [e.target.name]: e.target.value,
    });
  }

  function saveProfile() {
    localStorage.setItem("profile", JSON.stringify(profileDetails));
    setEditMode(false);
  }

  return (
    <Container className={classes.mainContainer}>
      <h2 className={classes.heading}>Profile</h2>

      <Row>
        <Col md={6}>
          <Card className={classes.profileCard}>
            <Card.Body>
              <img src={require("../Img/Profile.jpg")} className={classes.profileImg} alt="Profile"/>
              <h4>User Details</h4>
              <div className={classes.field}>
                <label>Name</label>
                {editMode ? (
                  <input name="name" value={profileDetails.name} onChange={updateProfile}/>
                ) : (
                  <p>{profileDetails.name}</p>
                )}
              </div>

              <div className={classes.field}>
                <label>Email</label>
                {editMode ? (
                  <input name="email" value={profileDetails.email} onChange={updateProfile}/>
                ) : (
                  <p>{profileDetails.email}</p>
                )}
              </div>

              <div className={classes.field}>
                <label>Currency</label>
                {editMode ? (
                  <select name="currency" value={profileDetails.currency} onChange={updateProfile}>
                    <option value="₹">₹ Rupee</option>
                    <option value="$">$ Dollar</option>
                    <option value="€">€ Euro</option>
                    <option value="£">£ Pound</option>
                  </select>
                ) : (
                  <p>{profileDetails.currency}</p>
                )}
              </div>

              <Button className={classes.editBtn} onClick={editMode ? saveProfile : () => setEditMode(true)}>
                {editMode ? "Save Profile" : "Edit Profile"}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={classes.summaryCard}>
            <Card.Body>
              <h4>Total Expense</h4>
              <p className={classes.amount}>
                {profileDetails.currency} {convert(totalExpense)}
              </p>
            </Card.Body>
          </Card>

          <Card className={classes.summaryCard}>
            <Card.Body>
              <h4>Total Savings</h4>
              <p className={classes.amount}>
                {profileDetails.currency} {convert(savings)}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
