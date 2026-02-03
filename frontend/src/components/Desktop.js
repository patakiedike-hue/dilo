import React, { useState, useEffect } from "react";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import FinderWindow from "./FinderWindow";
import ContactWindow from "./ContactWindow";
import ChatWindow from "./ChatWindow";
import ServicesWindow from "./ServicesWindow";
import ProjectsWindow from "./ProjectsWindow";
import AdminLoginWindow from "./AdminLoginWindow";
import { useNavigate } from "react-router-dom";

const Desktop = () => {
  const navigate = useNavigate();
  const [windows, setWindows] = useState({
    finder: { open: false, minimized: false, zIndex: 1 },
    siri: { open: false, minimized: false, zIndex: 1 },
    projects: { open: false, minimized: false, zIndex: 1 },
    contact: { open: false, minimized: false, zIndex: 1 },
    services: { open: false, minimized: false, zIndex: 1 },
    adminLogin: { open: false, minimized: false, zIndex: 1 },
  });
  const [highestZIndex, setHighestZIndex] = useState(10);

  useEffect(() => {
    // Auto-open Finder after mount
    const timer = setTimeout(() => {
      setHighestZIndex((prev) => prev + 1);
      setWindows((prev) => ({
        ...prev,
        finder: { open: true, minimized: false, zIndex: 11 },
      }));
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openWindow = (windowId) => {
    setHighestZIndex((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [windowId]: { open: true, minimized: false, zIndex: highestZIndex + 1 },
    }));
  };

  const closeWindow = (windowId) => {
    setWindows((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], open: false },
    }));
  };

  const minimizeWindow = (windowId) => {
    setWindows((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], minimized: true },
    }));
  };

  const restoreWindow = (windowId) => {
    setHighestZIndex((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], minimized: false, zIndex: highestZIndex + 1 },
    }));
  };

  const focusWindow = (windowId) => {
    setHighestZIndex((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], zIndex: highestZIndex + 1 },
    }));
  };

  const handleAdminSuccess = () => {
    closeWindow("adminLogin");
    navigate("/admin");
  };

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dopdx8kvy/image/upload/f_auto,q_auto/wallpapper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      data-testid="macos-desktop"
    >
      {/* Blur overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* Menu Bar */}
      <MenuBar />

      {/* Windows */}
      <div className="relative h-[calc(100vh-120px)]">
        {windows.finder.open && (
          <FinderWindow
            onClose={() => closeWindow("finder")}
            onMinimize={() => minimizeWindow("finder")}
            onFocus={() => focusWindow("finder")}
            isMinimized={windows.finder.minimized}
            zIndex={windows.finder.zIndex}
          />
        )}

        {windows.siri.open && (
          <ChatWindow
            onClose={() => closeWindow("siri")}
            onMinimize={() => minimizeWindow("siri")}
            onFocus={() => focusWindow("siri")}
            isMinimized={windows.siri.minimized}
            zIndex={windows.siri.zIndex}
          />
        )}

        {windows.projects.open && (
          <ProjectsWindow
            onClose={() => closeWindow("projects")}
            onMinimize={() => minimizeWindow("projects")}
            onFocus={() => focusWindow("projects")}
            isMinimized={windows.projects.minimized}
            zIndex={windows.projects.zIndex}
          />
        )}

        {windows.contact.open && (
          <ContactWindow
            onClose={() => closeWindow("contact")}
            onMinimize={() => minimizeWindow("contact")}
            onFocus={() => focusWindow("contact")}
            isMinimized={windows.contact.minimized}
            zIndex={windows.contact.zIndex}
          />
        )}

        {windows.services.open && (
          <ServicesWindow
            onClose={() => closeWindow("services")}
            onMinimize={() => minimizeWindow("services")}
            onFocus={() => focusWindow("services")}
            isMinimized={windows.services.minimized}
            zIndex={windows.services.zIndex}
          />
        )}

        {windows.adminLogin.open && (
          <AdminLoginWindow
            onClose={() => closeWindow("adminLogin")}
            onMinimize={() => minimizeWindow("adminLogin")}
            onFocus={() => focusWindow("adminLogin")}
            onSuccess={handleAdminSuccess}
            isMinimized={windows.adminLogin.minimized}
            zIndex={windows.adminLogin.zIndex}
          />
        )}
      </div>

      {/* Dock */}
      <Dock
        windows={windows}
        onWindowClick={(windowId) => {
          if (windows[windowId].open && windows[windowId].minimized) {
            restoreWindow(windowId);
          } else if (!windows[windowId].open) {
            openWindow(windowId);
          } else {
            focusWindow(windowId);
          }
        }}
      />
    </div>
  );
};

export default Desktop;