// /pages/PassengerFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PassengerFormPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const allFlights = JSON.parse(localStorage.getItem("flights")) || [];
    const selected = allFlights.find(f => f.id === Number(flightId));
    if (!selected) return alert("Flight not found");
    setFlight(selected);
  }, [flightId]);

  const handleContinue = () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }
    const data = { name, email, flightId };
    localStorage.setItem("pendingBooking", JSON.stringify(data));
    navigate("/payment-gateway");
  };

  return flight ? (
    <div>
      <h2>Passenger Details</h2>
      <p>Flight: {flight.from} → {flight.to}</p>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleContinue}>Continue to Payment</button>
    </div>
  ) : (
    <p>Loading flight...</p>
  );
};

export default PassengerFormPage;
