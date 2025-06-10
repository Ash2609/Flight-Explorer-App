import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentGatewayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    return <p>No booking data found. Please start your booking again.</p>;
  }

  const handlePayment = () => {
    // Mark as confirmed
    const confirmedBooking = { ...bookingData, status: "Confirmed" };

    // Save booking to localStorage
    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    allBookings.push(confirmedBooking);
    localStorage.setItem("bookings", JSON.stringify(allBookings));

    // Navigate to confirmation page with booking ID
    navigate("/booking-confirmation", { state: { bookingId: confirmedBooking.id } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Gateway</h2>
      <p>Please confirm your payment for the flight booking below:</p>
      <ul>
        <li>From: {bookingData.from}</li>
        <li>To: {bookingData.to}</li>
        <li>Date: {bookingData.date}</li>
        <li>Passenger: {bookingData.passengerName}</li>
        <li>Amount: ₹{bookingData.price}</li>
      </ul>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentGatewayPage;
