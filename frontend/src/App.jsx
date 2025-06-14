import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Welcome from "./Welcome.jsx";
import PrivateRoute from "./PrivateRoute.jsx"

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
