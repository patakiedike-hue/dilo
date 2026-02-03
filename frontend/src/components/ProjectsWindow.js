import React, { useState, useEffect } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const ProjectsWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex }) => {
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

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
  };

  if (isMinimized) return null;

  return (
    <>
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000]"
          onClick={() => setLightboxImage(null)}
          data-testid="lightbox-overlay"
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              data-testid="close-lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.filename}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              data-testid="lightbox-image"
            />
            
            {/* Filename */}
            <div className="absolute -bottom-10 left-0 right-0 text-center text-white text-sm">
              {lightboxImage.filename}
            </div>
          </div>
        </div>
      )}

      <div
        ref={elementRef}
        className="absolute animate-slide-up"
        style={{
          zIndex,
          left: `calc(12% + ${position.x}px)`,
          top: `calc(10% + ${position.y}px)`,
          width: "900px",
          height: "600px",
          cursor: isDragging ? 'grabbing' : 'default',
        }}
        onClick={onFocus}
        onMouseDown={handleMouseDown}
        data-testid="projects-window"
      >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
        {/* Window header */}
        <div className="window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
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
            <h2 className="text-sm font-semibold text-gray-700">Referencia - questgearhub.com</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="flex flex-1 h-[calc(100%-52px)]">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50/80 border-r border-gray-200 p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2">PORTFÓLIÓ</div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`px-2 py-1.5 rounded text-sm flex items-center space-x-2 cursor-pointer ${
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

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 animate-pulse">Betöltés...</div>
              </div>
            ) : !selectedFolder ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Válassz ki egy mappát a bal oldali menüből</p>
                </div>
              </div>
            ) : images.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Még nincsenek képek ebben a mappában</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
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
                        <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      {/* Image filename on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
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
      </div>
    </>
  );
};

export default ProjectsWindow;