import React, { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const ContactWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex }) => {
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Hiba történt az üzenet küldése során. Kérlek próbáld újra.");
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) return null;

  return (
    <div
      ref={elementRef}
      className="absolute animate-slide-up"
      style={{
        zIndex,
        left: `calc(25% + ${position.x}px)`,
        top: `calc(20% + ${position.y}px)`,
        width: "500px",
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onClick={onFocus}
      onMouseDown={handleMouseDown}
      data-testid="contact-window"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20">
        {/* Window header */}
        <div className="window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              data-testid="close-contact-window"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-sm font-semibold text-gray-700">Árajánlat kérés</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-8" data-testid="success-message">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Köszönjük!</h3>
              <p className="text-gray-600">Az üzeneted sikeresen elküldve. Hamarosan keressünk!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Név</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Üzenet</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    data-testid="contact-message-input"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm" data-testid="error-message">
                  {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">szabolcssr8@gmail.com</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  data-testid="contact-submit-button"
                >
                  {loading ? "Küldés..." : "Küldés"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactWindow;