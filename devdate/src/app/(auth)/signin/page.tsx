'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignInComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Function to handle sign in with credentials
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sign in using NextAuth credentials provider
    const signInResponse = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(signInResponse);
    
    if (signInResponse?.error) {
      setError(signInResponse.error); // Set error message if sign-in fails
    } else if (signInResponse?.ok) {
      router.replace('/dashboard'); // Redirect to /photoupload on successful sign-in
    }
  };
  const handelKeyDown=(e:any)=>{
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('uploadButton')?.click();
    }
  }

  // Redirect if session data exists
  if (status === 'authenticated') {
//  router.replace('')
   // Return null to prevent component rendering while redirecting
  }

  return (
    <div
    className="flex flex-col h-[91vh] items-center justify-center  bg-gray-900 text-white bg-cover bg-center bg-no-repeat"
    style={{ 
      backgroundImage: "url('https://res.cloudinary.com/dfjfjovut/image/upload/v1724152514/yjtiwbomeqmzwmtnwwjx.png')",
      backgroundSize: '', // Ensures the image covers the container
      backgroundPosition: 'center', // Centers the image in the container
      backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      backgroundAttachment: 'fixed' // Makes the background image stay in place while scrolling
    }}
  >
    <h1 className="text-3xl font-bold mb-6">Sign In</h1>
    <form
      className="w-full max-w-md text-xl font-semibold flex flex-col bg-white bg-opacity-75 p-6 rounded-lg"
      onSubmit={handleCredentialsSignIn}
      onKeyDown={handelKeyDown}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-600 rounded-md">
          {error}
        </span>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        required
        className="w-full px-4 py-4 mb-4 border border-gray-700 bg-white rounded-md text-black"
      />
    
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        required
        className="w-full px-4 py-4 mb-4 border border-gray-700 bg-white rounded-md text-black"
      />
    
      <button
        type="submit"
        id='uploadButton'
        className="w-full h-12 px-6 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Log in
      </button>
    </form>
    <hr className="w-full max-w-md my-6" />
    <button
      onClick={() => signIn('github')}
      className="w-full max-w-md h-12 px-3 flex items-center justify-center text-lg font-semibold text-black bg-white rounded-lg transition-colors border-gray-700 duration-150 hover:bg-[#a2b8f2] focus:outline-none focus:ring-2 focus:ring-gray-600"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Logo" className="w-6 h-6 mr-2" />
      Sign in with GitHub
    </button>
  </div>
  
  
  );
}
