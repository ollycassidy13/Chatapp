/* pages/create-room.js */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';

const CreateRoomPage = () => {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = () => {
    if (roomName) {
      axios.post('/create-room', { room: roomName })
        .then(response => {
          if (response.data.status === 'success') {
            alert('Room created successfully. Please login to join the room.');
            router.push('/');
          }
        })
        .catch(error => {
          console.error('Error creating room:', error);
        });
    }
  };

  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      handleCreateRoom();
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
    <Layout pageTitle="Create Room">
      <main className="container-fluid position-absolute h-100 w-100 bg-dark d-flex flex-column align-items-center justify-content-center">
        <div className="row w-100">
          <section className="col-12 text-center mb-5">
            <div>
              <span className="d-block h1 text-light">Create a New Room</span>
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
                onClick={handleCreateRoom}
                disabled={!roomName}
              >
                Create Room
              </button>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => router.push('/')}
              >
                Go back to Login
              </button>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default CreateRoomPage;
