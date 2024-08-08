'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socket } from '../../utils/socket';
import Likedperson from '../likePeople/page';

interface Message {
  fromUser: string;
  message: string;
}

const Chat: React.FC = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail');
  const targetUserEmail = searchParams.get('targetUserEmail');

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (userEmail) {
      // Join the user's room
      socket.emit('joinRoom', userEmail);

      // Listen for previous undelivered messages
      socket.on('previousMessages', (previousMessages: Message[]) => {
        setMessages((prevMessages) => [...prevMessages, ...previousMessages]);
      });

      // Listen for new messages
      socket.on('receiveMessage', ({ fromUser, message }: Message) => {
        setMessages((prevMessages) => [...prevMessages, { fromUser, message }]);
      });

      // Clean up listeners on component unmount
      return () => {
        socket.off('previousMessages');
        socket.off('receiveMessage');
      };
    }
  }, [userEmail]);

  const sendMessage = () => {
    if (message.trim() !== '' && userEmail && targetUserEmail) {
      // Emit the message to the server
      socket.emit('sendMessage', { fromUser: userEmail, toUser: targetUserEmail, message });

      // Immediately display the message on the sender's screen
      setMessages((prevMessages) => [...prevMessages, { fromUser: userEmail, message }]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-0 bg-gray-800">
      <div className="flex flex-1">
        <div className="w-1/3">
          <Likedperson />
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg bg-gray-800 shadow-md">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.fromUser === userEmail ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.fromUser === userEmail ? 'bg-white text-black' : 'bg-pink-500 text-white'
                  } shadow-md`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2 p-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
