import React, { useContext, useState } from 'react'
import withAuth from '../utils/WithAuth'
import { useNavigate } from 'react-router-dom'
import "../HomePage.css"
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';
function HomePage() {


  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");


  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    navigate(`/${meetingCode}`)
  }

  return (
    <>

      <div className="wrapper">

        <div className="navbar">
          <nav>
            <div className='navHeader'>

              <h2 className="logo" onClick={() => {navigate("/")}} > <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>MeetUp</h2>
            </div>
            <div className='navlist'>
              <div onClick={() => {
                localStorage.removeItem("token")
                navigate("/auth")
              }} role='button'>
                <p>Logout</p>
              </div>
            </div>
          </nav>
        </div>


        <div className="meetContainer">
          <div className="leftPanel">
            <div>
              <h2>Welcome back !</h2>
              <h2 style={{color: "white"}}>Join any meeting room!</h2>

              <div style={{ display: 'flex', gap: "10px" }}>

                <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

              </div>
            </div>
          </div>
          <div className='rightPanel'></div>
        </div>
      </div>
    </>
  )
}


export default withAuth(HomePage);