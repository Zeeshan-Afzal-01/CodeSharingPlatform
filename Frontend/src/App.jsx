import React from "react"
import Navbar from './components/header/navbar'
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Footer from "./components/footer/footer";
import LandingPage from "./components/landingPage/landingPage";
function App() {
  //logic
 

  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
    
    </>
  )
}

export default App
