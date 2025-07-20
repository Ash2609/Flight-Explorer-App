import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../utils/crypto";
import FlightLogo from "../assets/Flight-logo.jpg";
import {Link} from "react-router-dom";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

const handleSignup = () => {
  if (!email || !password || !role) {
    alert("Please fill in all the fields.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    alert("User with this email already exists.");
    return;
  }

  const encryptedPassword = encryptPassword(password);
  const newUser = { email, password: encryptedPassword, role };
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
  navigate("/login");
};


  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* <h2>Flight Explorer App</h2> */}
        <img
          src={FlightLogo}
          alt="Flight Logo"
          style={{ width: "100px",height:"100px", margin: "0 auto", display: "block" }}
        />
        
        <h2>Signup</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleSignup}>Signup</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
