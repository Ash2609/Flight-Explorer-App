// src/pages/ConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const found = allBookings.find((b) => b.id === bookingId);
    setBooking(found);
  }, [bookingId]);

  if (!booking) return <div>Loading booking details...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Booking Confirmed!</h2>
      <p>Booking ID: <strong>{booking.id}</strong></p>
      <p>Passenger: {booking.passengerName}</p>
      <p>Flight: {booking.flight.from} → {booking.flight.to}</p>
      <p>Airline: {booking.flight.airline}</p>
      <p>Amount Paid: ₹{booking.amount}</p>
      <p>Status: {booking.status}</p>

      <Link to="/dashboard/user" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ConfirmationPage;
