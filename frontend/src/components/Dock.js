import React from "react";

const Dock = ({ windows, onWindowClick }) => {
  const dockItems = [
    {
      id: "finder",
      name: "Információ",
      icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853981255cc36b3a37af_finder.png",
    },
    {
      id: "siri",
      name: "AI",
      icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ff3bafbac60495771_siri.png",
    },
    {
      id: "projects",
      name: "Referencia",
      icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c55558a2e1192ee09_photos.png",
    },
    {
      id: "contact",
      name: "Kapcsolat",
      icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853a55558a68e192ee08_messages.png",
    },
    {
      id: "services",
      name: "Szolgáltatások",
      icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c849ec3735b52cef9_notes.png",
    },
    {
      id: "adminLogin",
      name: "Admin",
      icon: "https://img.icons8.com/?size=100&id=4PbFeZOKAc61&format=png&color=000000",
    },
  ];

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50" data-testid="dock">
      <div
        className="bg-white/10 backdrop-blur-3xl rounded-2xl px-3 py-2 border border-white/20 shadow-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-end space-x-2">
          {dockItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onWindowClick(item.id)}
              className="group relative"
              title={item.name}
              data-testid={`dock-${item.id}-icon`}
            >
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <img src={item.icon} alt={item.name} className="w-12 h-12" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-xl text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                  {item.name}
                </div>
              </div>
              
              {/* Active indicator */}
              {windows[item.id]?.open && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;