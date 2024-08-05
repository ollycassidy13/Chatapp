/* components/Chat.js */

import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatMessage from './ChatMessage';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

class Chat extends Component {
  state = { chats: [] };

  componentDidMount() {
    const pusherKey = process.env.PUSHER_APP_KEY;
    const pusherCluster = process.env.PUSHER_APP_CLUSTER;

    if (!pusherKey) {
      throw new Error('Pusher app key is not defined');
    }

    this.pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      useTLS: true,
    });

    this.channel = this.pusher.subscribe(`chat-room-${this.props.roomName}`);

    this.channel.bind('new-message', ({ chat = null }) => {
      const { chats } = this.state;
      chat && chats.push(chat);
      this.setState({ chats });
    });

    this.pusher.connection.bind('connected', () => {
      axios
        .post('/messages', { room: this.props.roomName })
        .then((response) => {
          const chats = response.data.messages;
          this.setState({ chats });
        })
        .catch((error) => {
          console.error('There was an error fetching the messages!', error);
        });
    });
  }

  componentWillUnmount() {
    if (this.pusher) {
      this.pusher.unsubscribe(`chat-room-${this.props.roomName}`);
    }
  }

  render() {
    return (
      this.props.activeUser && (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#fff' }}>
          <div className="flex-grow-1 w-100 d-flex flex-column px-4 pb-4" style={{ overflowY: 'scroll' }}>
            {this.state.chats.map((chat, index) => {
              const previous = Math.max(0, index - 1);
              const previousChat = this.state.chats[previous];
              const position = chat.user === this.props.activeUser ? 'right' : 'left';

              const isFirst = previous === index;
              const inSequence = chat.user === previousChat.user;
              const hasDelay = Math.ceil((chat.timestamp - previousChat.timestamp) / (1000 * 60)) > 1;

              const mood = chat.sentiment > 0 ? HAPPY_EMOJI : chat.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI;

              return (
                <Fragment key={index}>
                  {(isFirst || !inSequence || hasDelay) && (
                    <div
                      className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`}
                      style={{ fontSize: '0.9rem' }}
                    >
                      <span className="d-block" style={{ fontSize: '1.6rem' }}>
                        {String.fromCodePoint(...mood)}
                      </span>
                      <span>{chat.user || 'Anonymous'}</span>
                    </div>
                  )}

                  <ChatMessage message={chat.message} position={position} isOwnMessage={chat.user === this.props.activeUser} />
                </Fragment>
              );
            })}
          </div>
        </div>
      )
    );
  }
}

export default Chat;
