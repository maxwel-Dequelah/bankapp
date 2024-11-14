import React from "react";
import { FaHistory, FaPowerOff } from "react-icons/fa";
import { IoHome, IoSettings } from "react-icons/io5";
import { PiBankFill } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import logo2 from "../assets/logo2.webp";
import { NavLink, Outlet } from "react-router-dom";

function DashboardLayout() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.assign("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <img src={logo2} alt="SQLD Logo" className="w-48 h-40 mx-0" />
          </div>
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <IoHome className="text-xl" />
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-green-700 font-semibold" : "text-gray-600"
                }
              >
                Home
              </NavLink>
            </div>
            <div className="flex items-center space-x-4">
              <PiBankFill className="text-2xl" />
              <NavLink
                to="/dashboard/my-cards"
                className={({ isActive }) =>
                  isActive ? "text-green-700 font-semibold" : "text-gray-600"
                }
              >
                My cards
              </NavLink>
            </div>
            <div className="flex items-center space-x-4">
              <FaHistory className="text-2xl" />
              <NavLink
                to="/dashboard/my-transactions"
                className={({ isActive }) =>
                  isActive ? "text-green-700 font-semibold" : "text-gray-600"
                }
              >
                Transaction History
              </NavLink>
            </div>
            <div className="flex items-center space-x-4">
              <FaMoneyBillTransfer className="text-2xl" />
              <NavLink
                to="/dashboard/transact"
                className={({ isActive }) =>
                  isActive ? "text-green-700 font-semibold" : "text-gray-600"
                }
              >
                Payment Transfer
              </NavLink>
            </div>
            <div className="flex items-center space-x-4">
              <IoSettings className="text-2xl" />
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  isActive ? "text-green-700 font-semibold" : "text-gray-600"
                }
              >
                Settings
              </NavLink>
            </div>
          </nav>
        </div>
        <div
          onClick={handleLogout}
          className="mt-8 flex items-center space-x-2 text-green-700 cursor-pointer"
        >
          <FaPowerOff className="text-xl" />
          <button>Logout</button>
        </div>
      </aside>

      {/* Main Content Area where DashboardHome is injected */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
