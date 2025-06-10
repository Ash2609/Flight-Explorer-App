// src/hooks/useAutoLogout.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeout = 300000) => {
  const navigate = useNavigate();
  const timer = useRef(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out due to inactivity.");
      navigate("/login");
    }, timeout);
  };

  useEffect(() => {
    // Events to detect user activity
    const events = ["mousemove", "keydown", "click", "scroll"];

    // Attach event listeners
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
};

export default useAutoLogout;
