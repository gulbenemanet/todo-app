import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login";
import Home from "./component/home";
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todo" element={ <ProtectedRoute><Home /></ProtectedRoute> } />
      </Routes>
      
    </Router>
  );
}

export default App;
