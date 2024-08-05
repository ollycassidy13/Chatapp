/* components/ChatMessage.js */

import React, { Component } from 'react';

class ChatMessage extends Component {
  render() {
    const { position = 'left', message, isOwnMessage } = this.props;
    const isRight = position.toLowerCase() === 'right';

    const align = isRight ? 'text-right' : 'text-left';
    const justify = isRight ? 'justify-content-end' : 'justify-content-start';

    const messageBoxStyles = {
      maxWidth: '70%',
      flexGrow: 0,
      backgroundColor: isOwnMessage ? '#d4edda' : '#f8f9fa', // Light green for own messages, light grey for others
      borderRadius: '0.25rem',
      border: isOwnMessage ? '1px solid #c3e6cb' : '1px solid #dee2e6'
    };

    const messageStyles = {
      fontWeight: 500,
      lineHeight: 1.4,
      whiteSpace: 'pre-wrap'
    };

    return (
      <div className={`w-100 my-1 d-flex ${justify}`}>
        <div className="p-2" style={messageBoxStyles}>
          <span className={`d-block text-secondary ${align}`} style={messageStyles}>
            {message}
          </span>
        </div>
      </div>
    );
  }
}

export default ChatMessage;
