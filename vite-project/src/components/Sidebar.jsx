import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "react-oauth2-code-pkce";

const Sidebar = () => {
  const { logIn, logOut, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Activities", path: "/activities" },
  ];

  return (
  <aside className="w-64 bg-gradient-to-b from-green-600 to-purple-700 min-h-screen p-6 fixed text-white">
      <div
  className="flex items-center space-x-3 cursor-pointer select-none mb-8 transition-all"
        onClick={() => navigate("/")}
        aria-label="FitTrack Home"
      >
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="#00A86B"
          />
          <path
            d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            fill="#FFD700"
          />
        </svg>
        <span className="text-3xl font-bold text-yellow-400 font-montserrat">FitTrack</span>
      </div>
      <hr className="border-white/20 mb-6" />
      <nav className="space-y-6">
        {!token ? (
          <button
            onClick={() => logIn()}
            className="w-full flex items-center py-3 px-4 rounded-lg border-l-4 border-transparent hover:bg-white/10 hover:scale-105 transition-all text-white font-medium font-poppins"
            aria-label="Login or Register"
          >
            Login / Register
          </button>
        ) : (
          <>
            {navItems.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full flex items-center py-3 px-4 rounded-lg border-l-4 ${
                  currentPath === path
                    ? "border-green-600 bg-white/10 text-yellow-400"
                    : "border-transparent hover:bg-white/10 hover:shadow-[0_0_10px_rgba(220,20,60,0.5)]"
                } hover:scale-105 transition-all text-white font-medium font-poppins`}
                aria-current={currentPath === path ? "page" : undefined}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { logOut(); navigate("/"); }}
              className="w-full flex items-center py-3 px-4 rounded-lg border-l-4 border-transparent hover:bg-red-600/30 hover:shadow-[0_0_10px_rgba(220,20,60,0.5)] hover:scale-105 transition-all text-white font-medium font-poppins"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
