// import React, { useState } from 'react';
// import { addActivity } from '../services/api';

// const activityTypes = [
//   'WALKING', 'RUNNING', 'CYCLING', 'SWIMMING', 'HIKING', 'ELLIPTICAL', 'ROWING', 'DANCING', 'YOGA',
//   'PILATES', 'CROSSFIT', 'BOXING', 'MARTIAL_ARTS', 'SKATING', 'SKIING', 'SNOWBOARDING', 'SURFING',
//   'CLIMBING', 'GYMNASTICS', 'AEROBICS', 'ZUMBA', 'SPINNING', 'TREADMILL', 'STRENGTH_TRAINING',
//   'HIIT', 'JUMP_ROPE', 'BADMINTON', 'TENNIS', 'TABLE_TENNIS', 'VOLLEYBALL', 'BASKETBALL', 'FOOTBALL',
//   'BASEBALL', 'GOLF', 'SKATEBOARDING', 'HORSE_RIDING', 'SQUASH', 'ROWING_MACHINE', 'STAIR_CLIMBING', 'OTHER'
// ];

// const METS = {
//   WALKING: 3.5, RUNNING: 7.0, CYCLING: 6.8, SWIMMING: 8.0, HIKING: 6.0, ELLIPTICAL: 5.0, ROWING: 7.0, DANCING: 5.5, YOGA: 3.0,
//   PILATES: 3.0, CROSSFIT: 8.0, BOXING: 7.8, MARTIAL_ARTS: 10.3, SKATING: 7.0, SKIING: 7.0, SNOWBOARDING: 5.3, SURFING: 3.0,
//   CLIMBING: 8.0, GYMNASTICS: 3.8, AEROBICS: 6.5, ZUMBA: 5.5, SPINNING: 7.5, TREADMILL: 6.0, STRENGTH_TRAINING: 6.0,
//   HIIT: 8.0, JUMP_ROPE: 12.3, BADMINTON: 4.5, TENNIS: 7.3, TABLE_TENNIS: 4.0, VOLLEYBALL: 3.0, BASKETBALL: 6.5, FOOTBALL: 7.0,
//   BASEBALL: 5.0, GOLF: 4.8, SKATEBOARDING: 5.0, HORSE_RIDING: 5.5, SQUASH: 7.3, ROWING_MACHINE: 7.0, STAIR_CLIMBING: 8.8, OTHER: 3.5
// };

// const AVG_WEIGHT = 70;

// const ActivityForm = ({ onActivityAdded }) => {
//   const [activity, setActivity] = useState({
//     activityType: 'RUNNING',
//     duration: '',
//     caloriesBurned: '',
//     additionalMetrics: {},
//   });
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let calories = activity.caloriesBurned;
//     if (!calories && activity.activityType && activity.duration) {
//       const met = METS[activity.activityType] || 3.5;
//       calories = Math.round(met * AVG_WEIGHT * (parseFloat(activity.duration) / 60));
//     }
//     setLoading(true);
//     try {
//       // Send caloriesBurnt (not caloriesBurned) to match backend DTO
//       await addActivity({
//         ...activity,
//         caloriesBurnt: calories,
//         caloriesBurned: undefined // Remove caloriesBurned to avoid confusion
//       });
//       setActivity({ activityType: 'RUNNING', duration: '', caloriesBurned: '' });
//       setSuccessMsg('Activity added successfully!');
//       onActivityAdded();
//     } catch (error) {
//       setSuccessMsg('Failed to add activity.');
//     }
//     setLoading(false);
//     setTimeout(() => setSuccessMsg(''), 2500);
//   };

//   return (
//     <div className="max-w-lg w-full mx-auto rounded-2xl shadow-xl bg-white px-8 py-10 mt-7 mb-10">
//       <div className="flex items-center mb-6">
//         <div className="rounded-full bg-gradient-to-br from-[#5e72e4] to-[#11cdef] h-11 w-11 flex items-center justify-center text-white text-xl mr-3 shadow">
//           <span role="img" aria-label="activity">🏃</span>
//         </div>
//         <h2 className="text-2xl font-extrabold text-[#5e72e4] tracking-wide">Add Activity</h2>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-2 font-bold text-gray-700">Activity Type</label>
//           <select
//             className="w-full border-2 border-[#e4e8ef] rounded-lg px-3 py-2 bg-[#f8f9fe] focus:ring-2 focus:ring-[#11cdef] transition text-gray-700 font-semibold"
//             value={activity.activityType}
//             onChange={(e) => setActivity({ ...activity, activityType: e.target.value })}
//           >
//             {activityTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block mb-2 font-bold text-gray-700">Duration (Minutes)</label>
//           <input
//             className="w-full border-2 border-[#e4e8ef] rounded-lg px-3 py-2 bg-[#f8f9fe] focus:ring-2 focus:ring-[#11cdef] font-semibold"
//             type="number"
//             value={activity.duration}
//             onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
//             required
//             placeholder="e.g. 45"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-bold text-gray-700">Calories Burned <span className="text-gray-400 font-normal">(optional)</span></label>
//           <input
//             className="w-full border-2 border-[#e4e8ef] rounded-lg px-3 py-2 bg-[#f8f9fe] focus:ring-2 focus:ring-[#5e72e4] font-semibold"
//             type="number"
//             value={activity.caloriesBurned}
//             onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
//             placeholder="Auto-predict if left blank"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-[#5e72e4] to-[#11cdef] text-white shadow-lg hover:opacity-90 transition text-lg"
//         >
//           {loading ? 'Adding...' : 'Add Activity'}
//         </button>
//         {successMsg && (
//           <div className="mt-2 text-center text-[#5e72e4] font-semibold">{successMsg}</div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ActivityForm;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addActivity } from '../services/api';

const activityTypes = [
  'WALKING', 'RUNNING', 'CYCLING', 'SWIMMING', 'HIKING', 'ELLIPTICAL', 'ROWING', 'DANCING', 'YOGA',
  'PILATES', 'CROSSFIT', 'BOXING', 'MARTIAL_ARTS', 'SKATING', 'SKIING', 'SNOWBOARDING', 'SURFING',
  'CLIMBING', 'GYMNASTICS', 'AEROBICS', 'ZUMBA', 'SPINNING', 'TREADMILL', 'STRENGTH_TRAINING',
  'HIIT', 'JUMP_ROPE', 'BADMINTON', 'TENNIS', 'TABLE_TENNIS', 'VOLLEYBALL', 'BASKETBALL', 'FOOTBALL',
  'BASEBALL', 'GOLF', 'SKATEBOARDING', 'HORSE_RIDING', 'SQUASH', 'ROWING_MACHINE', 'STAIR_CLIMBING', 'OTHER'
];

const METS = {
  WALKING: 3.5, RUNNING: 7.0, CYCLING: 6.8, SWIMMING: 8.0, HIKING: 6.0, ELLIPTICAL: 5.0, ROWING: 7.0, DANCING: 5.5, YOGA: 3.0,
  PILATES: 3.0, CROSSFIT: 8.0, BOXING: 7.8, MARTIAL_ARTS: 10.3, SKATING: 7.0, SKIING: 7.0, SNOWBOARDING: 5.3, SURFING: 3.0,
  CLIMBING: 8.0, GYMNASTICS: 3.8, AEROBICS: 6.5, ZUMBA: 5.5, SPINNING: 7.5, TREADMILL: 6.0, STRENGTH_TRAINING: 6.0,
  HIIT: 8.0, JUMP_ROPE: 12.3, BADMINTON: 4.5, TENNIS: 7.3, TABLE_TENNIS: 4.0, VOLLEYBALL: 3.0, BASKETBALL: 6.5, FOOTBALL: 7.0,
  BASEBALL: 5.0, GOLF: 4.8, SKATEBOARDING: 5.0, HORSE_RIDING: 5.5, SQUASH: 7.3, ROWING_MACHINE: 7.0, STAIR_CLIMBING: 8.8, OTHER: 3.5
};

const AVG_WEIGHT = 70;


const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    activityType: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let calories = activity.caloriesBurned;
    if (!calories && activity.activityType && activity.duration) {
      const met = METS[activity.activityType] || 3.5;
      calories = Math.round(met * AVG_WEIGHT * (parseFloat(activity.duration) / 60));
    }
    setLoading(true);
    try {
      await addActivity({
        ...activity,
        caloriesBurnt: calories,
        caloriesBurned: undefined
      });
      setActivity({ activityType: 'RUNNING', duration: '', caloriesBurned: '' });
      setSuccessMsg('Activity added successfully!');
      onActivityAdded();
    } catch (error) {
      setSuccessMsg('Failed to add activity.');
    }
    setLoading(false);
    setTimeout(() => setSuccessMsg(''), 2500);
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
      <main className="flex-1 items-center p-8">
        <div className="max-w-lg w-full mx-auto rounded-2xl shadow-lg bg-white px-8 py-10 mt-7 mb-10 hover:shadow-[0_0_15px_rgba(0,168,107,0.5)] transition animate-pulse">
          <div className="flex items-center mb-6">
            <div className="rounded-full bg-green-100 h-11 w-11 flex items-center justify-center text-yellow-400 text-xl mr-3 shadow">
              <span role="img" aria-label="activity">🏃</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600 tracking-wide font-montserrat">Add Activity</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-obsidian font-poppins">Activity Type</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-600 transition text-obsidian font-poppins"
                value={activity.activityType}
                onChange={(e) => setActivity({ ...activity, activityType: e.target.value })}
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-obsidian font-poppins">Duration (Minutes)</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-600 transition text-obsidian font-poppins"
                type="number"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                required
                placeholder="e.g. 45"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-obsidian font-poppins">
                Calories Burned <span className="text-blue-600 font-normal">(optional)</span>
              </label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-600 transition text-obsidian font-poppins"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                placeholder="Auto-predict if left blank"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-bold rounded-lg bg-green-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(106,13,173,0.5)] transition text-lg font-montserrat ${loading ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add Activity'
              )}
            </button>
            {successMsg && (
              <div className="mt-2 text-center text-yellow-400 font-semibold font-poppins">
                {successMsg}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default ActivityForm;