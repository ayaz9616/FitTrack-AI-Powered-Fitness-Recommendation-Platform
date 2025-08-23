// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getActivityDetail } from '../services/api';

// const ActivityDetail = () => {
//   const { id } = useParams();
//   const [activity, setActivity] = useState(null);
//   const [recommendation, setRecommendation] = useState(null);
//   // removed unused error state
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     let isMounted = true;
//     let retryTimeout;
//     const fetchActivityDetail = async () => {
//       try {
//         const response = await getActivityDetail(id);
//         if (isMounted) {
//           setActivity(response.data);
//           setRecommendation(response.data.recommendation);
//         }
//       } catch {
//         if (isMounted) {
//           retryTimeout = setTimeout(() => setRetryCount((c) => c + 1), 1500);
//         }
//       }
//     };
//     fetchActivityDetail();
//     return () => {
//       isMounted = false;
//       if (retryTimeout) clearTimeout(retryTimeout);
//     };
//   }, [id, retryCount]);

//   if (!activity) {
//     return <div className="text-center text-gray-500">Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="border rounded shadow mb-4 p-4 bg-white">
//         <h2 className="text-xl font-bold mb-2">Activity Details</h2>
//         <div>Type: {activity.type}</div>
//         <div>Duration: {activity.duration} minutes</div>
//         <div>Calories Burned: {activity.caloriesBurned}</div>
//         <div>Date: {new Date(activity.createdAt).toLocaleString()}</div>
//       </div>

//       {recommendation && (
//         <div className="border rounded shadow p-4 bg-white">
//           <h2 className="text-xl font-bold mb-2">AI Recommendation</h2>
//           <div className="mb-2">
//             <span className="font-semibold">Analysis:</span>
//             <div className="ml-2 text-gray-700">{activity.recommendation}</div>
//           </div>
//           <hr className="my-2" />
//           <div className="mb-2">
//             <span className="font-semibold">Improvements:</span>
//             <ul className="list-disc ml-6">
//               {activity?.improvements?.map((improvement, index) => (
//                 <li key={index}>{improvement}</li>
//               ))}
//             </ul>
//           </div>
//           <hr className="my-2" />
//           <div className="mb-2">
//             <span className="font-semibold">Suggestions:</span>
//             <ul className="list-disc ml-6">
//               {activity?.suggestions?.map((suggestion, index) => (
//                 <li key={index}>{suggestion}</li>
//               ))}
//             </ul>
//           </div>
//           <hr className="my-2" />
//           <div className="mb-2">
//             <span className="font-semibold">Safety Guidelines:</span>
//             <ul className="list-disc ml-6">
//               {activity?.safety?.map((safety, index) => (
//                 <li key={index}>{safety}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActivityDetail;











import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityDetail } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Activities", path: "/activities" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-green-600 to-purple-700 min-h-screen p-6 fixed text-white shadow-[0_0_15px_rgba(0,168,107,0.5)]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;500&display=swap');
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <h1 className="text-2xl font-bold text-green-600 mb-10 cursor-pointer font-montserrat" onClick={() => navigate("/")}>
        FitTrack
      </h1>
      <nav className="space-y-4">
        {navItems.map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/10 hover:shadow-[0_0_10px_rgba(220,20,60,0.5)] transition text-white font-medium font-poppins"
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        if (isMounted) {
          setActivity(response.data);
          setRecommendation(response.data.recommendation);
        }
      } catch {
        if (isMounted) {
          retryTimeout = setTimeout(() => setRetryCount((c) => c + 1), 1500);
        }
      }
    };
    fetchActivityDetail();
    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [id, retryCount]);

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-700">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <span className="text-blue-600 text-lg font-poppins">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 font-poppins">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;500&display=swap');
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition animate-pulse">
            <h2 className="text-2xl font-bold text-green-600 mb-4 font-montserrat">Activity Details</h2>
            <div className="space-y-2">
              <div className="text-obsidian font-poppins">
                <span className="font-semibold">Type:</span> {activity.type}
              </div>
              <div className="text-obsidian font-poppins">
                <span className="font-semibold">Duration:</span> {activity.duration} minutes
              </div>
              <div className="text-obsidian font-poppins">
                <span className="font-semibold">Calories Burned:</span> {activity.caloriesBurned}
              </div>
              <div className="text-blue-600 font-poppins">
                <span className="font-semibold">Date:</span> {new Date(activity.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => navigate("/activities")}
              className="mt-6 py-2 px-4 rounded-lg bg-green-600 text-white font-medium font-montserrat hover:bg-green-700 hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition"
            >
              Back to Activities
            </button>
          </div>

          {recommendation && (
            <div className="bg-gradient-to-r from-green-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition animate-pulse">
              <h2 className="text-2xl font-bold mb-4 font-montserrat">AI Recommendation</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold font-montserrat">Analysis:</span>
                  <div className="ml-2 text-white font-poppins">{activity.recommendation}</div>
                </div>
                <hr className="border-white/20" />
                <div>
                  <span className="font-semibold font-montserrat">Improvements:</span>
                  <ul className="list-none ml-2">
                    {activity?.improvements?.map((improvement, index) => (
                      <li key={index} className="flex items-start mt-2">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-poppins">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="border-white/20" />
                <div>
                  <span className="font-semibold font-montserrat">Suggestions:</span>
                  <ul className="list-none ml-2">
                    {activity?.suggestions?.map((suggestion, index) => (
                      <li key={index} className="flex items-start mt-2">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-poppins">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className="border-white/20" />
                <div>
                  <span className="font-semibold font-montserrat">Safety Guidelines:</span>
                  <ul className="list-none ml-2">
                    {activity?.safety?.map((safety, index) => (
                      <li key={index} className="flex items-start mt-2">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-poppins">{safety}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivityDetail;