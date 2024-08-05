/* pages/login.js */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleLogin = () => {
    if (userName && roomName) {
      // Check if the room exists before joining
      axios.post('/messages', { room: roomName })
        .then(response => {
          if (response.data.status === 'success') {
            router.push(`/chat?user=${userName}&room=${roomName}`);
          }
        })
        .catch(error => {
          console.error('Invalid room code:', error);
          alert('Invalid room code. Please create the room first.');
        });
    }
  };

  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      handleLogin();
    }
  };

  const inputStyles = {
    background: 'transparent',
    color: '#999',
    border: 0,
    borderBottom: '1px solid #666',
    borderRadius: 0,
    fontSize: '2rem',
    fontWeight: 500,
    boxShadow: 'none !important',
    textAlign: 'center',
  };

  return (
    <Layout pageTitle="Realtime Chat">
      <main className="container-fluid position-absolute h-100 w-100 bg-dark d-flex flex-column align-items-center justify-content-center">
        <div className="row w-100">
          <section className="col-12 text-center mb-5">
            <div>
              <span className="d-block h1 text-light">Enter your name and room</span>
              <input
                type="text"
                className="form-control mt-3 px-3 py-2"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="off"
                style={inputStyles}
                onKeyUp={handleKeyUp}
              />
              <input
                type="text"
                className="form-control mt-3 px-3 py-2"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                autoComplete="off"
                style={inputStyles}
                onKeyUp={handleKeyUp}
              />
              <button
                className="btn btn-primary mt-3"
                onClick={handleLogin}
                disabled={!userName || !roomName}
              >
                Join Room
              </button>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => router.push('/create-room')}
              >
                Create a new room
              </button>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default LoginPage;
