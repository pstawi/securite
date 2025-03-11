import logo from './logo.svg';
import './App.css';
import Register from './components/register';
import Login from './components/Login';
import Accueil from './components/Accueil';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Accueil />} />

        </Routes>
    </BrowserRouter>
   
  );
}

export default App;
