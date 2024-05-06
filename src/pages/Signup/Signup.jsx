import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { axiosinstance } from "../../config";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
    country: "",
    city: "",
    phone: "",
    confirmPassword: ""
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === "confirmPassword") {
      setCredentials((prev) => ({
        ...prev,
        confirmPassword: e.target.value
      }));
    } else {
      setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setPasswordsMatch(false);
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const res = await axiosinstance.post("/auth/register", credentials);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="lInput"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-btn"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="Pays"
          id="country"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="Ville"
          id="city"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="télephone"
          id="phone"
          onChange={handleChange}
          className="lInput"
        />
        {!passwordsMatch && (
          <p className="error-message">{error}</p>
        )}
        <button className="lButton" onClick={handleClick} style={{backgroundColor : "orange"}}>
          Sign up
        </button>
        <Link to="/login">
          <button className="lButton" >login</button>
        </Link>
        <Link to="/">
          <button className="lButton">home</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
