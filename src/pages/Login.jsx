import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decryptPassword } from "../utils/crypto";
import FlightLogo from "../assets/Flight-logo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      alert("User not found.");
      return;
    }

    const decrypted = decryptPassword(user.password);
    if (decrypted !== password) {
      alert("Incorrect password.");
    } else {
      // Removed alert to prevent blocking navigation
      console.log("Login successful!");

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      if (user.role === "admin") {
        console.log("Navigating to /admin");
        navigate("/admin");
      } else {
        console.log("Navigating to /dashboard/user");
        navigate("/dashboard/user");
      }
    }
  };

  return (
    <div className="form-container">
      <img
                src={FlightLogo}
                alt="Flight Logo"
                style={{ width: "100px",height:"100px", margin: "0 auto", display: "block" }}
              />
      <h3>Login</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/signup">Sign up </Link>
      </p>
    </div>
  );
};

export default Login;
