import React, { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";

const FinderWindow = ({ onClose, onMinimize, onFocus, isMinimized, zIndex }) => {
  const [activePage, setActivePage] = useState("overview");
  const { position, elementRef, handleMouseDown, isDragging } = useDraggable();

  if (isMinimized) return null;

  return (
    <div
      ref={elementRef}
      className="absolute animate-slide-up"
      style={{
        zIndex,
        left: `calc(10% + ${position.x}px)`,
        top: `calc(8% + ${position.y}px)`,
        width: "950px",
        height: "650px",
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onClick={onFocus}
      onMouseDown={handleMouseDown}
      data-testid="finder-window"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 h-full flex flex-col">
        {/* Window header */}
        <div className="window-header bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
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
            <h2 className="text-sm font-semibold text-gray-700">Információ - questgearhub.com</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-52px)]">
          {/* Sidebar */}
          <div className="w-56 bg-gray-50/80 border-r border-gray-200 p-4 flex flex-col">
            <div className="text-sm font-semibold text-gray-600 mb-4">Információ</div>
            
            <div className="space-y-1 flex-1">
              <button
                onClick={() => setActivePage("overview")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                  activePage === "overview" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>Áttekintés</span>
              </button>
              
              <button
                onClick={() => setActivePage("services")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                  activePage === "services" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>Mit csinálok</span>
              </button>
              
              <button
                onClick={() => setActivePage("tech")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                  activePage === "tech" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>Technológiák</span>
              </button>
              
              <button
                onClick={() => setActivePage("workflow")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                  activePage === "workflow" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>Munkafolyamat</span>
              </button>
              
              <button
                onClick={() => setActivePage("contact")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                  activePage === "contact" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>Kapcsolat</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
              Ez egy <strong>információs ablak</strong>. A lenti Dock ikonoknál találod a funkciókat, projekteket és a kapcsolatfelvételt.
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white/50">
            {/* Overview Page */}
            {activePage === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Weboldal készítés & egyedi webes rendszerek
                  </h2>
                  <p className="text-gray-600">
                    Letisztult design, stabil működés, átlátható admin felületek – úgy, hogy hosszú távon is kényelmesen használható legyen.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Profi megjelenés</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Gyors betöltés</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Mobilbarát</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">Bővíthető</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Profil</h3>
                    <p className="text-sm text-gray-600">
                      Olyan weboldalakat és rendszereket építek, amik nem csak "szépek", hanem tényleg működnek:
                      átgondolt felépítés, tiszta kód, és olyan megoldások, amik később is könnyen fejleszthetők.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Mire számíthatsz</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gyors, modern, reszponzív felület</li>
                      <li>• Átlátható felépítés és logika</li>
                      <li>• Igény szerint admin / kezelő felület</li>
                      <li>• Stabil működés és későbbi bővíthetőség</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Fontos információ</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Ez az ablak kizárólag <strong>tájékoztató jellegű</strong>.
                        Nyugodtan bezárhatod, miután mindent átnéztél.
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        A részletes tartalmakat és funkciókat a Dock alján található ikonokon éred el:
                        <strong> Kapcsolat</strong>, <strong>Projektek</strong>, <strong>Szolgáltatások</strong>.
                      </p>
                      <p className="text-xs text-gray-500 mt-2 italic">
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mit csinálok</h2>
                  <p className="text-gray-600">
                    Tipikus feladatok, amiket gyakran kérnek – és amiket gyorsan, szépen, stabilan meg lehet csinálni.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Bemutatkozó weboldal</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Főoldal / szolgáltatások / referencia / kapcsolat</li>
                      <li>• Mobilbarát, gyors betöltés</li>
                      <li>• Modern, prémium megjelenés</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Egyedi admin felület</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Tartalomkezelés (szöveg, képek, galéria)</li>
                      <li>• Státuszok, jogosultságok</li>
                      <li>• Átlátható, "kézre álló" kezelés</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Foglalás / űrlap / ajánlatkérés</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Kapcsolati űrlap (email értesítés)</li>
                      <li>• Időpontfoglalás / egyszerű workflow</li>
                      <li>• Visszajelzés (sikeres küldés popup)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Tipp</h3>
                    <p className="text-sm text-gray-600">
                      A részleteket és példákat a Dock ikonoknál lévő ablakokban találod.
                      A <strong>Kapcsolat</strong> ikon megnyitja az ajánlatkérő űrlapot.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Page */}
            {activePage === "tech" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Technológiák</h2>
                  <p className="text-gray-600">
                    A cél: egyszerű, stabil, jól karbantartható megoldások – felesleges túlbonyolítás nélkül.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Stack</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded">HTML</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">CSS</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded">JavaScript</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded">React</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded">Python</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">FastAPI</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded">MongoDB</span>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Reszponzív, modern UI</li>
                    <li>• Biztonságos űrlapkezelés / validálás</li>
                    <li>• Skálázható felépítés, későbbi bővítéshez</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Workflow Page */}
            {activePage === "workflow" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Munkafolyamat</h2>
                  <p className="text-gray-600">
                    Röviden így épül fel egy projekt – hogy tiszta legyen a menet és ne csússzon szét semmi.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <ol className="space-y-4">
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
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Megjegyzés</h3>
                  <p className="text-sm text-gray-600">
                    Ha valamihez csak "egy egyszerű megoldás" kell, azt is lehet jól megcsinálni:
                    gyorsan, szépen, és később is bővíthetően.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Page */}
            {activePage === "contact" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Kapcsolat</h2>
                  <p className="text-gray-600">
                    Ajánlatkéréshez és üzenetküldéshez használd a Dock alján a <strong>Kapcsolat</strong> ikont.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Hogyan tovább?</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Nyisd meg a Dockon a <strong>Kapcsolat</strong> ikont</li>
                    <li>• Írd le röviden, mire van szükséged</li>
                    <li>• Válaszolok e-mailben a részletekkel</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-xl">ℹ️</span>
                    <div>
                      <p className="text-sm text-gray-600">
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
