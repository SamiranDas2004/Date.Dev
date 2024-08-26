"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "../../utils/socket";
import Likedperson from "../likePeople/page";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Message {
  fromUser: string;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("userEmail");
  const targetUserEmail = searchParams.get("targetUserEmail");
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
const [another,setAnother]=useState<any[]>([])
  useEffect(() => {
    if (userEmail) {
      socket.emit("joinRoom", userEmail);

      socket.on("receiveMessage", ({ fromUser, message }: Message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromUser, message, timestamp: new Date().toISOString() },
        ]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [userEmail]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/recivesavedmassages",
          {
            fromUser: userEmail,
            toUser: targetUserEmail,
          }
        );

        const { receivedMessages, sentMessages } = response.data;

        // Ensure both receivedMessages and sentMessages are arrays
        const recMessages = Array.isArray(receivedMessages)
          ? receivedMessages
          : [];
        const sMessages = Array.isArray(sentMessages) ? sentMessages : [];

        // Add individual messages from recMessages
        recMessages.forEach((msg) => {
          if (Array.isArray(msg.message)) {
            msg.message.forEach((individualMessage: string) => {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  fromUser: msg.fromUser,
                  message: individualMessage,
                  timestamp: msg.timestamp,
                },
              ]);
            });
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                fromUser: msg.fromUser,
                message: msg.message,
                timestamp: msg.timestamp,
              },
            ]);
          }
        });

        // Add individual messages from sMessages
        sMessages.forEach((msg) => {
          if (Array.isArray(msg.message)) {
            msg.message.forEach((individualMessage: string) => {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  fromUser: msg.fromUser,
                  message: individualMessage,
                  timestamp: msg.timestamp,
                },
              ]);
            });
          } else {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                fromUser: msg.fromUser,
                message: msg.message,
                timestamp: msg.timestamp,
              },
            ]);
          }
        });
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [userEmail, targetUserEmail]);

  const sendMessage = async () => {
    if (message.trim() !== "" && userEmail && targetUserEmail) {
      const newMessage = {
        fromUser: userEmail,
        toUser: targetUserEmail,
        message: message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("sendMessage", newMessage);
      console.log(newMessage);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/savemessages",
          newMessage
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error sending message to server:", error);
      }

      setMessage("");
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const Showpeople = async () => {
        try {
          console.log(session.user.email);
          const response = await axios.post(
            "http://localhost:3000/api/showmatches",
            { email: session.user.email }
          );
          const res = await axios.post(
            "http://localhost:3000/api/getthefuckingmatches",
            { email: session.user.email }
          );
          setUserInfo(response.data.data);
          setAnother(res.data.data)
          // console.log("data2", response);
        } catch (error) {
          console.log(error);
        }
      };
      Showpeople();
    }
  }, [session, status]);

  return (
    <div className="grid grid-cols-3 h-screen bg-white">
      <div className="col-span-1 bg-white p-4 w-[80vw]">
        {/* show chat people here */}
        {userInfo.map((user) => (
  <div key={user.email}>
    {user.photos && user.photos.length > 0 ? (
      <img 
       className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
      src={user.photos[0]} alt={user.username} />
    ) : (
      <div> "</div> // Or a placeholder image
    )}
  </div>
))}
 {Array.isArray(another) && another.length > 0 ? (
            another.map((imgUrl, index) => (
              <li key={index} className="flex justify-center">
                <img
                  src={imgUrl}
                  alt={`Liked person ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">.....</p>
          )}


      </div>
      <div className="col-span-2 flex flex-col">
        <div className="flex-1 p-4 border border-gray-300 rounded-lg  shadow-md flex flex-col">
          <div className="overflow-y-auto h-full">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.fromUser === userEmail ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.fromUser === userEmail
                      ? "bg-white text-black"
                      : "bg-pink-500 text-white"
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
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};

export default Chat;
