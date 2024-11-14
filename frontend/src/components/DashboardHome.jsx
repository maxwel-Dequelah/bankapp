import React, { useEffect, useState } from "react";
import axios from "axios";
import logo3 from "../assets/logo3.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const backend_url = import.meta.env.VITE_APP_API_URL;

function DashboardHome() {
  const [balanceData, setBalanceData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accountCount, setAccountCount] = useState(1);
  const [profile, setProfile] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backend_url}/api/getmyprofile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backend_url}/api/balance/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalanceData(response.data);
        setAccountCount(response.data.length);
        // Set initial selected account
        if (response.data.length > 0) {
          setSelectedAccount(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.assign("/login");
        }
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${backend_url}/api/gettransactions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on selected account
  useEffect(() => {
    if (selectedAccount) {
      setFilteredTransactions(
        transactions.filter(
          (transaction) => transaction.account === selectedAccount.id
        )
      );
    }
  }, [selectedAccount, transactions]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-green-900">
          {profile ? `Welcome ${profile.first_name}!` : "Welcome!"}
        </h1>
        <button className="text-blue-500">Edit Profile</button>
      </div>
      <p className="mb-6 text-green-800">
        Access & manage your account and transaction efficiently
      </p>

      {/* Balance and Accounts */}
      <div className="flex items-center justify-between bg-emerald-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center text-gray-200">
          <img src={logo3} alt="Bank Icon" className="w-28 h-28 mr-2" />
          <div>
            <p className="font-semibold text-gray-200">
              {accountCount} Bank Accounts
            </p>
            <p>
              Current Balance : Account Number {selectedAccount?.accountNumber}
            </p>
            <p className="text-2xl font-bold text-gray-200">
              {balanceData?.find(
                (acc) => acc.accountNumber === selectedAccount.accountNumber
              )?.balance || 0.0}
            </p>
          </div>
        </div>
        <button className=" text-gray-200">+ Add Bank</button>
      </div>

      {/* Select Account */}
      <div className="mb-4">
        <label htmlFor="accountSelect" className="text-gray-900 mr-2">
          Select Account:
        </label>
        <select
          id="accountSelect"
          value={selectedAccount?.accountNumber || ""}
          onChange={(e) =>
            setSelectedAccount(
              balanceData.find(
                (balance) => balance.accountNumber === e.target.value
              )
            )
          }
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {balanceData.map((account) => (
            <option
              key={account.accountNumber}
              value={account.accountNumber}
              className="bg-green-700"
            >
              Account {account.accountNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          {filteredTransactions?.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Transaction Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions?.slice(0, 3).map((transaction) => {
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
        {filteredTransactions?.length > 0 && (
          <a href="#view-all" className="text-blue-500">
            VIEW ALL
          </a>
        )}
      </div>
    </div>
  );
}

export default DashboardHome;
