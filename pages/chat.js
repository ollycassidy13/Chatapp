/* pages/chat.js */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import axios from 'axios';

const ChatPage = () => {
  const router = useRouter();
  const { user, room } = router.query;

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    if (!user || !room) {
      router.push('/');
    }
  }, [user, room]);

  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      const chat = { user, message: evt.target.value, room, timestamp: +new Date() };

      evt.target.value = '';
      axios.post('/message', chat).catch((error) => {
        console.error('There was an error sending the message!', error);
      });
    }
  };

  return (
    <Layout pageTitle="Realtime Chat">
      <main className="container-fluid position-absolute h-100 w-100 bg-white d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1, backgroundColor: 'white' }}>
          <h1 className="text-secondary mb-0">Room: {room}</h1>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ marginRight: '20px' }}>
            Logout
          </button>
        </div>
        <div className="row w-100 flex-grow-1" style={{ paddingTop: '60px', paddingBottom: '90px' }}>
          <section className="col-12 text-center">
            {user && room ? (
              <Chat activeUser={user} roomName={room} />
            ) : (
              <p className="text-secondary">Loading...</p>
            )}
          </section>
        </div>
        <div className="border-top border-gray w-100 px-4 d-flex align-items-center bg-light" style={{ position: 'fixed', bottom: 0, height: '90px', zIndex: 1 }}>
          <textarea
            className="form-control px-3 py-2"
            onKeyUp={handleKeyUp}
            placeholder="Enter a chat message"
            style={{ resize: 'none', width: '100%' }}
          ></textarea>
        </div>
      </main>
    </Layout>
  );
};

export default ChatPage;
