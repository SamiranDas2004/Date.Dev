'use client';

import * as React from 'react';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function Likedperson() {
  const { data: session, status } = useSession();
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const getMatches = async () => {
        try {
          const response = await axios.post(
            'http://localhost:3000/api/getMatches',
            { email: session.user.email } 
          );
          setUserInfo(response.data.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      };
      getMatches();
    }
  }, [session]);


  
 

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  return (
    <div>
   <div className="overflow-y-auto w-1/3 h-screen bg-pink-200 p-4" style={{ maxHeight: '100vh' }}>
            <div className="text-center mb-4">Scrollable Content</div>
            <ul className="space-y-4">
              {userInfo.map((user) => (
                <li key={user.email} className="space-y-2">
                  <img
                    src={user.photos[0]}
                    alt={user.username}
                    className="w-full h-auto mt-2"
                  />
                  <button
                    onClick={() => router.replace(`/chat?userEmail=${session?.user.email}&targetUserEmail=${user.email}`)}
                    className="bg-red-600 mt-2 px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
                  >
                   
                   Message
                     </button>
                     <div>{user.username}</div>
                     <div>{user.email}</div>
                   </li>
                 ))}
               </ul>
             </div>
    </div>
  )
}
