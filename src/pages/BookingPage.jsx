// Improved BookingPage.js for Scenario 3: Booking and Payment Workflow

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    const found = storedFlights.find((f) => f.id === Number(flightId));
    setFlight(found);
    setLoading(false);
  }, [flightId]);

  const generateBookingId = () => {
    return 'BK' + Math.floor(100000 + Math.random() * 900000);
  };

  const handlePayment = () => {
    if (!passengerName.trim() || !passengerEmail.trim()) {
      alert("Please enter passenger name and email.");
      return;
    }

    setProcessingPayment(true);
    setPaymentStatus(null);

    setTimeout(() => {
      const isSuccess = Math.random() < 0.8; // 80% success chance
      if (isSuccess) {
        const newBookingId = generateBookingId();
        setBookingId(newBookingId);
        setPaymentStatus("success");

        const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const bookingDetails = {
          id: newBookingId,
          flightId: flight.id,
          passengerName,
          passengerEmail,
          price: flight.price,
          from: flight.from,
          to: flight.to,
          airline: flight.airline,
          date: new Date().toISOString(),
          status: "confirmed",
        };
        localStorage.setItem("bookings", JSON.stringify([...existingBookings, bookingDetails]));

        // Update flight bookedSeats count
        const updatedFlights = JSON.parse(localStorage.getItem("flights")) || [];
        const updated = updatedFlights.map(f => f.id === flight.id ? { ...f, bookedSeats: (f.bookedSeats || 0) + 1 } : f);
        localStorage.setItem("flights", JSON.stringify(updated));
      } else {
        setPaymentStatus("failure");
      }
      setProcessingPayment(false);
    }, 2000);
  };

  if (loading) return <div>Loading flight details...</div>;
  if (!flight) return <div>Flight not found.</div>;

  if (paymentStatus === "success") {
    return (
      <div>
        <h2>Booking Confirmed!</h2>
        <p>Thank you, {passengerName}. Your booking ID is <strong>{bookingId}</strong>.</p>
        <p>Flight: {flight.from} → {flight.to} ({flight.airline})</p>
        <p>Price Paid: ₹{flight.price}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Booking Flight</h2>
      <p>
        From: {flight.from} <br />
        To: {flight.to} <br />
        Price: ₹{flight.price} <br />
        Airline: {flight.airline} <br />
        Stops: {flight.stops || "Non-stop"}
      </p>

      <h3>Passenger Details</h3>
      <input
        type="text"
        placeholder="Passenger Name"
        value={passengerName}
        onChange={(e) => setPassengerName(e.target.value)}
        disabled={processingPayment}
      /><br />

      <input
        type="email"
        placeholder="Passenger Email"
        value={passengerEmail}
        onChange={(e) => setPassengerEmail(e.target.value)}
        disabled={processingPayment}
      /><br />

      <button onClick={handlePayment} disabled={processingPayment}>
        {processingPayment ? "Processing Payment..." : `Pay ₹${flight.price}`}
      </button>

      {paymentStatus === "failure" && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Payment failed. Please try again.
        </p>
      )}
    </div>
  );
};

export default BookingPage;
