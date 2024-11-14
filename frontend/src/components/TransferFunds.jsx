import React, { useState, useEffect } from "react";
import axios from "axios";

// Create a custom axios instance with base URL from the VITE environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

const TransferFunds = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  useEffect(() => {
    api
      .get("/api/balance/")
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        setError("Failed to load accounts. Please try again later.");
        console.error("Error fetching accounts:", error);
      });
  }, []);

  const handleTransfer = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!fromAccount || !toAccount || !amount) {
      setError("All fields must be filled.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    api
      .post("/api/transactions/", {
        from_account: fromAccount,
        to_account: toAccount,
        amount: parseFloat(amount),
      })
      .then((response) => {
        setSuccessMessage("Transfer successful!");
        setAmount("");
        setFromAccount("");
        setToAccount("");
      })
      .catch((error) => {
        if (error.response) {
          setError(
            error.response.data.message ||
              "An error occurred during the transfer."
          );
        } else if (error.request) {
          setError(
            "No response from the server. Please check your internet connection."
          );
        } else {
          setError("An error occurred. Please try again later.");
        }
        console.error("Transfer error:", error);
      });
  };

  return (
    <div className="flex justify-center pt-10 pb-20  bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Transfer Funds
        </h2>

        {error && (
          <div
            className="bg-red-100 text-red-700 px-4 
          py-3 rounded mb-6 text-sm"
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div
            className="bg-green-100 text-green-700
           px-4 py-3 rounded mb-6 text-sm"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label
              htmlFor="fromAccount"
              className="block text-gray-700 font-medium mb-2"
            >
              From Account:
            </label>
            <select
              id="fromAccount"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md 
              text-gray-800 focus:outline-none focus:ring-2
               focus:ring-green-600"
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option
                  key={account.accountNumber}
                  value={account.accountNumber}
                >
                  {account.accountNumber} - Balance: {account.balance}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="toAccount"
              className="block text-gray-700 font-medium mb-2 "
            >
              To Account Number:
            </label>
            <input
              type="text"
              id="toAccount"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md
               text-gray-800 focus:outline-none focus:ring-2
                focus:ring-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-gray-700 font-medium mb-2"
            >
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="5"
              className="w-full px-4 py-3 border rounded-md
               text-gray-800 
              focus:outline-none focus:ring-2
               focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-700 text-white 
            font-semibold rounded-md hover:bg-green-800 focus:outline-none 
            focus:ring-2 focus:ring-green-950"
          >
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferFunds;
