// import React, { useEffect, useState, useContext } from "react";
// import api from "../services/api";
// import { useSelector } from "react-redux";
// import axios from "../services/api";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell
// } from "recharts";
// import { AuthContext } from "react-oauth2-code-pkce";
// import { useNavigate } from "react-router-dom";

// const Sidebar = () => {
//   const { logIn, logOut, token } = useContext(AuthContext) || {};
//   const navigate = useNavigate();
//   const navItems = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Activities", path: "/activities" },
//   ];
//   return (
//     <aside className="w-64 min-h-screen p-8 shadow-lg flex flex-col justify-start bg-gradient-to-b from-[#5e72e4] via-[#11cdef] to-[#6C63FF]">
//       <div className="font-extrabold text-3xl text-white mb-12 tracking-wider cursor-pointer drop-shadow-lg" onClick={() => navigate('/')}>
//         FitTrack
//       </div>
//       <nav className="flex flex-col gap-8 text-lg">
//         {!token ? (
//           <button onClick={() => logIn && logIn()} className="text-white font-semibold hover:text-[#ffd600] transition">
//             Login / Register
//           </button>
//         ) : (
//           <>
//             <button onClick={() => { logOut && logOut(); navigate("/"); }} className="text-white font-semibold hover:text-[#ffd600] text-left transition">
//               Logout
//             </button>
//             {navItems.map(({ label, path }) => (
//               <button key={label} onClick={() => navigate(path)} className="text-white font-semibold hover:text-[#ffd600] text-left transition">
//                 {label}
//               </button>
//             ))}
//           </>
//         )}
//       </nav>
//     </aside>
//   );
// };

// const COLORS = [
//   '#5e72e4', '#11cdef', '#6C63FF', '#fb6340', '#2dce89', '#f5365c',
//   '#ffd600', '#ffb300', '#00d6b4', '#ff6f61', '#845ec2', '#ffc75f',
//   '#f9f871', '#0081cf', '#b0a8b9'
// ];
// const gradientBg = "bg-gradient-to-r from-[#5e72e4] via-[#11cdef] to-[#6C63FF]";

// const StatCard = ({ icon, label, value, delta, deltaColor, iconColor }) => (
//   <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg p-6 mr-6 min-w-[185px]">
//     <div className="flex items-center mb-2">
//       <div className={`rounded-full flex items-center justify-center h-9 w-9 mr-3`} style={{ backgroundColor: iconColor }}>
//         {icon}
//       </div>
//       <span className="text-gray-400 text-sm font-medium">{label}</span>
//     </div>
//     <div className="font-extrabold text-xl text-[#5e72e4]">{value}</div>
//     <div className={`text-xs font-bold ${deltaColor}`}>
//       {delta}
//     </div>
//   </div>
// );

// const getWeek = (dateStr) => {
//   const date = new Date(dateStr);
//   const start = date.getDate() - date.getDay();
//   const weekStart = new Date(date.setDate(start));
//   return weekStart.toLocaleDateString();
// };

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={onClose} />
//       <div className="fixed inset-0 flex flex-col p-8 z-50 overflow-auto">
//         <button className="self-end mb-4 font-bold text-white bg-[#5e72e4] rounded px-5 py-2 hover:bg-[#4163c8] transition" onClick={onClose} aria-label="Close Modal">
//           Close
//         </button>
//         <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto">{children}</div>
//       </div>
//     </>
//   );
// };

// export default function Dashboard() {
//   const user = useSelector((state) => state.auth.user);
//   const [summary, setSummary] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [aiTips, setAiTips] = useState([]);

//   const [modalContent, setModalContent] = useState(null);

//   // Prepare data containers
//   let chartData = [];
//   let caloriesLineData = [];
//   let weeklyTrendData = [];
//   let activityTypeDistribution = [];
//   let intensityData = [];
//   let topActivity = null;
//   let bottomActivity = null;
//   let lastWeekCalories = 0;
//   let thisWeekCalories = 0;

//   if (activities && activities.length > 0) {
//     chartData = activities.map((a) => {
//       let name = typeof a.activityType === "string" ? a.activityType : a.activityType?.toString() || a.type || "Unknown";
//       name = name.replace(/^ActivityType\./, "");

//       if (!a.timestamp) {
//         console.warn("Activity missing timestamp and excluded:", a);
//       }
//       const date = a.timestamp ? new Date(a.timestamp).toLocaleDateString() : null;
//       const week = a.timestamp ? getWeek(a.timestamp) : null;

//       return {
//         name,
//         calories: Number(a.caloriesBurnt ?? a.caloriesBurned ?? 0),
//         duration: Number(a.duration ?? 0),
//         distance: Number(a.distance ?? 0),
//         intensity: Number(a.intensity ?? ((a.caloriesBurnt ?? a.caloriesBurned ?? 0) / (a.duration || 1))),
//         date,
//         week,
//       };
//     });

//     const validChartData = chartData.filter((a) => a.date !== null);
//     if (validChartData.length !== chartData.length) {
//       console.log(`Excluded ${chartData.length - validChartData.length} activities due to missing timestamps.`);
//     }

//     const caloriesByDate = {};
//     validChartData.forEach((a) => {
//       caloriesByDate[a.date] = (caloriesByDate[a.date] || 0) + a.calories;
//     });
//     caloriesLineData = Object.entries(caloriesByDate).map(([date, calories]) => ({ date, calories }));

//     const weeklyObj = {};
//     validChartData.forEach((a) => {
//       if (!a.week) return;
//       weeklyObj[a.week] = (weeklyObj[a.week] || 0) + a.calories;
//     });
//     weeklyTrendData = Object.entries(weeklyObj).map(([week, calories]) => ({ week, calories }));

//     const typeObj = {};
//     chartData.forEach((a) => {
//       typeObj[a.name] = (typeObj[a.name] || 0) + 1;
//     });
//     activityTypeDistribution = Object.entries(typeObj).map(([name, value]) => ({ name, value }));

//     intensityData = chartData.map((a) => ({
//       name: a.name,
//       intensity: a.intensity,
//     }));

//     const sortedByCalories = [...chartData].sort((a, b) => b.calories - a.calories);
//     topActivity = sortedByCalories[0];
//     bottomActivity = sortedByCalories[sortedByCalories.length - 1];

//     const weeks = weeklyTrendData.map((w) => w.week).sort();
//     if (weeks.length >= 2) {
//       lastWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 2])?.calories || 0;
//       thisWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 1])?.calories || 0;
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [summaryRes, activitiesRes, aiRes] = await Promise.all([
//           axios.get("/activities/summary"),
//           axios.get("/activities"),
//           api.get(`/recommendations/user/${user?.sub || user?.id || user?.userId || ""}`),
//         ]);
//         setSummary(summaryRes.data);
//         setActivities(activitiesRes.data);

//         if (aiRes.data && aiRes.data.length > 0) {
//           const rec = aiRes.data[0];
//           setAiTips([...(rec.suggestions || []), ...(rec.improvements || []), ...(rec.safety || [])]);
//         } else {
//           setAiTips([]);
//         }
//       } catch (err) {
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   if (loading) return <div className="text-center py-12 text-xl font-semibold text-[#5e72e4]">Loading dashboard...</div>;
//   if (error) return <div className="text-red-600 text-center py-12 text-xl">{error}</div>;

//   if (!summary || Object.keys(summary).length === 0) {
//     return (
//       <div className="flex min-h-screen">
//         <Sidebar />
//         <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-[#5e72e4] via-[#11cdef] to-[#6C63FF]">
//           <div className="bg-white rounded-xl shadow-lg max-w-xl mx-auto p-8">
//             <div className="text-center py-16 text-gray-500 text-xl">No activity summary available.<br />Add some activities to see your stats!</div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   const totalCalories = summary.totalCalories || 0;
//   const totalDistance = summary.totalDistance || 0;
//   const totalActivities = summary.totalActivities || 0;
//   const avgCalories = totalActivities > 0 ? (totalCalories / totalActivities).toFixed(1) : 0;

//   const deltaCalories = thisWeekCalories - lastWeekCalories;
//   const deltaColor = deltaCalories > 0 ? "text-green-500" : "text-red-500";
//   const deltaArrow = deltaCalories > 0 ? "▲" : "▼";

//   let recommendation = "";
//   if (totalActivities === 0) {
//     recommendation = "Start logging your activities to get personalized recommendations!";
//   } else if (avgCalories < 180) {
//     recommendation = "Increase intensity or duration of your workouts for better results.";
//   } else if (thisWeekCalories > lastWeekCalories) {
//     recommendation = "You are improving compared to last week, keep up the momentum!";
//   } else if (thisWeekCalories < lastWeekCalories) {
//     recommendation = "Try to surpass last week's calorie burn for steady progress.";
//   } else {
//     recommendation = "Excellent consistency! Maintain your regular activity for long-term results.";
//   }

//   let tips = aiTips.length > 0 ? aiTips : [
//     "Hydrate regularly before and after workouts.",
//     "Include rest days for recovery.",
//     "Vary workout types for better metabolism and muscle balance.",
//     "Aim for a mix of cardio and strength training."
//   ];

//   const openModal = (chartType) => {
//     let content = null;
//     switch (chartType) {
//       case "caloriesLine":
//         content = (
//           <ResponsiveContainer width="100%" height={600}>
//             <LineChart data={caloriesLineData} margin={{ top: 30, right: 30, left: 0, bottom: 30 }}>
//               <CartesianGrid stroke="#e6e6e6" />
//               <XAxis dataKey="date" tick={{ fill: "#5e72e4" }} />
//               <YAxis tick={{ fill: "#5e72e4" }} />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="calories" stroke="#5e72e4" strokeWidth={4} dot={{ r: 8 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         );
//         break;
//       case "weeklyBar":
//         content = (
//           <ResponsiveContainer width="100%" height={600}>
//             <BarChart data={weeklyTrendData} margin={{ top: 30, right: 30, left: 0, bottom: 30 }}>
//               <CartesianGrid stroke="#e6e6e6" />
//               <XAxis dataKey="week" tick={{ fill: "#ff5e57" }} />
//               <YAxis tick={{ fill: "#ff5e57" }} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="calories" fill="#ff5e57" barSize={50} />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//         break;
//       case "activityPie":
//         content = (
//           <ResponsiveContainer width="100%" height={600}>
//             <PieChart>
//               <Pie
//                 data={activityTypeDistribution}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={160}
//                 fill="#5e72e4"
//                 dataKey="value"
//               >
//                 {activityTypeDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         );
//         break;
//       default:
//         console.warn("Unknown chart type requested for modal:", chartType);
//         break;
//     }
//     setModalContent(content);
//   };

//   const closeModal = () => setModalContent(null);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-0 bg-[#f8f9fe] overflow-auto relative">
//         <div className={`${gradientBg} p-8 pb-5 rounded-b-3xl shadow-lg flex flex-col sticky top-0 z-20`}>
//           <div className="flex flex-row justify-between items-start">
//             <div>
//               <h2 className="text-4xl font-extrabold text-white tracking-tighter">Fitness Dashboard</h2>
//               <div className="text-white/70 mt-2 font-medium">Your wellness and fitness analytics</div>
//             </div>
//             <div className="bg-white px-5 py-2 rounded-lg text-[#5e72e4] font-bold shadow flex items-center select-none cursor-default">
//               {user?.name || user?.fullName || `${user?.given_name} ${user?.family_name}` || 'User'}
//             </div>
//           </div>

//           <div className="flex flex-row gap-6 mt-7 flex-wrap">
//             <StatCard
//               icon={<span>⏱️</span>}
//               label="TOTAL TIME (min)"
//               value={chartData.reduce((sum, a) => sum + a.duration, 0).toFixed(1)}
//               delta={chartData.length > 1 ? `${(chartData[chartData.length - 1].duration - chartData[0].duration).toFixed(1)} min change` : "N/A"}
//               deltaColor="text-green-500"
//               iconColor="#e4e8ef"
//             />
//             <StatCard
//               icon={<span>🧑‍💻</span>}
//               label="ACTIVITIES"
//               value={Number(totalActivities).toFixed(1)}
//               delta="▼ 3.5% Since last week"
//               deltaColor="text-red-500"
//               iconColor="#ffddde"
//             />
//             <StatCard
//               icon={<span>🔥</span>}
//               label="CALORIES"
//               value={Number(totalCalories).toFixed(1)}
//               delta={`${deltaArrow} ${Math.abs(deltaCalories).toFixed(1)} vs last week`}
//               deltaColor={deltaColor}
//               iconColor="#ffecd2"
//             />
//             <StatCard
//               icon={<span>🏅</span>}
//               label="AVERAGE CALORIES"
//               value={Number(avgCalories).toFixed(1)}
//               delta="▲ 12% Since last month"
//               deltaColor="text-green-500"
//               iconColor="#d2f8fc"
//             />
//           </div>
//         </div>

//         <div className="px-7 mt-7 space-y-10 pb-20">

//           <div
//             className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer"
//             onClick={() => openModal("caloriesLine")}
//             title="Click to open in fullscreen"
//           >
//             <h3 className="text-2xl font-bold text-[#5e72e4] mb-6">Calories Over Time (click for fullscreen)</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={caloriesLineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//                 <CartesianGrid stroke="#e6e6e6" />
//                 <XAxis dataKey="date" tick={{ fill: "#5e72e4" }} />
//                 <YAxis tick={{ fill: "#5e72e4" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="calories" stroke="#5e72e4" strokeWidth={3} dot={{ r: 5 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer"
//             onClick={() => openModal("weeklyBar")}
//             title="Click to open in fullscreen"
//           >
//             <h3 className="text-2xl font-bold text-[#ff5e57] mb-6">Weekly Calories Burned (click for fullscreen)</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart data={weeklyTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//                 <CartesianGrid stroke="#e6e6e6" />
//                 <XAxis dataKey="week" tick={{ fill: "#ff5e57" }} />
//                 <YAxis tick={{ fill: "#ff5e57" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="calories" fill="#ff5e57" barSize={40} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer"
//             onClick={() => openModal("activityPie")}
//             title="Click to open in fullscreen"
//           >
//             <h3 className="text-2xl font-bold text-[#5e72e4] mb-6">Activity Distribution (click for fullscreen)</h3>
//             <ResponsiveContainer width="100%" height={400}>
//               <PieChart>
//                 <Pie
//                   data={activityTypeDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={160}
//                   fill="#5e72e4"
//                   dataKey="value"
//                 >
//                   {activityTypeDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="mx-7 mt-8 mb-14">
//           <div className="bg-gradient-to-tr from-[#5e72e4] via-[#11cdef] to-[#3EC6E0] rounded-2xl shadow-lg p-8 text-white text-lg font-bold w-full">
//             <div className="mb-3 text-2xl">Personalized Recommendation:</div>
//             <div className="mb-4 text-base font-semibold">{recommendation}</div>
//             <ul className="list-disc ml-5">
//               {tips.map((tip, idx) => (
//                 <li key={idx} className="font-normal text-base">{tip}</li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
//             {topActivity && (
//               <div className="flex-1 bg-green-100 p-6 rounded-xl shadow text-lg font-semibold text-green-700 mb-2">
//                 🏆 Highest calorie activity: <span className="font-bold">{topActivity.name}</span><br />
//                 Calories: <span className="font-bold">{topActivity.calories}</span>, Duration: <span className="font-bold">{topActivity.duration}</span> min
//               </div>
//             )}
//             {bottomActivity && (
//               <div className="flex-1 bg-yellow-100 p-6 rounded-xl shadow text-lg font-semibold text-yellow-800">
//                 🚩 Lowest calorie activity: <span className="font-bold">{bottomActivity.name}</span><br />
//                 Calories: <span className="font-bold">{bottomActivity.calories}</span>, Duration: <span className="font-bold">{bottomActivity.duration}</span> min
//               </div>
//             )}
//           </div>
//         </div>

//         <Modal isOpen={!!modalContent} onClose={closeModal}>
//           {modalContent}
//         </Modal>
//       </main>
//     </div>
//   );
// }





// import React, { useEffect, useState, useContext } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell
// } from "recharts";
// import { AuthContext } from "react-oauth2-code-pkce";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import api from "../services/api";

// const COLORS = ['#4F46E5', '#06B6D4', '#6366F1', '#F97316', '#22C55E', '#EF4444', '#EAB308', '#F59E0B', '#14B8A6', '#F87171', '#8B5CF6', '#FBBF24', '#EAB308', '#3B82F6', '#A78BFA'];

// const StatCard = ({ icon, label, value, delta, deltaColor }) => (
//   <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
//     <div className="flex items-center mb-4">
//       <div className="p-2 bg-indigo-100 rounded-lg mr-3">{icon}</div>
//       <span className="text-sm font-medium text-gray-500">{label}</span>
//     </div>
//     <div className="text-2xl font-bold text-gray-900">{value}</div>
//     <div className={`text-xs font-medium ${deltaColor} mt-2`}>{delta}</div>
//   </div>
// );

// const getWeek = (dateStr) => {
//   const date = new Date(dateStr);
//   const start = date.getDate() - date.getDay();
//   const weekStart = new Date(date.setDate(start));
//   return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const Sidebar = () => {
//   const { logOut, token } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const navItems = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Activities", path: "/activities" },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 fixed">
//       <h1 className="text-2xl font-bold text-indigo-600 mb-10 cursor-pointer" onClick={() => navigate('/')}>
//         FitTrack
//       </h1>
//       <nav className="space-y-4">
//         {token && navItems.map(({ label, path }) => (
//           <button
//             key={label}
//             onClick={() => navigate(path)}
//             className="w-full text-left py-2 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition text-gray-700 font-medium"
//           >
//             {label}
//           </button>
//         ))}
//         {token && (
//           <button
//             onClick={() => { logOut(); navigate("/"); }}
//             className="w-full text-left py-2 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-gray-700 font-medium"
//           >
//             Logout
//           </button>
//         )}
//       </nav>
//     </aside>
//   );
// };

// export default function Dashboard() {
//   const user = useSelector((state) => state.auth.user);
//   const [summary, setSummary] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [aiTips, setAiTips] = useState([]);
//   const [modalContent, setModalContent] = useState(null);

//   let chartData = [];
//   let caloriesLineData = [];
//   let weeklyTrendData = [];
//   let activityTypeDistribution = [];
//   let topActivity = null;
//   let bottomActivity = null;
//   let lastWeekCalories = 0;
//   let thisWeekCalories = 0;

//   if (activities.length > 0) {
//     chartData = activities.map((a) => ({
//       name: (a.activityType || a.type || "Unknown").replace(/^ActivityType\./, ""),
//       calories: Number(a.caloriesBurnt ?? a.caloriesBurned ?? 0),
//       duration: Number(a.duration ?? 0),
//       date: a.timestamp ? new Date(a.timestamp).toLocaleDateString() : null,
//       week: a.timestamp ? getWeek(a.timestamp) : null,
//     })).filter((a) => a.date !== null);

//     const caloriesByDate = chartData.reduce((acc, a) => {
//       acc[a.date] = (acc[a.date] || 0) + a.calories;
//       return acc;
//     }, {});
//     caloriesLineData = Object.entries(caloriesByDate).map(([date, calories]) => ({ date, calories }));

//     const weeklyObj = chartData.reduce((acc, a) => {
//       if (a.week) acc[a.week] = (acc[a.week] || 0) + a.calories;
//       return acc;
//     }, {});
//     weeklyTrendData = Object.entries(weeklyObj).map(([week, calories]) => ({ week, calories }));

//     const typeObj = chartData.reduce((acc, a) => {
//       acc[a.name] = (acc[a.name] || 0) + 1;
//       return acc;
//     }, {});
//     activityTypeDistribution = Object.entries(typeObj).map(([name, value]) => ({ name, value }));

//     const sortedByCalories = [...chartData].sort((a, b) => b.calories - a.calories);
//     topActivity = sortedByCalories[0];
//     bottomActivity = sortedByCalories[sortedByCalories.length - 1];

//     const weeks = weeklyTrendData.map((w) => w.week).sort();
//     if (weeks.length >= 2) {
//       lastWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 2])?.calories || 0;
//       thisWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 1])?.calories || 0;
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [summaryRes, activitiesRes, aiRes] = await Promise.all([
//           api.get("/activities/summary"),
//           api.get("/activities"),
//           api.get(`/recommendations/user/${user?.sub || user?.id || user?.userId || ""}`),
//         ]);
//         setSummary(summaryRes.data);
//         setActivities(activitiesRes.data);
//         if (aiRes.data && aiRes.data.length > 0) {
//           const rec = aiRes.data[0];
//           setAiTips([...(rec.suggestions || []), ...(rec.improvements || []), ...(rec.safety || [])]);
//         }
//       } catch (err) {
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
//   if (error) return <div className="text-red-600 text-center py-12 text-xl">{error}</div>;

//   const totalCalories = summary.totalCalories || 0;
//   const totalActivities = summary.totalActivities || 0;
//   const avgCalories = totalActivities > 0 ? (totalCalories / totalActivities).toFixed(1) : 0;
//   const totalDuration = chartData.reduce((sum, a) => sum + a.duration, 0).toFixed(1);

//   const deltaCalories = thisWeekCalories - lastWeekCalories;
//   const deltaColor = deltaCalories > 0 ? "text-green-500" : "text-red-500";
//   const deltaArrow = deltaCalories > 0 ? "↑" : "↓";

//   let recommendation = "";
//   if (totalActivities === 0) {
//     recommendation = "Start logging activities for personalized insights!";
//   } else if (avgCalories < 180) {
//     recommendation = "Consider increasing workout intensity or duration.";
//   } else if (deltaCalories > 0) {
//     recommendation = "Great progress! You're burning more than last week.";
//   } else if (deltaCalories < 0) {
//     recommendation = "Aim to match or exceed last week's burn.";
//   } else {
//     recommendation = "Solid consistency – keep it up for long-term gains.";
//   }

//   const tips = aiTips.length > 0 ? aiTips : [
//     "Stay hydrated during workouts.",
//     "Incorporate rest days for recovery.",
//     "Mix cardio and strength training.",
//     "Track progress to stay motivated.",
//   ];

//   const openModal = (chartType) => {
//     let content;
//     switch (chartType) {
//       case "caloriesLine":
//         content = (
//           <ResponsiveContainer width="100%" height={500}>
//             <LineChart data={caloriesLineData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="calories" stroke="#4F46E5" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         );
//         break;
//       case "weeklyBar":
//         content = (
//           <ResponsiveContainer width="100%" height={500}>
//             <BarChart data={weeklyTrendData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="week" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="calories" fill="#06B6D4" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//         break;
//       case "activityPie":
//         content = (
//           <ResponsiveContainer width="100%" height={500}>
//             <PieChart>
//               <Pie data={activityTypeDistribution} dataKey="value" label>
//                 {activityTypeDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         );
//         break;
//       default:
//         break;
//     }
//     setModalContent(content);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <main className="flex-1 ml-64 p-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500">Your fitness overview</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
//             label="Total Duration"
//             value={`${totalDuration} min`}
//             delta="N/A"
//             deltaColor="text-gray-500"
//           />
//           <StatCard
//             icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
//             label="Activities"
//             value={totalActivities}
//             delta="N/A"
//             deltaColor="text-gray-500"
//           />
//           <StatCard
//             icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V3" /></svg>}
//             label="Total Calories"
//             value={totalCalories}
//             delta={`${deltaArrow} ${Math.abs(deltaCalories)} vs last week`}
//             deltaColor={deltaColor}
//           />
//           <StatCard
//             icon={<svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
//             label="Avg Calories"
//             value={avgCalories}
//             delta="N/A"
//             deltaColor="text-gray-500"
//           />
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer" onClick={() => openModal("caloriesLine")}>
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Calories Over Time</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={caloriesLineData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="calories" stroke="#4F46E5" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer" onClick={() => openModal("weeklyBar")}>
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Calories</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={weeklyTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="calories" fill="#06B6D4" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 cursor-pointer" onClick={() => openModal("activityPie")}>
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={activityTypeDistribution} dataKey="value" label>
//                 {activityTypeDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Personalized Recommendation</h3>
//           <p className="text-gray-700 mb-4">{recommendation}</p>
//           <ul className="space-y-2">
//             {tips.map((tip, idx) => (
//               <li key={idx} className="flex items-start text-gray-600">
//                 <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//                 {tip}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {topActivity && (
//             <div className="bg-green-50 rounded-2xl p-6">
//               <h3 className="text-lg font-bold text-green-800 mb-2">Top Activity</h3>
//               <p className="text-gray-700">{topActivity.name} - {topActivity.calories} cal, {topActivity.duration} min</p>
//             </div>
//           )}
//           {bottomActivity && (
//             <div className="bg-yellow-50 rounded-2xl p-6">
//               <h3 className="text-lg font-bold text-yellow-800 mb-2">Lowest Activity</h3>
//               <p className="text-gray-700">{bottomActivity.name} - {bottomActivity.calories} cal, {bottomActivity.duration} min</p>
//             </div>
//           )}
//         </div>
//         <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
//           {modalContent}
//         </Modal>
//       </main>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import api from "../services/api";

const COLORS = ['#00A86B', '#6A0DAD', '#DC143C', '#FFD700', '#4B5EAA', '#FBBF24', '#3B82F6', '#A78BFA', '#14B8A6'];

const StatCard = ({ icon, label, value, delta, deltaColor }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transition-all hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] hover:scale-105">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-green-100 rounded-lg mr-3 animate-pulse">{icon}</div>
      <span className="text-sm font-medium text-gray-500 font-poppins">{label}</span>
    </div>
    <div className="text-2xl font-bold text-green-600 font-montserrat">{value}</div>
    <div className={`text-xs font-medium ${deltaColor} mt-2 font-poppins`}>{delta}</div>
  </div>
);

const getWeek = (dateStr) => {
  const date = new Date(dateStr);
  const start = date.getDate() - date.getDay();
  const weekStart = new Date(date.setDate(start));
  return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-auto shadow-[0_0_20px_rgba(0,168,107,0.7)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-green-600 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};


export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiTips, setAiTips] = useState([]);
  const [modalContent, setModalContent] = useState(null);

  let chartData = [];
  let caloriesLineData = [];
  let weeklyTrendData = [];
  let activityTypeDistribution = [];
  let topActivity = null;
  let bottomActivity = null;
  let lastWeekCalories = 0;
  let thisWeekCalories = 0;

  if (activities.length > 0) {
    chartData = activities.map((a) => ({
      name: (a.activityType || a.type || "Unknown").replace(/^ActivityType\./, ""),
      calories: Number(a.caloriesBurnt ?? a.caloriesBurned ?? 0),
      duration: Number(a.duration ?? 0),
      date: a.timestamp ? new Date(a.timestamp).toLocaleDateString() : null,
      week: a.timestamp ? getWeek(a.timestamp) : null,
    })).filter((a) => a.date !== null);

    const caloriesByDate = chartData.reduce((acc, a) => {
      acc[a.date] = (acc[a.date] || 0) + a.calories;
      return acc;
    }, {});
    caloriesLineData = Object.entries(caloriesByDate).map(([date, calories]) => ({ date, calories }));

    const weeklyObj = chartData.reduce((acc, a) => {
      if (a.week) acc[a.week] = (acc[a.week] || 0) + a.calories;
      return acc;
    }, {});
    weeklyTrendData = Object.entries(weeklyObj).map(([week, calories]) => ({ week, calories }));

    const typeObj = chartData.reduce((acc, a) => {
      acc[a.name] = (acc[a.name] || 0) + 1;
      return acc;
    }, {});
    activityTypeDistribution = Object.entries(typeObj).map(([name, value]) => ({ name, value }));

    const sortedByCalories = [...chartData].sort((a, b) => b.calories - a.calories);
    topActivity = sortedByCalories[0];
    bottomActivity = sortedByCalories[sortedByCalories.length - 1];

    const weeks = weeklyTrendData.map((w) => w.week).sort();
    if (weeks.length >= 2) {
      lastWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 2])?.calories || 0;
      thisWeekCalories = weeklyTrendData.find((w) => w.week === weeks[weeks.length - 1])?.calories || 0;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, activitiesRes, aiRes] = await Promise.all([
          api.get("/activities/summary"),
          api.get("/activities"),
          api.get(`/recommendations/user/${user?.sub || user?.id || user?.userId || ""}`),
        ]);
        setSummary(summaryRes.data);
        setActivities(activitiesRes.data);
        if (aiRes.data && aiRes.data.length > 0) {
          const rec = aiRes.data[0];
          setAiTips([...(rec.suggestions || []), ...(rec.improvements || []), ...(rec.safety || [])]);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-12 text-xl font-poppins">{error}</div>;
  }

  const totalCalories = summary.totalCalories || 0;
  const totalActivities = summary.totalActivities || 0;
  const avgCalories = totalActivities > 0 ? (totalCalories / totalActivities).toFixed(1) : 0;
  const totalDuration = chartData.reduce((sum, a) => sum + a.duration, 0).toFixed(1);

  const deltaCalories = thisWeekCalories - lastWeekCalories;
  const deltaColor = deltaCalories > 0 ? "text-yellow-400" : "text-blue-600";
  const deltaArrow = deltaCalories > 0 ? "↑" : "↓";

  let recommendation = "";
  if (totalActivities === 0) {
    recommendation = "Start logging activities for personalized insights!";
  } else if (avgCalories < 180) {
    recommendation = "Consider increasing workout intensity or duration.";
  } else if (deltaCalories > 0) {
    recommendation = "Great progress! You're burning more than last week.";
  } else if (deltaCalories < 0) {
    recommendation = "Aim to match or exceed last week's burn.";
  } else {
    recommendation = "Solid consistency – keep it up for long-term gains.";
  }

  const tips = aiTips.length > 0 ? aiTips : [
    "Stay hydrated during workouts.",
    "Incorporate rest days for recovery.",
    "Mix cardio and strength training.",
    "Track progress to stay motivated.",
  ];

  const openModal = (chartType) => {
    let content;
    switch (chartType) {
      case "caloriesLine":
        content = (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={caloriesLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
              <XAxis dataKey="date" stroke="#00A86B" />
              <YAxis stroke="#00A86B" />
              <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #00A86B', color: '#FFFFFF' }} />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#00A86B" strokeWidth={2} dot={{ fill: '#FFD700', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        );
        break;
      case "weeklyBar":
        content = (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
              <XAxis dataKey="week" stroke="#6A0DAD" />
              <YAxis stroke="#6A0DAD" />
              <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #6A0DAD', color: '#FFFFFF' }} />
              <Legend />
              <Bar dataKey="calories" fill="#6A0DAD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        break;
      case "activityPie":
        content = (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie data={activityTypeDistribution} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {activityTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #00A86B', color: '#FFFFFF' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        break;
      default:
        break;
    }
    setModalContent(content);
  };

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-montserrat">Dashboard</h1>
          <p className="text-gray-400">Track your fitness journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Total Duration"
            value={`${totalDuration} min`}
            delta="N/A"
            deltaColor="text-gray-500"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            label="Activities"
            value={totalActivities}
            delta="N/A"
            deltaColor="text-gray-500"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V3" /></svg>}
            label="Total Calories"
            value={totalCalories}
            delta={`${deltaArrow} ${Math.abs(deltaCalories)} vs last week`}
            deltaColor={deltaColor}
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            label="Avg Calories"
            value={avgCalories}
            delta="N/A"
            deltaColor="text-gray-500"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition animate-pulse" onClick={() => openModal("caloriesLine")}>
            <h3 className="text-lg font-bold text-green-600 mb-4 font-montserrat">Calories Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={caloriesLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
                <XAxis dataKey="date" stroke="#00A86B" />
                <YAxis stroke="#00A86B" />
                <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #00A86B', color: '#FFFFFF' }} />
                <Line type="monotone" dataKey="calories" stroke="#00A86B" strokeWidth={2} dot={{ fill: '#FFD700', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-[0_0_15px_rgba(106,13,173,0.5)] transition animate-pulse" onClick={() => openModal("weeklyBar")}>
            <h3 className="text-lg font-bold text-purple-700 mb-4 font-montserrat">Weekly Calories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
                <XAxis dataKey="week" stroke="#6A0DAD" />
                <YAxis stroke="#6A0DAD" />
                <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #6A0DAD', color: '#FFFFFF' }} />
                <Bar dataKey="calories" fill="#6A0DAD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 cursor-pointer hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition animate-pulse" onClick={() => openModal("activityPie")}>
          <h3 className="text-lg font-bold text-green-600 mb-4 font-montserrat">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={activityTypeDistribution} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {activityTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#4A5568', borderRadius: '8px', border: '1px solid #00A86B', color: '#FFFFFF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-purple-700 rounded-2xl p-6 mb-8 text-white shadow-[0_0_15px_rgba(0,168,107,0.5)]">
          <h3 className="text-lg font-bold mb-4 font-montserrat">Personalized Recommendation</h3>
          <p className="mb-4 font-poppins">{recommendation}</p>
          <ul className="space-y-2">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-1 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-poppins">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topActivity && (
            <div className="bg-yellow-50 rounded-2xl p-6 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              <h3 className="text-lg font-bold text-yellow-800 mb-2 font-montserrat">Top Activity</h3>
              <p className="text-gray-700 font-poppins">{topActivity.name} - {topActivity.calories} cal, {topActivity.duration} min</p>
            </div>
          )}
          {bottomActivity && (
            <div className="bg-blue-50 rounded-2xl p-6 shadow-[0_0_10px_rgba(75,94,170,0.5)]">
              <h3 className="text-lg font-bold text-blue-800 mb-2 font-montserrat">Lowest Activity</h3>
              <p className="text-gray-700 font-poppins">{bottomActivity.name} - {bottomActivity.calories} cal, {bottomActivity.duration} min</p>
            </div>
          )}
        </div>
        <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
          {modalContent}
        </Modal>
      </main>
    </div>
  );
}