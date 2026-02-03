import React, { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const FinderWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex, isMobile }) => {
  const [activePage, setActivePage] = useState("overview");
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
    left: `calc(10% + ${position.x}px)`,
    top: `calc(8% + ${position.y}px)`,
    width: "950px",
    height: "650px",
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
      data-testid="finder-window"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
        {/* Window header */}
        <div className={`window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 flex items-center justify-between ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              data-testid="close-finder-button"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xs md:text-sm font-semibold text-gray-700 truncate">Információ</h2>
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
          {/* Sidebar - desktop or mobile overlay */}
          <div className={`${isMobile 
            ? `absolute inset-0 z-10 ${showMobileSidebar ? 'block' : 'hidden'}` 
            : 'w-56'} bg-gray-50/80 ${!isMobile && 'border-r border-gray-200'} flex flex-col`}
          >
            {isMobile && showMobileSidebar && (
              <div className="absolute inset-0 bg-gray-50" onClick={() => setShowMobileSidebar(false)} />
            )}
            <div className={`relative z-10 bg-gray-50 h-full ${isMobile ? 'w-64 shadow-xl' : ''} p-4 flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-600">Információ</span>
                {isMobile && (
                  <button onClick={() => setShowMobileSidebar(false)} className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            
              <div className="space-y-1 flex-1">
                {[
                  { id: "overview", label: "Áttekintés" },
                  { id: "services", label: "Mit csinálok" },
                  { id: "tech", label: "Technológiák" },
                  { id: "workflow", label: "Munkafolyamat" },
                  { id: "contact", label: "Kapcsolat" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      if (isMobile) setShowMobileSidebar(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                      activePage === item.id 
                        ? "bg-blue-500 text-white" 
                        : "text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
                Ez egy <strong>információs ablak</strong>. A lenti Dock ikonoknál találod a funkciókat, projekteket és a kapcsolatfelvételt.
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white/50">
            {/* Overview Page */}
            {activePage === "overview" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
                    Weboldal készítés & egyedi webes rendszerek
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Letisztult design, stabil működés, átlátható admin felületek – úgy, hogy hosszú távon is kényelmesen használható legyen.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs md:text-sm rounded-full">Profi megjelenés</span>
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm rounded-full">Gyors betöltés</span>
                  <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm rounded-full">Mobilbarát</span>
                  <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 text-xs md:text-sm rounded-full">Bővíthető</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Profil</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      Olyan weboldalakat és rendszereket építek, amik nem csak "szépek", hanem tényleg működnek:
                      átgondolt felépítés, tiszta kód, és olyan megoldások, amik később is könnyen fejleszthetők.
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Mire számíthatsz</h3>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• Gyors, modern, reszponzív felület</li>
                      <li>• Átlátható felépítés és logika</li>
                      <li>• Igény szerint admin / kezelő felület</li>
                      <li>• Stabil működés és későbbi bővíthetőség</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl md:text-2xl">ℹ️</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Fontos információ</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        Ez az ablak kizárólag <strong>tájékoztató jellegű</strong>.
                        Nyugodtan bezárhatod, miután mindent átnéztél.
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        A részletes tartalmakat és funkciókat a Dock alján található ikonokon éred el:
                        <strong> Kapcsolat</strong>, <strong>Projektek</strong>, <strong>Szolgáltatások</strong>.
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-2 italic">
                        Ez <strong>nem</strong> egy valódi macOS rendszer. Egy egyedi design-koncepció, amely bemutatja,
                        milyen szemlélettel és minőségben dolgozom.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Page */}
            {activePage === "services" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">Mit csinálok</h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Tipikus feladatok, amiket gyakran kérnek – és amiket gyorsan, szépen, stabilan meg lehet csinálni.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Bemutatkozó weboldal</h3>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• Főoldal / szolgáltatások / referencia / kapcsolat</li>
                      <li>• Mobilbarát, gyors betöltés</li>
                      <li>• Modern, prémium megjelenés</li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Egyedi admin felület</h3>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• Tartalomkezelés (szöveg, képek, galéria)</li>
                      <li>• Státuszok, jogosultságok</li>
                      <li>• Átlátható, "kézre álló" kezelés</li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Foglalás / űrlap / ajánlatkérés</h3>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• Kapcsolati űrlap (email értesítés)</li>
                      <li>• Időpontfoglalás / egyszerű workflow</li>
                      <li>• Visszajelzés (sikeres küldés popup)</li>
                    </ul>
                  </div>

                  <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Tipp</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      A részleteket és példákat a Dock ikonoknál lévő ablakokban találod.
                      A <strong>Kapcsolat</strong> ikon megnyitja az ajánlatkérő űrlapot.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Page */}
            {activePage === "tech" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">Technológiák</h2>
                  <p className="text-sm md:text-base text-gray-600">
                    A cél: egyszerű, stabil, jól karbantartható megoldások – felesleges túlbonyolítás nélkül.
                  </p>
                </div>

                <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Stack</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 text-xs md:text-sm font-medium rounded">HTML</span>
                    <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs md:text-sm font-medium rounded">CSS</span>
                    <span className="px-2 md:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs md:text-sm font-medium rounded">JavaScript</span>
                    <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm font-medium rounded">React</span>
                    <span className="px-2 md:px-3 py-1 bg-indigo-100 text-indigo-700 text-xs md:text-sm font-medium rounded">Python</span>
                    <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded">FastAPI</span>
                    <span className="px-2 md:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs md:text-sm font-medium rounded">MongoDB</span>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <ul className="text-xs md:text-sm text-gray-600 space-y-2">
                    <li>• Reszponzív, modern UI</li>
                    <li>• Biztonságos űrlapkezelés / validálás</li>
                    <li>• Skálázható felépítés, későbbi bővítéshez</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Workflow Page */}
            {activePage === "workflow" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">Munkafolyamat</h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Röviden így épül fel egy projekt – hogy tiszta legyen a menet és ne csússzon szét semmi.
                  </p>
                </div>

                <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <ol className="space-y-3 md:space-y-4">
                    {[
                      {
                        title: "Igények felmérése",
                        desc: "Cél, funkciók, stílus, tartalom"
                      },
                      {
                        title: "Tervezés (UI / UX)",
                        desc: "Vázlat, elrendezés, felhasználói út"
                      },
                      {
                        title: "Fejlesztés",
                        desc: "Megvalósítás, admin/logika, integrációk"
                      },
                      {
                        title: "Tesztelés",
                        desc: "Mobil, sebesség, hibák, űrlapok"
                      },
                      {
                        title: "Élesítés",
                        desc: "Publikálás + finomhangolás igény szerint"
                      }
                    ].map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-xs md:text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base">{step.title}</h4>
                          <p className="text-xs md:text-sm text-gray-600">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Megjegyzés</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Ha valamihez csak "egy egyszerű megoldás" kell, azt is lehet jól megcsinálni:
                    gyorsan, szépen, és később is bővíthetően.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Page */}
            {activePage === "contact" && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">Kapcsolat</h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Ajánlatkéréshez és üzenetküldéshez használd a Dock alján a <strong>Kapcsolat</strong> ikont.
                  </p>
                </div>

                <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Hogyan tovább?</h3>
                  <ul className="text-xs md:text-sm text-gray-600 space-y-2">
                    <li>• Nyisd meg a Dockon a <strong>Kapcsolat</strong> ikont</li>
                    <li>• Írd le röviden, mire van szükséged</li>
                    <li>• Válaszolok e-mailben a részletekkel</li>
                  </ul>
                </div>

                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg md:text-xl">ℹ️</span>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">
                        Ez az ablak nem küld üzenetet – csak információs rész.
                        A tényleges üzenetküldés a Kapcsolat ablakban történik.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinderWindow;
