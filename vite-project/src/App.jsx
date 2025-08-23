// import React, { useState, useContext, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AuthContext } from "react-oauth2-code-pkce";
// import { setCredentials } from "./store/authSlice";

// import Dashboard from "./components/Dashboard";
// import ActivityForm from "./components/ActivityForm";
// import ActivityList from "./components/ActivityList";
// import ActivityDetail from "./components/ActivityDetail";

//     if (token) {
//       dispatch(setCredentials({ token, user: tokenData }));
//     }
//   }, [token, tokenData, dispatch]);

//   return (
//     <Router>
//       {!token ? (
//         <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-800 to-gray-700">
//           <style>
//             {`
//               @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;500&display=swap');
//               .animate-pulse {
//                 animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//               }
//               @keyframes pulse {
//                 0%, 100% { opacity: 1; }
//                 50% { opacity: 0.5; }
//               }
//             `}
//           </style>
//           <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Welcome to the Fitness Tracker App</h1>
//           <p className="mb-6 text-obsidian font-poppins">Please login or register to access your activities</p>
//           <button
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(106,13,173,0.5)] transition font-medium font-montserrat animate-pulse"
//             onClick={() => logIn()}
//           >
//             Login / Register
//           </button>
//         </div>
//       ) : (
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/activities" element={<ActivitiesPage />} />
//           <Route path="/activities/:id" element={<ActivityDetail />} />
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       )}
//     </Router>
//   );
// }

// export default App;











import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";
import { setCredentials } from "./store/authSlice";


import Dashboard from "./components/Dashboard";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import Sidebar from "./components/Sidebar";


const ActivitiesPage = () => {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-gradient-to-b from-gray-800 to-gray-700">
        <ActivityForm onActivityAdded={() => setRefresh((r) => r + 1)} />
        <ActivityList refresh={refresh} />
      </main>
    </div>
  );
};

const App = () => {
  const { token, logIn, tokenData } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-800 to-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2 font-montserrat">Welcome to the Fitness Tracker App</h1>
          <p className="mb-6 text-obsidian font-poppins">Please login or register to access your activities</p>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-purple-700 transition font-medium font-montserrat"
            onClick={() => logIn()}
          >
            Login / Register
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;