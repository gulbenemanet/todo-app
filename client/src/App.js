import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login";
import Home from "./component/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todo" element={<Home />} />
      </Routes>
      
    </Router>
  );
}

export default App;
