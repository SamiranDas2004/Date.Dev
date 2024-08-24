'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// Import a spinner (optional)
// import { ClipLoader } from 'react-spinners';

function Page() {
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { data: session } = useSession();
const router=useRouter()
  useEffect(() => {
    if (session?.user?.email) {
      const getMatches = async () => {
        try {
          setLoading(true); // Start loading
          const response = await axios.post("http://localhost:3000/api/showmatches", { email: session.user.email });
          console.log(session.user.email);
          console.log(response.data);
          setUserInfo(response.data.data);
        } catch (error: any) {
          console.log(error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
      getMatches();
    }
  }, [session]);

  const handelNavigate=(email:any)=>{
    router.replace(`/chat?userEmail=${session?.user.email}&targetUserEmail=${email}`)}
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Your Matches
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            {/* Add your spinner here */}
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            {/* Or use a spinner from a library */}
            {/* <ClipLoader size={50} color={"#123abc"} loading={loading} /> */}
          </div>
        ) : (
          <ul className="space-y-6">
            {Array.isArray(userInfo)&&userInfo.length > 0 ? (
              userInfo.map((user) => (
                <li key={user.email} className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.photos[0]}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={()=>handelNavigate(user.email) } className="text-2xl">↗️</button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No matches found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Page;
