import React, { useContext, useState } from "react";
import "../styles/landingPage.css";
import { Link } from "react-router-dom";
import Navbar from "../utils/Navbar.jsx";
import withAuth from "../utils/WithAuth";
import { useNavigate } from "react-router-dom";
import "../HomePage.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomePage() {
  const router = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    router(`/${meetingCode}`);
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="hero-section">
        <div className="hero-text">
          <p>Welcome back👋</p>
          <div className="hero-heading">
            <h1>Enter meeting code</h1> <br />
            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>
            {/* <TextField  variant="outlined" /> */}
          </div>
          {/* <button onClick={handleJoinVideoCall}>Join in</button> */}
        </div>
        <div className="hero-img">
          <img src="hero-img.png" alt="" />
        </div>
      </div>
    </div>
  );
}
export default withAuth(HomePage);