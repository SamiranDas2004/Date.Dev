'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socket } from '../../utils/socket';

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
      socket.emit('joinRoom', userEmail);

      socket.on('receiveMessage', ({ fromUser, message }: Message) => {
        setMessages((prevMessages) => [...prevMessages, { fromUser, message }]);
        console.log(fromUser);
        
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [userEmail]);

  const sendMessage = () => {
    if (message.trim() !== '' && userEmail && targetUserEmail) {
      socket.emit('sendMessage', { fromUser: userEmail, toUser: targetUserEmail, message });
      setMessages((prevMessages) => [...prevMessages, { fromUser: userEmail, message }]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.fromUser === userEmail ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.fromUser === userEmail ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
