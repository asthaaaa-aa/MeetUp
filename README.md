

# 🎥 MeetUp – Zoom Clone

A modern full-stack video conferencing web application inspired by platforms like Zoom and Google Meet. MeetUp enables users to create and join virtual meeting rooms with real-time video, audio, and chat features, delivering a smooth and interactive communication experience.

## 🔗 Project Description

This project lets users:

* Create and join secure virtual meeting rooms
* Share video and audio in real time
* Exchange text messages via in-room chat
* See participants' live status (join/leave notifications)
* Enjoy responsive and minimal UI optimized for desktops and mobiles

Built using:

* **React.js** for the interactive frontend
* **Node.js & Express.js** for backend API and room management
* **WebRTC** for real-time audio/video streaming
* **Socket.IO** for bi-directional chat and signaling
* **Styled Components / Tailwind CSS** for clean, responsive design

### Demo

[(https://meetupfrontend-9lat.onrender.com/)](https://meetupfrontend-9lat.onrender.com/)

<img  height="200" alt="image" src="https://github.com/user-attachments/assets/2c1debba-da74-4fc4-8a4c-1420813c2265" />
<img  height="200" alt="image" src="https://github.com/user-attachments/assets/30f1db2e-ce5c-49b6-b6e6-dfcf79e51e98" />
<img height="200" alt="image" src="https://github.com/user-attachments/assets/ead925d4-e873-4155-b46d-62478dfc00ca" />
<img  height="200" alt="image" src="https://github.com/user-attachments/assets/7a6a545d-1e23-4b0f-94da-88eb3f2c4714" />




---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/asthaaaa-aa/MeetUp.git
cd MeetUp
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with keys such as:

* `PORT` – App running port
* `SOCKET_SERVER_URL` – Socket.IO signaling server endpoint
* Any TURN/STUN server credentials for WebRTC

### Run the App Locally

```bash
npm run dev
```

---

## 🧩 Features

* Create and join meeting rooms instantly
* Real-time audio/video streaming with WebRTC
* In-room live chat with timestamps
* Responsive, modern UI design
* Join/leave notifications for participants
* Secure room URLs

---

## 💡 Inspiration

Inspired by Zoom and Google Meet, **MeetUp** was built to explore real-time communication technologies, WebRTC integration, and scalable full-stack architecture—focusing on low-latency streaming, intuitive UX, and team collaboration features.

---

## 🛠 Tech Stack

* React.js
* Node.js & Express.js
* WebRTC
* Socket.IO
* Tailwind CSS / Styled Components

---

## 🧪 Potential Improvements

* Screen sharing functionality
* Recording and playback of meetings
* Authentication and private meeting rooms
* Raise-hand and reaction emojis
* Noise suppression for clearer audio
* Progressive Web App (PWA) support
* CI/CD deployment pipeline

