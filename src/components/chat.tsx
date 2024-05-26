import React, { useState, useEffect } from 'react';
// import TextEditorDataService from '..//TextEditorDataService';
import { onValue } from 'firebase/database';
import TextEditorDataService from '../services/TextEditorDataService';
import './chat.css';
const Chat = () => {
  const [chatTextNow, setChatTextNow] = useState('');
  const [chatHistory, setChatHistory] = useState('');
  const displayName = 'John Doe'; // Replace this with actual user displayName if available

  const sendChat = () => {
    const sendText = `<b>${displayName}</b> : ${chatTextNow}`;
    TextEditorDataService.addChat(sendText);
    setChatTextNow(''); // Clear the input field after sending the message
  };

  useEffect(() => {
    const chatRef = TextEditorDataService.getref2();

    const unsubscribe = onValue(chatRef, (snapshot) => {
      let history = '';
      snapshot.forEach((element) => {
        history += element.val() + '<br>';
      });
      setChatHistory(history);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="chat">
      <br />
      <div className="chatbox">
        <div className="conversation-history" id="ch2" dangerouslySetInnerHTML={{ __html: chatHistory }} />
        <form
          className="message-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat();
          }}
        >
          <input
            type="text"
            className="message-input"
            placeholder="Enter your message..."
            value={chatTextNow}
            onChange={(e) => setChatTextNow(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendChat();
              }
            }}
          />
          <button type="button" className="message-button" onClick={sendChat}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
