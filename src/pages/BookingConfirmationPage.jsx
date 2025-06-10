import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/dashboard/user"); // redirect if no bookingId
      return;
    }
    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const foundBooking = allBookings.find((b) => b.id === bookingId);
    setBooking(foundBooking);
  }, [bookingId, navigate]);

  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Booking Confirmed!</h2>
      <p>Your flight booking has been confirmed with the following details:</p>
      <ul>
        <li>Booking ID: {booking.id}</li>
        <li>From: {booking.from}</li>
        <li>To: {booking.to}</li>
        <li>Date: {booking.date}</li>
        <li>Passenger: {booking.passengerName}</li>
        <li>Status: ✅ {booking.status}</li>
        <li>Amount Paid: ₹{booking.price}</li>
      </ul>
      <button onClick={() => navigate("/dashboard/user")}>Back to Dashboard</button>
    </div>
  );
};

export default BookingConfirmationPage;
