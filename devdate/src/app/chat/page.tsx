'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socket } from '../../utils/socket';
import Likedperson from '../likePeople/page';
import axios from 'axios';

interface Message {
  fromUser: string;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail');
  const targetUserEmail = searchParams.get('targetUserEmail');

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (userEmail) {
      socket.emit('joinRoom', userEmail);

      socket.on('receiveMessage', ({ fromUser, message }: Message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromUser, message, timestamp: new Date().toISOString() }
        ]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/recivesavedmassages", {
          fromUser: userEmail,
          toUser: targetUserEmail,
        });

        const { receivedMessages, sentMessages } = response.data;

        // Ensure both receivedMessages and sentMessages are arrays
        const recMessages = Array.isArray(receivedMessages) ? receivedMessages : [];
        const sMessages = Array.isArray(sentMessages) ? sentMessages : [];

        // Combine both arrays and sort by timestamp
        const allMessages = [...recMessages, ...sMessages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setMessages(allMessages);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [userEmail, targetUserEmail]);

  const sendMessage = async () => {
    if (message.trim() !== '' && userEmail && targetUserEmail) {
      const newMessage = {
        fromUser: userEmail,
        toUser: targetUserEmail,
        message: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit('sendMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const response = await axios.post("http://localhost:3000/api/savemessages", newMessage);
        console.log(response.data);
      } catch (error) {
        console.error("Error sending message to server:", error);
      }

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
          <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-gray-800 shadow-md flex flex-col">
            <div className="overflow-y-auto h-full">
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
