import React, { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const ServicesWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex, isMobile }) => {
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      name: "Bemutatkozó weboldal",
      price: "80.000 – 150.000 Ft",
      description: "Modern és reszponzív bemutatkozó oldal vállalkozásoknak és magánszemélyeknek.",
      icon: "🌐",
    },
    {
      id: 2,
      name: "Üzleti weboldal",
      price: "150.000 – 300.000 Ft",
      description: "Komplex üzleti weboldalak teljes körű funkcionalitással és SEO optimalizálással.",
      icon: "💼",
    },
    {
      id: 3,
      name: "Landing page",
      price: "60.000 – 120.000 Ft",
      description: "Konverziós célú egyoldalas landing page marketingkampányokhoz.",
      icon: "🎯",
    },
    {
      id: 4,
      name: "Egyedi webes rendszer",
      price: "300.000 Ft-tól",
      description: "Testreszabott webes alkalmazások és rendszerek üzleti folyamatok digitalizálására.",
      icon: "⚙️",
    },
    {
      id: 5,
      name: "Admin felület",
      price: "70.000 Ft-tól",
      description: "Könnyen kezelhető admin felület tartalomkezeléshez és adatbázis-menedzsmenthez.",
      icon: "🔧",
    },
    {
      id: 6,
      name: "Időpont- vagy foglalási rendszer",
      price: "200.000 Ft-tól",
      description: "Automatizált időpontfoglaló és foglalási rendszer szolgáltatásokhoz.",
      icon: "📅",
    },
    {
      id: 7,
      name: "AI-alapú megoldások",
      price: "300.000 Ft-tól",
      description: "Mesterséges intelligencia alapú megoldások chatbotok, automatizáció és elemzések.",
      icon: "🤖",
    },
    {
      id: 8,
      name: "Karbantartás",
      price: "15.000 – 40.000 Ft / hó",
      description: "Folyamatos karbantartás, frissítések és technikai támogatás weboldalakhoz.",
      icon: "🔄",
    },
    {
      id: 9,
      name: "Telefonos alkalmazás",
      price: "30.000 Ft-tól + áruház díjak",
      description: "Mobil alkalmazások iOS és Android platformokra.",
      icon: "📱",
    },
  ];

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
    left: `calc(15% + ${position.x}px)`,
    top: `calc(8% + ${position.y}px)`,
    width: "850px",
    height: "580px",
  };

  return (
    <>
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: zIndex + 1 }}
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl rounded-2xl p-4 md:p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/20 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div className="text-3xl md:text-5xl">{selectedService.icon}</div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">{selectedService.name}</h3>
            <div className="text-base md:text-lg font-medium text-blue-600 mb-3 md:mb-4">{selectedService.price}</div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{selectedService.description}</p>
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
        data-testid="services-window"
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
          {/* Window header */}
          <div className={`window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 flex items-center justify-between ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                data-testid="close-services-window"
              />
              <button
                onClick={onMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
              />
              <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-xs md:text-sm font-semibold text-gray-700">Árak, és infók</h2>
            </div>
            <div className="w-16"></div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">questgearhub.com</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                Modern, üzletileg hatékony és ügyfélközpontú digitális megoldásokat készítünk.
                Válassza ki az alábbi szolgáltatásaink közül, hogy többet megtudjon az árakról és részletekről.
              </p>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3 md:gap-4`}>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group p-3 md:p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 text-left"
                  data-testid={`service-item-${service.id}`}
                >
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2">{service.icon}</div>
                  <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-1 group-hover:text-blue-600 line-clamp-2">
                    {service.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1">{service.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesWindow;