import React, { useState } from "react";
import { getRoleIcon, classColors } from "./Icons";

export default function Sidebar({
  roster, wclCode, setWclCode, isFetching, fetchFromWCL, searchQuery, setSearchQuery, sortBy, setSortBy, displayedRoster, handleDragStart, handleToggleRole, handleEmptyRoster, handleTestMode, handleAddManualPlayer
}: any) {
  
  // State for å legge til manuell spiller
  const [manualName, setManualName] = useState("");
  const [manualClass, setManualClass] = useState("Warrior");
  const [manualRole, setManualRole] = useState("DPS");

  const onAddManual = () => {
    handleAddManualPlayer(manualName, manualClass, manualRole);
    setManualName(""); // Tømmer navnefeltet etterpå
  };

  return (
    <div className="w-100 bg-slate-900 p-5 border-l border-slate-800 h-[calc(100vh-4rem)] shadow-2xl flex flex-col sticky top-8">
      
      {/* HEADER MED TEST/CLEAR KNAPPER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-200">Roster ({roster.length})</h2>
        <div className="flex gap-2">
          <button onClick={handleTestMode} className="p-1.5 bg-slate-800 hover:bg-blue-900 cursor-pointer text-slate-300 hover:text-blue-300 transition-colors" title="Test Mode (Svenske vennar)">🧪</button>
          <button onClick={handleEmptyRoster} className="p-1.5 bg-slate-800 hover:bg-red-900/50 cursor-pointer text-red-400 hover:text-red-300 transition-colors" title="Empty Entire Roster">🗑️</button>
        </div>
      </div>
      
      {/* MANUELL INNMATING */}
      <div className="bg-slate-950 p-3 border border-slate-700 mb-4">
        <label className="text-xs text-slate-400 mb-2 block">Add Manual Player</label>
        <div className="flex flex-col gap-2">
          <input type="text" placeholder="Name..." value={manualName} onChange={(e) => setManualName(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700  text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2">
            <div className="relative flex-1">
            <select value={manualClass} onChange={(e) => setManualClass(e.target.value)} className="w-full appearance-none p-2 pr-8 cursor-pointer bg-slate-900 border border-slate-700  text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              {Object.keys(classColors).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        <div className="relative w-20">
            <select value={manualRole} onChange={(e) => setManualRole(e.target.value)} className="w-full appearance-none p-2 pr-8 cursor-pointer bg-slate-900 border border-slate-700  text-sm text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="TANK">Tank</option>
              <option value="HEALER">Heal</option>
              <option value="DPS">DPS</option>
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
            <button onClick={onAddManual} className="bg-green-700 hover:bg-green-600 px-3 py-1 cursor-pointer text-sm font-semibold transition-colors text-white">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* WCL Input */}
      <div className="bg-slate-950 p-3 border border-slate-700 mb-4">
        <label className="text-xs text-slate-400 mb-2 block">Get roster from WCL</label>
        <div className="flex gap-2">
          <input type="text" placeholder="WCL Log ID" value={wclCode} onChange={(e) => setWclCode(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700  text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
          <button onClick={fetchFromWCL} disabled={isFetching} className="bg-blue-700 hover:bg-blue-600 cursor-pointer disabled:bg-slate-800 px-3 py-2  text-sm font-semibold transition-colors text-white">
            {isFetching ? "..." : "Get"}
          </button>
        </div>
      </div>

      {/* Sortering & Filtrering */}
      <div className="flex flex-col gap-2 mb-4">
        <input type="text" placeholder="Find a bro..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 bg-slate-950 border border-slate-700  text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
        <div className="flex items-center gap-2">
<div className="relative w-full">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none p-2 pr-8 cursor-pointer bg-slate-950 border border-slate-700  text-sm focus:outline-none focus:border-blue-500 text-slate-300">
            <option value="ALPHABETICAL">Alphabetical</option>
            <option value="ROLE">Role (Tank, Healer, DPS)</option>
            <option value="CLASS">Class</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        </div>
      </div>

      {/* Roster List */}
      <div className="flex-1 overflow-y-auto space-y-2">
         {displayedRoster.map((player: any, index: number) => (
           <div key={player.id} draggable onDragStart={(e) => handleDragStart(e, player, index, "roster")} className={`p-3 bg-slate-800 -md border border-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-700 transition-colors ${player.color} font-medium flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <button onClick={(e) => handleToggleRole(e, player.id, "roster")} className="p-1 hover:bg-slate-600  bg-slate-900 border border-slate-700" title="Klikk for å bytte rolle">
                  {getRoleIcon(player.role || "DPS")}
                </button>
                <span>{player.name}</span>
              </div>
              {player.server && <span className="text-slate-400 text-[11px] font-semibold text-right">{player.server}</span>}
           </div>
         ))}
      </div>
    </div>
  );
}