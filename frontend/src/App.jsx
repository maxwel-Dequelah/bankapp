import { StrictMode, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/siginup";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./components/DashboardHome";
import BankCards from "./components/MyCards";
import TransactionHistory from "./components/Transuctions";
import TransferFunds from "./components/TransferFunds";
import Homepage from "./components/Homepage";

// Private route component
const PrivateRoute = ({ element, ...rest }) => {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  return isLoggedIn ? element : <Navigate to="/login" />;
};

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* Redirect to /dashboard if already logged in */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/signup" element={<SignUp />} />

          {/* Protect dashboard route */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<DashboardLayout />} />}
          >
            <Route path="/dashboard/" element={<DashboardHome />} />
            <Route path="/dashboard/my-cards" element={<BankCards />} />
            <Route
              path="/dashboard/my-transactions"
              element={<TransactionHistory />}
            />
            <Route path="/dashboard/transact" element={<TransferFunds />} />
          </Route>

          {/* Redirect any other path to /login if not logged in */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Router>
    </StrictMode>
  );
}

export default App;
