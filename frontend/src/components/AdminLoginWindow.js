import React, { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const AdminLoginWindow = ({ onClose, onMinimize, onFocus, onSuccess, isMinimized, zIndex, isMobile }) => {
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        onSuccess();
      } else {
        setError(data.message);
        setPassword("");
      }
    } catch (err) {
      setError("Bejelentkezési hiba történt");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) return null;

  // Mobile styles
  const mobileStyles = isMobile ? {
    position: 'fixed',
    left: '16px',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 'auto',
  } : {
    left: `calc(35% + ${position.x}px)`,
    top: `calc(25% + ${position.y}px)`,
    width: "400px",
  };

  return (
    <div
      ref={elementRef}
      className={`${isMobile ? 'fixed' : 'absolute'} animate-slide-up`}
      style={{
        zIndex,
        ...mobileStyles,
        cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'default'),
      }}
      onClick={onFocus}
      onMouseDown={isMobile ? undefined : handleMouseDown}
      data-testid="admin-login-window"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20">
        {/* Window header */}
        <div className={`window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 flex items-center justify-between ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              data-testid="close-admin-login-window"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xs md:text-sm font-semibold text-gray-700">Admin belépés</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200 shadow-lg">
              <svg
                className="w-8 h-8 md:w-12 md:h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          {/* Username */}
          <h2 className="text-lg md:text-xl font-medium text-center mb-4 md:mb-6 text-gray-800">admin</h2>

          {/* Password form */}
          <form onSubmit={handleLogin} data-testid="admin-login-form">
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Írja be a jelszavát"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                disabled={loading}
                data-testid="admin-password-input"
              />
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-xs md:text-sm text-center animate-fade-in" data-testid="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm md:text-base"
              data-testid="admin-login-submit-button"
            >
              {loading ? "Bejelentkezés..." : "Bejelentkezés"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginWindow;