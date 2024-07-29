'use client'

import * as React from "react"
import { Card, CardContent } from "../../components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from "react"
import axios from "axios"

function CarouselDemo() {
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const handleGenderChange = async (value: string) => {
    setGender(value.toString());

    const response = await axios.post("http://localhost:3000/api/findgenders", { gender: value });
    setUsers(response.data.data);
    setCurrentIndex(0); // Reset the index when gender changes
    setPhotoIndex(0); // Reset the photo index when gender changes
  };

  const handleNextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhotoIndex(0); // Reset photo index when moving to the next user
    }
  };

  const handlePreviousUser = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPhotoIndex(0); // Reset photo index when moving to the previous user
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

  const likeAPerson=()=>{
    
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url()' }}></div>
      
      {/* Gender Selection */}
      <div className="relative z-10 flex space-x-4 mb-6">
        <button
          value="male"
          onClick={() => handleGenderChange('male')}
          className={`px-4 py-2 rounded-lg ${gender === 'male' ? 'bg-blue-600' : 'bg-gray-800'} hover:bg-blue-700 focus:outline-none`}
        >
          Male
        </button>
        <button
          value="female"
          onClick={() => handleGenderChange('female')}
          className={`px-4 py-2 rounded-lg ${gender === 'female' ? 'bg-pink-600' : 'bg-gray-800'} hover:bg-pink-700 focus:outline-none`}
        >
          Female
        </button>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
        {users.length > 0 && (
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              <CarouselItem key={users[currentIndex]._id}>
                <div className="p-1">
                  <Card className="flex items-center justify-center h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="relative w-full h-64">
                        <img src={users[currentIndex].photos[photoIndex]} alt={`${users[currentIndex].username}'s photo`} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center mt-4">
                        <h3 className="text-xl font-bold">{users[currentIndex].username}</h3>
                        <p>{users[currentIndex].email}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious onClick={handlePreviousPhoto} disabled={photoIndex === 0} />
            <CarouselNext onClick={handleNextPhoto} disabled={photoIndex === users[currentIndex].photos.length - 1} />
          </Carousel>
        )}
        
        <div className="mt-4 flex space-x-4">
          <button onClick={handlePreviousUser} disabled={currentIndex === 0} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none">
            Previous User
          </button>
          <button onClick={handleNextUser} disabled={currentIndex === users.length - 1} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none">
            Next User
          </button>
          <button className="" value="like">❤️</button>
        </div>
      </div>
    </div>
  )
}

export default CarouselDemo
