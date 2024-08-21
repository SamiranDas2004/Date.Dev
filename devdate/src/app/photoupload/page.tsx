'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Assuming you're using Next.js Image component

const PhotoUpload = () => {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
  
    for (let i = 0; i < photos.length; i++) {
      const formData = new FormData();
      formData.append('photo', photos[i]);
      formData.append('email', session?.user.email || '');
  
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(`Photo ${i + 1} uploaded successfully:`, response.data);
      } catch (err: any) {
        console.error(`Error uploading photo ${i + 1}:`, err);
        setError(`Error uploading photo ${i + 1}`);
        break; // Optionally, you can break the loop on error if you want to stop further uploads
      }
    }
  
    setUploading(false);
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('uploadButton')?.click();
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center h-[91vh] sm:h-[95vh] md:h-[100vh] lg:h-[91vh] justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
  {/* Your content here */}


      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">
        {/* User Info */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-xl font-bold font-serif mb-2 text-black">Signed in as {session.user.name}</p>
          <div className="relative w-24 h-24 mb-4">
            <img src={session.user.image || ''} alt="User Avatar" className="rounded-full" />
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-black bg-gradient-to-r from-blue-500 to-purple-600 rounded"
          >
            Sign out
          </button>
        </div>

        {/* File Upload Form */}
        <form
          onSubmit={handleUpload}
          onKeyDown={handleKeyDown}
          className="w-full flex flex-col items-center space-y-4"
        >
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-600"
          />
          <button
            id="uploadButton"
            type="submit"
            disabled={uploading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PhotoUpload;
