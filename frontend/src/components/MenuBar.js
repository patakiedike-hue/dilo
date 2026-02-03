import React, { useState, useEffect } from "react";

const MenuBar = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("hu-HU", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 md:h-8 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-2 md:px-4 z-50"
      data-testid="menu-bar"
    >
      {/* Left side */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <img
          src="https://res.cloudinary.com/dopdx8kvy/image/upload/f_auto,q_auto/web.png"
          alt="Logo"
          className="h-4 w-4 md:h-5 md:w-5"
        />
        <span className="text-white text-xs md:text-sm font-semibold truncate max-w-[140px] md:max-w-none">Weboldal készítés</span>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="text-white hover:bg-white/10 p-0.5 md:p-1 rounded hidden md:block">
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </button>
        
        <button className="text-white hover:bg-white/10 p-0.5 md:p-1 rounded hidden md:block">
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
        
        <div className="text-white text-xs md:text-sm" id="time">{currentTime}</div>
      </div>
    </div>
  );
};

export default MenuBar;