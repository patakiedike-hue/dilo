import React from "react";

const Loader = () => {
  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dopdx8kvy/image/upload/f_auto,q_auto/wallpapper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      />

      <div className="relative z-10 text-center">
        <div className="mb-8">
          <img
            src="https://res.cloudinary.com/dopdx8kvy/image/upload/f_auto,q_auto/web.png"
            alt="Logo"
            className="w-24 h-24 mx-auto animate-pulse"
          />
        </div>
        <h1 className="text-white text-3xl font-semibold mb-4 animate-fade-in">
          questgearhub.com
        </h1>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Loader;