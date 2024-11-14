import React from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/logo3.png";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-green-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-start px-6">
          <img
            src={logo2}
            className="w-32 h-28 mb-4 cursor-pointer"
            alt="logo-Image"
          />

          <ul className="flex space-x-8">
            <li className="hover:text-green-300 cursor-pointer">Services</li>
            <li className="hover:text-green-300 cursor-pointer">About</li>
            <li
              onClick={() => {
                navigate("/login");
              }}
              className="hover:text-green-300 cursor-pointer"
            >
              Login
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-green-900 text-white h-[80vh] flex items-center">
        <div className="container mx-auto px-6 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Secure, Reliable Banking with SQLD Bank
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Join millions of satisfied customers who trust SQLD Bank with their
            finances.
          </p>

          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8 text-green-900">
            Our Features
          </h3>
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                Secure Transactions
              </h4>
              <p>
                Our state-of-the-art encryption ensures your transactions are
                safe and secure.
              </p>
            </div>
            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                24/7 Support
              </h4>
              <p>
                Our dedicated team is available around the clock to assist you
                with any needs.
              </p>
            </div>
            <div className="p-6 bg-gray-50 shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                Easy Account Management
              </h4>
              <p>
                Manage your account, transfer funds, and make deposits with
                ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8 text-green-900">
            Our Services
          </h3>
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                Personal Banking
              </h4>
              <p>
                From checking accounts to personal loans, we have everything to
                meet your needs.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                Business Banking
              </h4>
              <p>Secure solutions to help your business grow and thrive.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h4 className="text-xl font-bold mb-2 text-green-700">
                Investment Planning
              </h4>
              <p>
                Plan for your future with our expert investment and wealth
                management options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2024 SQLD Bank. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-green-300">
              Facebook
            </a>
            <a href="#" className="hover:text-green-300">
              Twitter
            </a>
            <a href="#" className="hover:text-green-300">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
