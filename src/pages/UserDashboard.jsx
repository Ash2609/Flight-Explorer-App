import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import SearchFlights from "./SearchFlights";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setUserEmail(user?.email || "");

    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const userBookings = allBookings.filter((b) => b.email === user?.email);
    setBookings(userBookings);
  }, []);

  // Automatically generate price when from, to, and date are filled
  useEffect(() => {
    if (from && to && date) {
      const randomPrice = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      setPrice(randomPrice);
    } else {
      setPrice("");
    }
  }, [from, to, date]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date || !passengerName || !price) {
      alert("Please fill all booking details.");
      return;
    }

    const bookingData = {
      id: Date.now(),
      email: userEmail,
      from,
      to,
      date,
      passengerName,
      price,
      status: "Pending Payment",
    };

    navigate("/payment-gateway", { state: { bookingData } });
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {userEmail}</h2>

      <div className="dashboard-tabs">
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("book")}
            className={`tab-button ${activeTab === "book" ? "active" : ""}`}
          >
            Book a Flight
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`tab-button ${activeTab === "view" ? "active" : ""}`}
          >
            Your Bookings
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`tab-button ${activeTab === "search" ? "active" : ""}`}
          >
            Search Flights
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {activeTab === "book" && (
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <div className="form-grid">
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Passenger Name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              readOnly
            />
          </div>
          <button type="submit" className="submit-button">
            Book Ticket
          </button>
        </form>
      )}

      {activeTab === "view" && (
        <section className="booking-list">
          {bookings.length === 0 ? (
            <p className="empty-msg">No bookings found.</p>
          ) : (
            bookings.map((booking, index) => (
              <div key={booking.id} className="booking-card">
                <p><strong>{index + 1}. Booking ID:</strong> {booking.id}</p>
                <p><strong>Route:</strong> {booking.from} → {booking.to}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Passenger:</strong> {booking.passengerName}</p>
                <p><strong>Status:</strong> {booking.status === "Confirmed" ? "✅ Confirmed" : "⏳ Pending Payment"}</p>
                <p><strong>Amount Paid:</strong> ₹{booking.price}</p>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === "search" && (
        <div className="search-tab-container">
          <SearchFlights />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
