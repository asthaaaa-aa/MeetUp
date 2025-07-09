import React from "react";
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

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "#111418", minHeight: "100vh", color: "white", fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#111418", borderBottom: "1px solid #283039" }} elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box width={24} height={24}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              MeetUp
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={4}>
            {['Product', 'Solutions', 'Resources', 'Pricing'].map((item) => (
              <MuiLink key={item} href="#" underline="none" color="inherit" variant="body2">
                {item}
              </MuiLink>
            ))}
            <Box display="flex" gap={1}>
              <Button variant="contained" sx={{ bgcolor: "#0c7ff2", textTransform: "none" }}>
                Sign up
              </Button>
              <Button variant="contained" sx={{ bgcolor: "#283039", textTransform: "none" }}>
                Log in
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Connect with anyone, anywhere
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: "auto" }}>
            Connect is a video-first unified communications platform that offers a seamless, reliable, and secure way to connect with colleagues, clients, and partners.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, bgcolor: "#0c7ff2", textTransform: "none", px: 4 }}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              title: "Video Conferencing",
              desc: "Host and join high-quality video meetings with up to 1000 participants.",
            },
            {
              title: "Online Meetings",
              desc: "Schedule and manage online meetings with screen sharing, recording, and more.",
            },
            {
              title: "Team Chat",
              desc: "Stay connected with your team through real-time messaging and file sharing.",
            },
            {
              title: "Business Phone",
              desc: "Make and receive calls with a reliable and feature-rich business phone system.",
            },
          ].map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper sx={{ bgcolor: "#1b2127", p: 3, border: "1px solid #3b4754" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="#9cabba">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #283039", py: 4 }}>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            {["Product", "Solutions", "Resources", "Pricing", "Support", "Contact Us"].map((link) => (
              <Grid item key={link}>
                <MuiLink href="#" color="#9cabba" underline="none">
                  {link}
                </MuiLink>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" align="center" color="#9cabba" sx={{ mt: 2 }}>
            © 2023 Connect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
