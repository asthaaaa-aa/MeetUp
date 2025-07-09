


import Box from '@mui/material/Box';
import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
// import server from '../environment';


import { Camera, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();

    let socketIdRef = useRef();

    let localVideoRef = useRef();
    let [videoAvailable, setVideoAvailable] = useState(true); //if our video is avalible hardware wise, if permission is given.

    let [audioAvailable, setAudioAvailable] = useState(true) //if mic permission is given

    let [video, setVideo] = useState() //if camera button is on.

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setShowModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState(true);

    let [messages, setMessages] = useState([]) //already stored messages

    let [message, setMessage] = useState("") //outgoing messages

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true) //if username needs to be asked

    let [username, setUsername] = useState("") //the username that needs to be set

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    useEffect(() => {
        getPermissions();
    }, []);


    const getPermissions = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log(devices)
            const hasVideo = devices.some(device => device.kind === "videoinput"); //true if there is atleast one camera attached
            const hasAudio = devices.some(device => device.kind === "audioinput"); //similarly for audio

            if (!hasVideo && !hasAudio) {
                console.warn("No video or audio devices found.");
                setVideoAvailable(false);
                setAudioAvailable(false);
                return;
            }

            const userMediaStream = await navigator.mediaDevices.getUserMedia({
                video: hasVideo,
                audio: hasAudio,
            });

            if (userMediaStream) {
                window.localStream = userMediaStream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = userMediaStream;
                }
            }

            setVideoAvailable(userMediaStream.getVideoTracks().length > 0);
            setAudioAvailable(userMediaStream.getAudioTracks().length > 0);

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }
        }
        catch (error) {
            console.error("Error getting media permissions:", error);
            setVideoAvailable(false);
            setAudioAvailable(false);
        }
    };




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }


    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }


    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
        
    }

     let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }
    
    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

     let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    let routeTo = useNavigate();

    let handleEndCall = () => {
        try{
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track)=>track.stop());
        }catch(e){}

        routeTo("/home");
    }

      let openChat = () => {
        setShowModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setShowModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };


    
    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    return (
        <div>

            {askForUsername === true ?
            
                <div className={styles.askUsername}>
                    

                    <h2 style={{color: "white"}}>Join as a Guest!</h2>

                    <div className="inputUsername">
                    <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />

                    <Button variant="contained" onClick={connect}>Connect</Button>
                    </div>

                    <div className={styles.videoPreview}>
                        <video ref={localVideoRef} autoPlay muted> </video>
                    </div>

                </div>
                :
                <>

                <div className={styles.meetVideoContainer}>

                    {showModal ? 
                    
                    <div className={styles.chatRoom}>
                        <div className={styles.chatContainer}>
                            <h2>Chat</h2>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )
                                }) : <p>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Send a message" variant="outlined" />
                                <Button variant='contained' onClick={sendMessage}>Send</Button>
                            </div>

                        </div>

                    </div>
                    
                    :<></>}


                    <div className={styles.buttonContainers}>
                        <IconButton style={{ color: "white" }} onClick={handleVideo}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen}  style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge onClick={()=> {(setShowModal(!showModal))}} badgeContent={newMessages} max={999} color='orange'>
                            <IconButton style={{ color: "white" }}>
                                <ChatIcon />                        </IconButton>
                        </Badge>

                    </div>

                    <div >
                        <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted> </video>
                    </div>


                    <div className={styles.conferenceView}>
                    {videos.map((video => (
                        <div key={video.socketId} >
                            

                            <video
                                data-socket={video.socketId}
                                ref={ref => {
                                    if (ref && video.stream) {
                                        ref.srcObject = video.stream;
                                    }
                                }}
                                autoPlay muted>

                            </video>


                        </div>
                    )))}
                    </div>
                </div>
                </>
            }

        </div>
    )




    // return (
    //         <div>

    //             {askForUsername === true ?

    //                 <div>


    //                     <h2>Enter into Lobby </h2>
    //                     <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
    //                     <Button variant="contained" onClick={connect}>Connect</Button>


    //                     <div>
    //                         <video ref={localVideoRef} autoPlay muted></video>
    //                     </div>

    //                 </div> :


    //                 <div className={styles.meetVideoContainer}>

    //                     {showModal ? <div className={styles.chatRoom}>

    //                         <div className={styles.chatContainer}>
    //                             <h1>Chat</h1>

    //                             <div className={styles.chattingDisplay}>

    //                                 {messages.length !== 0 ? messages.map((item, index) => {

    //                                     console.log(messages)
    //                                     return (
    //                                         <div style={{ marginBottom: "20px" }} key={index}>
    //                                             <p style={{ fontWeight: "bold" }}>{item.sender}</p>
    //                                             <p>{item.data}</p>
    //                                         </div>
    //                                     )
    //                                 }) : <p>No Messages Yet</p>}


    //                             </div>

    //                             <div className={styles.chattingArea}>
    //                                 <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
    //                                 <Button variant='contained' onClick={sendMessage}>Send</Button>
    //                             </div>


    //                         </div>
    //                     </div> : <></>}


    //                     <div className={styles.buttonContainers}>
    //                         <IconButton onClick={handleVideo} style={{ color: "white" }}>
    //                             {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
    //                         </IconButton>
    //                         <IconButton onClick={handleEndCall} style={{ color: "red" }}>
    //                             <CallEndIcon  />
    //                         </IconButton>
    //                         <IconButton onClick={handleAudio} style={{ color: "white" }}>
    //                             {audio === true ? <MicIcon /> : <MicOffIcon />}
    //                         </IconButton>

    //                         {screenAvailable === true ?
    //                             <IconButton onClick={handleScreen} style={{ color: "white" }}>
    //                                 {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
    //                             </IconButton> : <></>}

    //                         <Badge badgeContent={newMessages} max={999} color='orange'>
    //                             <IconButton onClick={() => setShowModal(!showModal)} style={{ color: "white" }}>
    //                                 <ChatIcon />                        </IconButton>
    //                         </Badge>

    //                     </div>


    //                     <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted></video>

    //                     <div className={styles.conferenceView}>
    //                         {videos.map((video) => (
    //                             <div key={video.socketId}>
    //                                 <video

    //                                     data-socket={video.socketId}
    //                                     ref={ref => {
    //                                         if (ref && video.stream) {
    //                                             ref.srcObject = video.stream;
    //                                         }
    //                                     }}
    //                                     autoPlay
    //                                 >
    //                                 </video>
    //                             </div>

    //                         ))}

    //                     </div>

    //                 </div>

    //             }

    //         </div>
    //     )
}








// --------------------------------------------------------------------------------------------------------------------------

// CHATGPT CODE

// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import { Badge, IconButton, TextField, Button } from '@mui/material';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import CallEndIcon from '@mui/icons-material/CallEnd';
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';
// import ScreenShareIcon from '@mui/icons-material/ScreenShare';
// import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
// import ChatIcon from '@mui/icons-material/Chat';
// import styles from '../styles/videoComponent.module.css';
// // import server from '../environment';



// const server =  "http://localhost:3000";

// const peerConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
// const connections = {};

// export default function VideoMeetComponent() {
//   const socketRef = useRef();
//   const socketIdRef = useRef();
//   const localVideoRef = useRef();
//   const videoRefs = useRef([]);

//   const [videoAvailable, setVideoAvailable] = useState(true);
//   const [audioAvailable, setAudioAvailable] = useState(true);
//   const [screenAvailable, setScreenAvailable] = useState(false);
//   const [video, setVideo] = useState(true);
//   const [audio, setAudio] = useState(true);
//   const [screen, setScreen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [newMessages, setNewMessages] = useState(0);
//   const [showModal, setShowModal] = useState(true);
//   const [askForUsername, setAskForUsername] = useState(true);
//   const [username, setUsername] = useState('');
//   const [remoteStreams, setRemoteStreams] = useState([]);

//   useEffect(() => {
//     getPermissions();
//   }, []);

//   useEffect(() => {
//     if (screen) startScreenShare();
//   }, [screen]);

//   const getPermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setVideoAvailable(true);
//       setAudioAvailable(true);
//       localVideoRef.current.srcObject = stream;
//       window.localStream = stream;
//     } catch (err) {
//       console.error('Permission error:', err);
//       setVideoAvailable(false);
//       setAudioAvailable(false);
//     }

//     if (navigator.mediaDevices.getDisplayMedia) {
//       setScreenAvailable(true);
//     }
//   };

//   const connectToSocketServer = () => {
//     socketRef.current = io.connect(server);

//     socketRef.current.on('connect', () => {
//       socketRef.current.emit('join-call', window.location.href);
//       socketIdRef.current = socketRef.current.id;
//     });

//     socketRef.current.on('signal', handleSignal);
//     socketRef.current.on('user-left', handleUserLeft);
//     socketRef.current.on('chat-message', addMessage);
//     socketRef.current.on('user-joined', handleUserJoined);
//   };

//   const handleSignal = (fromId, message) => {
//     const signal = JSON.parse(message);
//     const peer = connections[fromId];

//     if (signal.sdp) {
//       peer.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
//         if (signal.sdp.type === 'offer') {
//           peer.createAnswer().then(desc => {
//             peer.setLocalDescription(desc).then(() => {
//               socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: desc }));
//             });
//           });
//         }
//       });
//     }

//     if (signal.ice) {
//       peer.addIceCandidate(new RTCIceCandidate(signal.ice));
//     }
//   };

//   const handleUserJoined = (id, clients) => {
//     clients.forEach(clientId => {
//       if (!connections[clientId]) {
//         const peer = new RTCPeerConnection(peerConfig);

//         peer.onicecandidate = event => {
//           if (event.candidate) {
//             socketRef.current.emit('signal', clientId, JSON.stringify({ ice: event.candidate }));
//           }
//         };

//         peer.ontrack = event => {
//           addRemoteStream(clientId, event.streams[0]);
//         };

//         window.localStream.getTracks().forEach(track => peer.addTrack(track, window.localStream));

//         connections[clientId] = peer;
//       }
//     });

//     if (id === socketIdRef.current) {
//       Object.keys(connections).forEach(peerId => {
//         if (peerId !== socketIdRef.current) {
//           connections[peerId].createOffer().then(desc => {
//             connections[peerId].setLocalDescription(desc).then(() => {
//               socketRef.current.emit('signal', peerId, JSON.stringify({ sdp: desc }));
//             });
//           });
//         }
//       });
//     }
//   };

//   const handleUserLeft = id => {
//     setRemoteStreams(prev => prev.filter(stream => stream.id !== id));
//     if (connections[id]) {
//       connections[id].close();
//       delete connections[id];
//     }
//   };

//   const addRemoteStream = (id, stream) => {
//     setRemoteStreams(prev => {
//       const exists = prev.find(s => s.id === id);
//       if (!exists) return [...prev, { id, stream }];
//       return prev;
//     });
//   };

//   const handleVideoToggle = () => {
//     setVideo(prev => {
//       window.localStream.getVideoTracks().forEach(track => (track.enabled = !prev));
//       return !prev;
//     });
//   };

//   const handleAudioToggle = () => {
//     setAudio(prev => {
//       window.localStream.getAudioTracks().forEach(track => (track.enabled = !prev));
//       return !prev;
//     });
//   };

//   const startScreenShare = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//       window.localStream = stream;
//       localVideoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error('Screen share error:', err);
//     }
//   };

//   const handleEndCall = () => {
//     window.localStream.getTracks().forEach(track => track.stop());
//     window.location.href = '/';
//   };

//   const addMessage = (msg, sender, senderId) => {
//     setMessages(prev => [...prev, { sender, data: msg }]);
//     if (senderId !== socketIdRef.current) setNewMessages(prev => prev + 1);
//   };

//   const sendMessage = () => {
//     socketRef.current.emit('chat-message', message, username);
//     setMessage('');
//   };

//   const connect = () => {
//     setAskForUsername(false);
//     connectToSocketServer();
//   };

//   return (
//     <div>
//       {askForUsername ? (
//         <div>
//           <h2>Enter Lobby</h2>
//           <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
//           <Button variant="contained" onClick={connect}>Connect</Button>
//           <video ref={localVideoRef} autoPlay muted></video>
//         </div>
//       ) : (
//         <div className={styles.meetVideoContainer}>
//           {showModal && (
//             <div className={styles.chatRoom}>
//               <div className={styles.chatContainer}>
//                 <h1>Chat</h1>
//                 <div className={styles.chattingDisplay}>
//                   {messages.map((msg, idx) => (
//                     <div key={idx}>
//                       <p><strong>{msg.sender}</strong></p>
//                       <p>{msg.data}</p>
//                     </div>
//                   )) || <p>No Messages Yet</p>}
//                 </div>
//                 <div className={styles.chattingArea}>
//                   <TextField value={message} /*onChange={handleMessage}*/ label="Enter your chat" variant="outlined" />
//                   <Button onClick={sendMessage} variant="contained">Send</Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className={styles.videoStreams}>
//             <video ref={localVideoRef} autoPlay muted playsInline></video>
//             {remoteStreams.map(({ id, stream }) => (
//               <video key={id} autoPlay playsInline srcObject={stream}></video>
//             ))}
//           </div>

//           <div className={styles.buttonContainers}>
//             <IconButton onClick={handleVideoToggle}>{video ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
//             <IconButton onClick={handleEndCall} style={{ color: 'red' }}><CallEndIcon /></IconButton>
//             <IconButton onClick={handleAudioToggle}>{audio ? <MicIcon /> : <MicOffIcon />}</IconButton>
//             {screenAvailable && (
//               <IconButton onClick={() => setScreen(prev => !prev)}>
//                 {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
//               </IconButton>
//             )}
//             <Badge badgeContent={newMessages} color="secondary">
//               <IconButton onClick={() => setShowModal(prev => !prev)}><ChatIcon /></IconButton>
//             </Badge>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
