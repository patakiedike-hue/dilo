import React, { useState, useEffect } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const ProjectsWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex, isMobile }) => {
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFolders = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/folders`);
      const data = await response.json();
      setFolders(data);
      if (data.length > 0) {
        handleFolderClick(data[0]);
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadImages = async (folderId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/images/${folderId}`);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    loadImages(folder.id);
    if (isMobile) setShowMobileSidebar(false);
  };

  if (isMinimized) return null;

  // Mobile styles
  const mobileStyles = isMobile ? {
    position: 'fixed',
    left: '8px',
    right: '8px',
    top: '36px',
    bottom: '60px',
    width: 'auto',
    height: 'auto',
  } : {
    left: `calc(12% + ${position.x}px)`,
    top: `calc(10% + ${position.y}px)`,
    width: "900px",
    height: "600px",
  };

  return (
    <>
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setLightboxImage(null)}
          data-testid="lightbox-overlay"
        >
          <div className="relative max-w-[95vw] md:max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 md:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
              data-testid="close-lightbox"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.filename}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              data-testid="lightbox-image"
            />
            
            {/* Filename */}
            <div className="absolute -bottom-8 md:-bottom-10 left-0 right-0 text-center text-white text-xs md:text-sm">
              {lightboxImage.filename}
            </div>
          </div>
        </div>
      )}

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
        data-testid="projects-window"
      >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
        {/* Window header */}
        <div className={`window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 flex items-center justify-between ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              data-testid="close-projects-window"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xs md:text-sm font-semibold text-gray-700 truncate">Referencia</h2>
          </div>
          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          {!isMobile && <div className="w-16"></div>}
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile sidebar overlay */}
          {isMobile && showMobileSidebar && (
            <div 
              className="absolute inset-0 bg-black/40 z-10"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`${isMobile 
            ? `absolute left-0 top-0 bottom-0 z-20 transform transition-transform duration-300 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}` 
            : 'w-48 border-r border-gray-200'} bg-gray-50`}
          >
            <div className={`h-full ${isMobile ? 'w-56 shadow-xl' : ''} p-3`}>
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-semibold text-gray-500">PORTFÓLIÓ</span>
                {isMobile && (
                  <button onClick={() => setShowMobileSidebar(false)} className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`px-2 py-1.5 rounded text-xs md:text-sm flex items-center space-x-2 cursor-pointer ${
                      selectedFolder?.id === folder.id
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200/50 text-gray-700"
                    }`}
                    onClick={() => handleFolderClick(folder)}
                  >
                    <span>📁</span>
                    <span className="truncate">{folder.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/30">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 animate-pulse text-sm">Betöltés...</div>
              </div>
            ) : !selectedFolder ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs md:text-sm">Válassz ki egy mappát a bal oldali menüből</p>
                </div>
              </div>
            ) : images.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs md:text-sm">Még nincsenek képek ebben a mappában</p>
                </div>
              </div>
            ) : (
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3 md:gap-4`}>
                {images.map((image) => {
                  const imageUrl = image.url.startsWith('http') 
                    ? image.url 
                    : `${BACKEND_URL}${image.url}`;
                  
                  return (
                    <div
                      key={image.id}
                      className="aspect-square rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all cursor-pointer relative group"
                      onClick={() => setLightboxImage({ url: imageUrl, filename: image.filename })}
                      data-testid={`image-thumbnail-${image.id}`}
                    >
                      <img
                        src={imageUrl}
                        alt={image.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="eager"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      {/* Image filename on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] md:text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {image.filename}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsWindow;