import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockFlights from "../data/mockFlights";
import "./SearchFlights.css";

const SearchFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [passengerName, setPassengerName] = useState("");

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setFlights(mockFlights);
    setFilteredFlights(mockFlights);
  }, []);

  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  const getTimeSlot = (timeStr) => {
    const hour = parseInt(timeStr.split(":")[0], 10);
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };

  const handleSearch = () => {
    let results = flights.filter(flight =>
      flight.from.toLowerCase().includes(from.toLowerCase()) &&
      flight.to.toLowerCase().includes(to.toLowerCase())
    );

    // Apply filters
    if (minPrice) results = results.filter(f => f.price >= parseInt(minPrice));
    if (maxPrice) results = results.filter(f => f.price <= parseInt(maxPrice));
    if (selectedAirlines.length > 0) results = results.filter(f => selectedAirlines.includes(f.airline));
    if (selectedStops !== "") {
      if (selectedStops === "2+") results = results.filter(f => f.stops >= 2);
      else results = results.filter(f => f.stops === parseInt(selectedStops));
    }
    if (selectedTimeSlot) {
      results = results.filter(f => getTimeSlot(f.departureTime) === selectedTimeSlot);
    }

    setFilteredFlights(results);
  };

  const handleBookNow = (flight) => {
    if (!passengerName) {
      alert("Please enter passenger name before booking.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const bookingData = {
      id: Date.now(),
      email: user?.email || "unknown",
      from: flight.from,
      to: flight.to,
      date: flight.date || new Date().toISOString().split("T")[0],
      passengerName,
      price: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      status: "Pending Payment",
    };

    navigate("/payment-gateway", { state: { bookingData } });
  };

  const handleAirlineToggle = (airline) => {
    setSelectedAirlines(prev =>
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search Flights</h2>

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
        <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
          <option value="oneway">One-way</option>
          <option value="round">Round-trip</option>
          <option value="multi">Multi-city</option>
        </select>
        <input
          type="text"
          placeholder="Passenger Name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
        />
      </div>

      {/* Advanced Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Price Range (₹):</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Airlines:</label>
          {uniqueAirlines.map(airline => (
            <label key={airline}>
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
              />
              {airline}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <label>Stops:</label>
          <select value={selectedStops} onChange={(e) => setSelectedStops(e.target.value)}>
            <option value="">All</option>
            <option value="0">Non-stop</option>
            <option value="1">1 Stop</option>
            <option value="2+">2+ Stops</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Departure Time:</label>
          <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
            <option value="">All</option>
            <option value="Morning">Morning (5AM–12PM)</option>
            <option value="Afternoon">Afternoon (12PM–5PM)</option>
            <option value="Evening">Evening (5PM–9PM)</option>
            <option value="Night">Night (9PM–5AM)</option>
          </select>
        </div>
      </div>

      <button onClick={handleSearch}>Search</button>

      <div className="flight-list">
        {filteredFlights.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          filteredFlights.map((flight) => (
            <div key={flight.id} className="flight-card">
              <div>
                <p className="flight-route">{flight.from} → {flight.to}</p>
                <p>Airline: {flight.airline}</p>
                <p>Stops: {flight.stops}</p>
                <p>Departure: {flight.departureTime}</p>
                <p>Price: ₹{flight.price}</p>
                
                <p>Seats Available: {flight.seatsAvailable}</p>
                <p>Seats Booked: {flight.seatsBooked}</p>
              </div>
              <button onClick={() => handleBookNow(flight)}>Book Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchFlights;
