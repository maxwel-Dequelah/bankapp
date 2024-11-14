// BankCards.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_APP_API_URL; // Your API endpoint for fetching cards

function BankCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/mycards/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCards(response.data); // Set cards with the fetched data
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-green-700">
        My Banks Accounts
      </h1>
      <p className="text-gray-700 mb-4">
        Access & manage your account and transaction efficiently
      </p>
      <hr className="mb-6" />
      {cards.length === 0 ? (
        <p className="text-gray-500">No cards available</p>
      ) : (
        <div className="flex space-x-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-80 h-44 bg-gradient-to-r from-green-700 to-green-950 rounded-lg shadow-lg p-4 text-white"
            >
              <h2 className="text-lg font-semibold">
                {card.bank_name || "Bank Name"}
              </h2>
              <p className="mt-2">{card.card_holder || "Card Holder Name"}</p>
              <div className="flex justify-between mt-2">
                <p>{card.expiration_date || "MM/YY"}</p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                  alt="Mastercard Logo"
                  className="w-8"
                />
              </div>
              <p className="mt-4 text-xl font-semibold tracking-wider">
                {card.card_number || "XXXX XXXX XXXX XXXX"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BankCards;
