import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdHome } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { PiBankFill } from "react-icons/pi";
import { FaHistory, FaPowerOff } from "react-icons/fa"; // Import FaPowerOff icon
import { IoSettings } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Navigate, useNavigate } from "react-router-dom";
import logo2 from "../assets/logo2.webp";

dayjs.extend(relativeTime);

const backend_url = import.meta.env.VITE_APP_API_URL;

function Dashboard() {
  const [balanceData, setBalanceData] = useState({ balance: "0.00", user: {} });
  const [transactions, setTransactions] = useState([]);
  const [accountCount, setAccountCount] = useState(1);
  const navigate = useNavigate();

  // Function to handle logout and redirect to login page with a hard load
  const handleLogout = () => {
    localStorage.clear();
    window.location.assign("/login"); // Hard load to clear authenticated state
  };

  // Fetch balance and user data
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backend_url}/api/balance/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalanceData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout();
        } else {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, []);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${backend_url}/api/gettransactions/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout();
        } else {
          console.error("Error fetching transactions:", error);
        }
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <img src={logo2} alt="SQLD Logo" className="w-48 h-40 mx-0 " />
          </div>
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <IoHome className="text-xl" />
              <a href="#home" className="text-blue-500">
                Home
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <PiBankFill className="text-xl" />
              <a href="#my-bank" className="text-gray-600">
                My Bank
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaHistory className="text-xl" />
              <a href="#transaction-history" className="text-gray-600">
                Transaction History
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaMoneyBillTransfer className="text-xl" />
              <a href="#payment-transfer" className="text-gray-600">
                Payment Transfer
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <IoSettings className="text-xl" />
              <a href="#settings" className="text-gray-600">
                Settings
              </a>
            </div>
          </nav>
        </div>
        <div
          onClick={handleLogout}
          className="mt-8 flex items-center space-x-2 text-red-500 cursor-pointer"
        >
          <FaPowerOff className="text-xl" />
          <button>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">
            {balanceData.user.first_name}
          </h1>
          <button className="text-blue-500">Edit Profile</button>
        </div>
        <p className="mb-6 text-gray-600">
          Access & manage your account and transaction efficiently
        </p>

        {/* Balance and Accounts */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center">
            <img src={logo2} alt="Bank Icon" className="w-16 h-16 mr-4" />
            <div>
              <p className="font-semibold">{accountCount} Bank Accounts</p>
              <p>Total Current Balance</p>
              <p className="text-2xl font-bold">${balanceData.balance}</p>
            </div>
          </div>
          <button className="text-blue-500">+ Add Bank</button>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
            {transactions.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Transaction Type</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 3).map((transaction) => {
                    const transactionDate = dayjs(transaction.date);
                    const timeAgo = transactionDate.isAfter(
                      dayjs().subtract(1, "day")
                    )
                      ? transactionDate.fromNow()
                      : transactionDate.format("YYYY-MM-DD HH:mm:ss");
                    return (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2">{timeAgo}</td>
                        <td className="px-4 py-2">
                          {transaction.transaction_type}
                        </td>
                        <td className="px-4 py-2">{transaction.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No transactions yet</p>
            )}
          </div>
          {transactions.length > 0 && (
            <a href="#view-all" className="text-blue-500">
              VIEW ALL
            </a>
          )}
        </div>

        {/* Bank Card */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-center justify-between">
          <p className="text-gray-600">Bank Name</p>
          <div className="text-right">
            <p className="text-lg font-semibold">1234 5678 9876 5432</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
