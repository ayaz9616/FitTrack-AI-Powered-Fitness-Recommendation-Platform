// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getActivities } from '../services/api';

// const ActivityList = ({ refresh }) => {
//   const [activities, setActivities] = useState([]);
//   const navigate = useNavigate();

//   const fetchActivities = async () => {
//     try {
//       const response = await getActivities();
//       setActivities(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, [refresh]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
//       {activities.map((activity) => (
//         <div
//           key={activity.id}
//           className="group bg-background border border-accent rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-150 hover:shadow-2xl hover:-translate-y-1 hover:border-primary hover:ring-2 hover:ring-secondary"
//           onClick={() => navigate(`/activities/${activity.id}`)}
//         >
//           <div className="text-lg font-extrabold text-primary group-hover:text-secondary truncate mb-2">
//             {activity.type || activity.activityType}
//             {activity.name ? ` - ${activity.name}` : ''}
//           </div>
//           <div className="flex gap-6 items-center">
//             <div className="text-neutral text-sm font-semibold">
//               Duration:&nbsp;
//               <span className="font-bold text-neutral">{activity.duration} min</span>
//             </div>
//             <div className="text-neutral text-sm font-semibold">
//               Calories:&nbsp;
//               <span className="font-bold text-accent">
//                 {activity.caloriesBurned ?? activity.caloriesBurnt ?? 'N/A'}
//               </span>
//             </div>
//           </div>
//         </div>
//       ))}
//       {activities.length === 0 && (
//         <div className="col-span-full text-center py-16 text-neutral font-bold text-xl">
//           No activities found. Add your first one!
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActivityList;













import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';

const ActivityList = ({ refresh }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refresh]);

  return (
    <div className="space-y-4">
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
      <h2 className="text-2xl font-bold text-green-600 font-montserrat">Your Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group bg-white border border-gray-300 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-150 hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] hover:-translate-y-1 animate-pulse"
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <div className="text-lg font-bold text-green-600 group-hover:text-purple-700 truncate mb-2 font-montserrat">
              {(activity.type || activity.activityType || 'Unknown')}
              {activity.name ? ` - ${activity.name}` : ''}
            </div>
            <div className="flex gap-6 items-center">
              <div className="text-obsidian text-sm font-medium font-poppins">
                Duration:&nbsp;
                <span className="font-bold">{activity.duration} min</span>
              </div>
              <div className="text-obsidian text-sm font-medium font-poppins">
                Calories:&nbsp;
                <span className="font-bold text-red-600">
                  {activity.caloriesBurned ?? activity.caloriesBurnt ?? 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-blue-600 font-bold text-xl font-poppins mb-4">
              No activities found. Add your first one!
            </p>
            <button
              onClick={() => navigate("/activities/new")}
              className="py-2 px-4 rounded-lg bg-green-600 text-white font-medium font-montserrat hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(106,13,173,0.5)] transition animate-pulse"
            >
              Log New Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;