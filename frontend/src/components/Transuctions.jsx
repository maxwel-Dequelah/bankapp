// TransactionHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const backend_url = import.meta.env.VITE_APP_API_URL;

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backend_url}/api/balance/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalanceData(response.data);
        if (response.data.length > 0) {
          setSelectedAccount(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

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

    fetchBalanceData();
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.account === selectedAccount?.id
  );

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6 text-green-700">
        Transaction History
      </h2>

      {/* Account Selector */}
      <div className="mb-4">
        <label htmlFor="accountSelect" className="text-gray-700 mr-2">
          Select Account:
        </label>
        <select
          id="accountSelect"
          value={selectedAccount?.accountNumber || ""}
          onChange={(e) =>
            setSelectedAccount(
              balanceData.find(
                (account) => account.accountNumber === e.target.value
              )
            )
          }
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {balanceData.map((account) => (
            <option key={account.accountNumber} value={account.accountNumber}>
              Account {account.accountNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        {filteredTransactions.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Transaction Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const transactionDate = dayjs(transaction.date);
                const formattedDate = transactionDate.format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                return (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2">{formattedDate}</td>
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
          <p className="text-gray-500">No transactions for this account</p>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
