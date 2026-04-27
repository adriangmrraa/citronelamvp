"use client";

import React, { useState } from "react";

// TODO: En el futuro esto dependerá del nombre de usuario en la DB al loguearse
const mockUser = {
  firstName: "Santiago",
};

const locations = [
  "Ciudad de Córdoba, Córdoba",
  "Palermo, BA",
  "Rosario, Santa FE",
];

export function EventsHeader({ searchTerm, onSearchChange }: { searchTerm: string, onSearchChange: (val: string) => void }) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="flex justify-between items-center w-full relative z-50 h-[56px]">
      {!isSearchActive ? (
        <>
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl tracking-wide"
              style={{ fontFamily: "var(--font-avigea)" }}
            >
              <span className="text-[#a3e635]">Hola,</span> <span className="text-white">{mockUser.firstName}</span>
            </h1>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-zinc-400 group hover:text-white transition-colors focus:outline-none"
              >
                <span className="text-sm font-medium tracking-wide">
                  {selectedLocation}
                </span>
                <span
                  className={`material-symbols-outlined text-sm transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                        selectedLocation === loc
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsSearchActive(true)}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.1)] hover:bg-zinc-800 transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </>
      ) : (
        <div className="flex gap-3 items-center w-full animate-in fade-in duration-300">
          <div className="flex-1 relative group w-full">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-primary transition-colors">
               <span className="material-symbols-outlined">search</span>
             </div>
             <input 
               autoFocus
               type="text" 
               value={searchTerm}
               onChange={(e) => onSearchChange(e.target.value)}
               placeholder="Buscá eventos en tu zona" 
               className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#a3e635] focus:bg-zinc-800 transition-all shadow-inner"
             />
          </div>
          <button 
            onClick={() => {
              setIsSearchActive(false);
              onSearchChange("");
            }}
            className="w-12 h-12 flex-shrink-0 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
      )}
    </header>
  );
}
