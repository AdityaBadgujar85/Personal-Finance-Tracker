import './App.css';
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from './components/Header-Footer/NavBar';
import Footer from './components/Header-Footer/Footer';
import DashBoard from './components/DashBoard/DashBoard';
import Transaction from './components/Transaction/Transaction';
import Budget from './components/Budget/Budget';
import Profile from './components/Profile/Profile';

function App() {
  const [currency, setCurrency] = useState("₹"); 
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<DashBoard currency={currency} transactions={transactions} />} />
        <Route path='/Transaction' element={<Transaction currency={currency} transactions={transactions} setTransactions={setTransactions} />} />
        <Route path='/Budget' element={<Budget currency={currency} transactions={transactions} budgets={budgets} setBudgets={setBudgets} />} />
        <Route path="/Profile" element={<Profile currency={currency} setCurrency={setCurrency} transactions={transactions} />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
