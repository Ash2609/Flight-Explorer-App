import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ from: "", to: "", date: "", seats: "", bookedSeats: "" });
  const [editId, setEditId] = useState(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds

  const navigate = useNavigate();
  const logoutTimer = useRef(null);
  const countdownInterval = useRef(null);

  // Format countdown into mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Reset both logout and countdown timers
  const resetTimers = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setCountdown(300); // Reset countdown to 5 minutes

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    logoutTimer.current = setTimeout(() => {
      alert("Session expired due to inactivity.");
      localStorage.removeItem("loggedInUser");
      navigate("/login");
    }, 300000); // 5 minutes
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimers)
    );

    resetTimers(); // Start on load

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimers)
      );
      clearTimeout(logoutTimer.current);
      clearInterval(countdownInterval.current);
    };
  }, [navigate]);

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    setFlights(storedFlights);

    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  const saveFlights = (updated) => {
    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.date || !form.seats)
      return alert("All fields required.");

    if (editId) {
      const updated = flights.map((f) =>
        f.id === editId ? { ...f, ...form } : f
      );
      saveFlights(updated);
      setEditId(null);
    } else {
      const newFlight = { id: Date.now(), ...form };
      saveFlights([...flights, newFlight]);
    }
    setForm({ from: "", to: "", date: "", seats: "" });
  };

  const handleEdit = (flight) => {
    setForm({
      from: flight.from,
      to: flight.to,
      date: flight.date,
      seats: flight.seats,
    });
    setEditId(flight.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this flight?")) {
      const updated = flights.filter((f) => f.id !== id);
      saveFlights(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.email.toLowerCase().includes(filter.toLowerCase()) ||
      b.from.toLowerCase().includes(filter.toLowerCase()) ||
      b.to.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "15px", fontWeight: "bold", color: "#e74c3c" }}>
            Auto Logout In: {formatTime(countdown)}
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddOrEdit} className="form-grid">
        <input
          placeholder="From"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
        />
        <input
          placeholder="To"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="number"
          placeholder="Seats"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
        />
        <input
          type="number"
          placeholder="Booked Seats"
          value={form.bookedSeats}
          onChange={(e) => setForm({ ...form, bookedSeats: e.target.value })}
        />
        <button type="submit" className="submit-btn">
          {editId ? "Update Flight" : "Add Flight"}
        </button>
      </form>

      <h2>All Flights</h2>
      <div>
        {flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <p>
              <strong>{flight.from}</strong> → <strong>{flight.to}</strong> on{" "}
              {flight.date}
            </p>
            <p>
              Seats: {flight.seats} | Booked: {flight.bookedSeats}
            </p>
            
            <div className="actions">
              <button onClick={() => handleEdit(flight)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(flight.id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>All Bookings</h2>
      <input
        type="text"
        placeholder="Search by email, from, or to"
        className="search-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        filteredBookings.map((b, i) => (
          <div key={b.id} className="booking-card">
            <p>
              <strong>{i + 1}. Booking ID:</strong> {b.id}
            </p>
            <p>
              <strong>User:</strong> {b.email}
            </p>
            <p>
              <strong>Route:</strong> {b.from} → {b.to}
            </p>
            <p>
              <strong>Date:</strong> {b.date}
            </p>
            <p>
              <strong>Passenger:</strong> {b.passengerName}
            </p>
            <p>
              <strong>Price:</strong> ₹{b.price}
            </p>
            <p>
              <strong>Status:</strong> {b.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
