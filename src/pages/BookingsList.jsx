import React, { useEffect, useState } from "react";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(savedBookings);
  }, []);

  if (bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.bookingId} className="border p-4 rounded shadow">
            <p><strong>Booking ID:</strong> {b.bookingId}</p>
            <p><strong>Passenger:</strong> {b.passengerName}</p>
            <p><strong>Email:</strong> {b.passengerEmail}</p>
            <p><strong>Flight:</strong> {b.flightFrom} → {b.flightTo}</p>
            <p><strong>Airline:</strong> {b.airline}</p>
            <p><strong>Price Paid:</strong> ₹{b.price}</p>
            <p><strong>Date:</strong> {new Date(b.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsList;
