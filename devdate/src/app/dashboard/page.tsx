'use client';

import * as React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Likedperson from '../likePeople/page'
function CarouselDemo() {
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

  const handleGenderChange = async (value: string) => {
    setGender(value);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/findgenders',
        { gender: value }
      );
      setUsers(response.data.data);
      setCurrentIndex(0);
      setPhotoIndex(0);
    } catch (error) {
      console.error('Error fetching users by gender:', error);
    }
  };

  const handleNextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhotoIndex(0);
    }
  };

  const handlePreviousUser = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPhotoIndex(0);
    }
  };

  const handleNextPhoto = () => {
    if (photoIndex < users[currentIndex].photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const handlePreviousPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  const likeAPerson = async (email: string) => {
    try {
      const emailId = session?.user.email;
      console.log(emailId);
      
      const response = await axios.post('http://localhost:3000/api/getUserId', {
        email: emailId,
      });
      const userEmail = response.data.id;
console.log(userEmail);

      const likeResponse = await axios.post(
        'http://localhost:3000/api/likeby',
        {
        userId:  userEmail,
          email: email,
        }
      );
      console.log('like data', likeResponse.data);
      if (likeResponse.data.match) {
        router.replace(`/chat?userEmail=${userEmail}&targetUserEmail=${likeResponse.data.targetUserEmail}`);
      }
    } catch (error) {
      console.error('Error liking person:', error);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative">
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
     
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url()' }}>
          {' '}
        <Likedperson/>
           </div>

           <div className="relative z-10 flex space-x-4 mb-6">
             <button
               onClick={() => handleGenderChange('male')}
               className={`px-4 py-2 rounded-lg ${gender === 'male' ? 'bg-blue-600' : 'bg-gray-800'} hover:bg-blue-700 focus:outline-none`}
             >
               Male
             </button>
             <button
               onClick={() => handleGenderChange('female')}
               className={`px-4 py-2 rounded-lg ${gender === 'female' ? 'bg-pink-600' : 'bg-gray-800'} hover:bg-pink-700 focus:outline-none`}
             >
               Female
             </button>
           </div>

           <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
             {users.length > 0 && (
               <Carousel className="w-full max-w-xs">
                 <CarouselContent>
                   <CarouselItem key={users[currentIndex].email}>
                     <div className="p-1">
                       <Card className="flex items-center justify-center h-full">
                         <CardContent className="flex flex-col items-center justify-center p-6">
                           <div className="relative w-full h-64">
                             <img
                               src={users[currentIndex].photos[photoIndex]}
                               alt={`${users[currentIndex].username}'s photo`}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="text-center mt-4">
                             <h3 className="text-xl font-bold">
                               {users[currentIndex].username}
                             </h3>
                             <p>{users[currentIndex].email}</p>
                           </div>
                         </CardContent>
                       </Card>
                     </div>
                   </CarouselItem>
                 </CarouselContent>
                 <CarouselPrevious
                   onClick={handlePreviousPhoto}
                   disabled={photoIndex === 0}
                 />
                 <CarouselNext
                   onClick={handleNextPhoto}
                   disabled={photoIndex === users[currentIndex].photos.length - 1}
                 />
               </Carousel>
             )}

             <div className="mt-4 flex space-x-4">
               <button
                 onClick={handlePreviousUser}
                 disabled={currentIndex === 0}
                 className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none"
               >
                 Previous User
               </button>
               <button
                 onClick={handleNextUser}
                 disabled={currentIndex === users.length - 1}
                 className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none"
               >
                 Next User
               </button>
               <button
                 onClick={() => likeAPerson(users[currentIndex].email)}
                 className="px-4 py-2 bg-white rounded-lg hover:bg-red-500 focus:outline-none"
               >
                 ❤️
               </button>
             </div>
           </div>
         </div>
       </div>
     );
   }

   export default CarouselDemo;
