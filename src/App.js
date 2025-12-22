import logo from './logo.svg';
import './App.css';
import NavbarDesign from './components/Navbar-Footer/NavbarDesign';
import Footer from './components/Navbar-Footer/Footer';
import { Route,Routes } from 'react-router-dom';
import TransactionFormPage from './components/TransactionPage/TransactionFormPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import BudgetsPage from './components/Budget/BudgetsPage';
import ProfilePage from './components/profilepage/ProfilePage';


function App() {
  return (
    <div className="App">
      <NavbarDesign/>
      <Routes>
          <Route path='/' element={<DashboardPage/>}/>
          <Route path='/transaction' element={<TransactionFormPage/>}/>
          <Route path='/budget' element={<BudgetsPage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
