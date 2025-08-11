import logo from './logo.svg';
import './App.css';
import NavBar from './components/Header-Footer/NavBar';
import Footer from './components/Header-Footer/Footer';
import Dashboard from './components/DashBoard/Dashboard';
import DashBoardMain from './components/DashBoard/DashBoardMain';
import { Route, Routes } from 'react-router-dom';
import Transaction from './components/Transaction/Transaction';
import Budget from './components/Budget/Budget';
import Profile from './components/Profile/Profile';
import { useState } from 'react';
function App() {
   const [currency, setCurrency] = useState("₹"); 
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<DashBoardMain currency={currency}/>}/>
        <Route path='/Transaction' element={<Transaction currency={currency} />}/>
        <Route path='/Budget' element={<Budget currency={currency}/>}/>
        <Route path='/Profile' element={<Profile currency={currency} setCurrency={setCurrency}/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
