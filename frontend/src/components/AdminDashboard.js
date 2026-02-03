import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuth) {
      navigate("/");
    }
    loadFolders();
  }, [navigate]);

  const loadFolders = async () => {
    try {
      const response = await axios.get(`${API}/folders`);
      setFolders(response.data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadImages = async (folderId) => {
    try {
      const response = await axios.get(`${API}/images/${folderId}`);
      setImages(response.data);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await axios.post(`${API}/folders`, { name: newFolderName });
      setNewFolderName("");
      setShowNewFolder(false);
      loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a mappát és a benne lévő képeket?")) return;

    try {
      await axios.delete(`${API}/folders/${folderId}`);
      setSelectedFolder(null);
      setImages([]);
      loadFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    loadImages(folder.id);
    if (isMobile) setShowMobileSidebar(false);
  };

  const handleUploadImage = async (e) => {
    if (!selectedFolder) {
      alert("Kérlek válassz ki egy mappát először!");
      return;
    }

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        console.log('Uploading file:', file.name, 'to folder:', selectedFolder.id);
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", selectedFolder.id);

        const response = await axios.post(`${API}/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        console.log('Upload successful:', response.data);
      }

      // Refresh images after successful upload
      await loadImages(selectedFolder.id);
      
      // Reset the input
      e.target.value = '';
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Hiba történt a képfeltöltés során: ${error.response?.data?.detail || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a képet?")) return;

    try {
      await axios.delete(`${API}/images/${imageId}`);
      loadImages(selectedFolder.id);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dopdx8kvy/image/upload/f_auto,q_auto/wallpapper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blur overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.15)",
        }}
      />
      {/* Top bar */}
      <div className="h-8 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="text-white text-sm hover:bg-white/10 px-2 py-1 rounded"
            data-testid="back-to-desktop"
          >
            ← Vissza
          </button>
          <span className="text-white text-sm font-semibold">Admin - Fájlkezelő</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Finder window */}
        <div className="m-4 flex-1 bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50/80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                  data-testid="new-folder-button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Új mappa</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <div className="text-xs font-semibold text-gray-500 mb-2 px-2">MAPPÁK</div>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${
                        selectedFolder?.id === folder.id
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200/50 text-gray-700"
                      }`}
                      onClick={() => handleFolderClick(folder)}
                      data-testid={`folder-item-${folder.id}`}
                    >
                      <div className="flex items-center space-x-2 text-sm flex-1 min-w-0">
                        <span>📁</span>
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:text-white rounded"
                        data-testid={`delete-folder-${folder.id}`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white/50">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedFolder ? selectedFolder.name : "Válassz egy mappát"}
                </h2>
                {selectedFolder && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                      data-testid="upload-image-input"
                    />
                    <div className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Kép feltöltés</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Content grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                {uploading && (
                  <div className="text-center py-8 text-gray-600">
                    <div className="animate-pulse">Feltöltés...</div>
                  </div>
                )}
                {!selectedFolder ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
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
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow"
                        data-testid={`image-item-${image.id}`}
                      >
                        <img
                          src={`${BACKEND_URL}${image.url}`}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          data-testid={`delete-image-${image.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New folder modal */}
      {showNewFolder && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowNewFolder(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="new-folder-modal"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Új mappa létrehozása</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Mappa neve"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              data-testid="new-folder-name-input"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFolder(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Mégse
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                data-testid="create-folder-submit"
              >
                Létrehozás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
