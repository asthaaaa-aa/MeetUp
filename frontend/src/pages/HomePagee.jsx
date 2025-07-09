import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import "../HomePage.css"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  Link as MuiLink,
} from "@mui/material";


const HomePagee = () => {
        const router = useNavigate();
    
  return (
    <Box className="wrapper" sx={{ bgcolor: "#111418", minHeight: "100vh", color: "white", fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}>
      {/* Header */}
      <div className="navbar">
            <nav>
                <div className='navHeader'>
                  
                    <h2 className="logo"> <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>MeetUp</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/aljk23")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>
        </div>
      {/* Main Content */}
      <div className="heroContainer" sx={{ py: 8 }}>
        <div className="heroSection">
        <Box className="heroImg"></Box>
        <Box className="heroTitle" textAlign="center" >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            <span style={{color: "#ffffff", fontSize:"50px"}}>MeetUp</span> with anyone, anywhere.
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: "auto" }}>
            
          </Typography>
          <Button onClick={() => {
                        router("/aljk23")
                    }}
            variant="contained"
            className="getStartedBtn"
            sx={{ mt: 4, bgcolor: "#0c7ff2", textTransform: "none", px: 4 }}
          >
            Get Started
          </Button>
        </Box>
        </div>
        

        <div className="Features">
          {[
            {
              title: "Video Conferencing",
              desc: "Host and join high-quality video meetings with up to 1000 participants.",
            },
            {
              title: "Screen Sharing",
              desc: "Schedule and manage online meetings with screen sharing.",
            },
            {
              title: "Team Chat",
              desc: "Stay connected with your team through real-time messaging and file sharing.",
            },
          ].map((feature) => (
            <div className="feature" item xs={12} sm={6} md={3} key={feature.title}>
              <Paper sx={{ bgcolor: "#1b212766", p: 3, border: "1px solid #3b4754" }}>
                <Typography variant="h6" sx={{color: "white"}}fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="#e1edf8">
                  {feature.desc}
                </Typography>
              </Paper>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #283039", py: 4 }}>
        <Container>
          
          <Typography variant="body2" align="center" color="#9cabba" sx={{ mt: 2 }}>
            © 2023 Connect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePagee;
