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

    if (signInResponse?.error) {
      setError(signInResponse.error); // Set error message if sign-in fails
    } else if (signInResponse?.ok) {
      router.replace('/photoupload'); // Redirect to /photoupload on successful sign-in
    }
  };

  // Redirect if session data exists
  if (status === 'authenticated') {
    router.replace('/photoupload');
    return null; // Return null to prevent component rendering while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form
        className="w-full max-w-md text-xl font-semibold flex flex-col"
        onSubmit={handleCredentialsSignIn}
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
          className="w-full px-4 py-4 mb-4 border border-gray-700 bg-gray-800 rounded-md text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
          className="w-full px-4 py-4 mb-4 border border-gray-700 bg-gray-800 rounded-md text-white"
        />

        <button
          type="submit"
          className="w-full h-12 px-6 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Log in
        </button>
      </form>
      <hr className="w-full max-w-md my-6" />
      <button
        onClick={() => signIn('github')}
        className="w-full max-w-md h-12 px-6 mt-4 flex items-center justify-center text-lg font-semibold text-white bg-gray-800 rounded-lg transition-colors duration-150 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Logo" className="w-6 h-6 mr-2" />
        Sign in with GitHub
      </button>
    </div>
  );
}
