import React, { useState } from "react";
import axios from "axios";
const backendurl = import.meta.env.VITE_APP_API_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phoneNumber: "",
    dob: "",
    email: "",
    password: "",
    SSN: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${backendurl}/api/signup/`, formData);
      console.log("Signup successful:", response.data);
      // Add redirect logic here
    } catch (err) {
      const errorMessage =
        err.response?.data?.phoneNumber?.[0] ||
        err.response?.data?.email?.[0] ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBackground py-12 px-6">
      <div className="w-full max-w-2xl space-y-8 bg-customCard p-10 rounded-xl shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-customText">
            Sign up
          </h2>
          <p className="mt-2 text-center text-base text-customSubtext">
            Please Enter Your Details
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-customText"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-customText"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-customText"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-customText"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-customText"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
                />
              </div>
              <div>
                <label
                  htmlFor="SSN"
                  className="block text-sm font-medium text-customText"
                >
                  SSN
                </label>
                <input
                  id="SSN"
                  name="SSN"
                  type="text"
                  required
                  value={formData.SSN}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-customText"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-customText"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-customBorder rounded-md shadow-sm focus:outline-none focus:ring-customPrimary focus:border-customPrimary"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex bg-green-700 justify-center py-2 
              px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-customPrimary 
              hover:bg-customPrimaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPrimary d
              isabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-customSubtext">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-green-700 text-customLink hover:text-customLinkHover"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
