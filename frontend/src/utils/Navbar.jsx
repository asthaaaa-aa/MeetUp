import React from 'react'
import "../styles/landingPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const router = useNavigate()
  return (
    <nav>
        <p className="logo">MeetUp</p>

        <div className="auth-buttons">
          {localStorage.getItem("token") ? (
            <div
              onClick={() => {
                localStorage.removeItem("token");
                router("/");
              }}
              role="button"
            >
              <p>Logout</p>
            </div>
          ) : (
            <div>
              <div
                onClick={() => {
                  router("/auth");
                }}
                role="button"
                className="login-button"
              >
                <p>Login</p>
              </div>
              <p
                className="reg-button"
                onClick={() => {
                  router("/auth");
                }}
              >
                Register
              </p>
            </div>
          )}
          {/* <p className="reg-button">Register</p> */}
        </div>
      </nav>
  )
}
