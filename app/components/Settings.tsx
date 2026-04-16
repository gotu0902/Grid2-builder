import React from "react";
import { euRealms } from "./Icons";

export default function Settings({
  rows, setRows, cols, setCols,
  anchor, setAnchor,
  orientation, setOrientation,
  myRealm, setMyRealm,
  handleResetGrid, handleExport,
  handleAutoSort, handleOpenSortSettings,
  handleOpenImport, handleOpenLayouts,
}: any) {
  return (
    <div className="bg-slate-900 p-6 border border-slate-800 w-full max-w-4xl flex flex-col gap-6">
      
      {/* Øverste rad: Innstillinger */}
      <div className="flex flex-wrap gap-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Rows</label>
          <input type="number" min="1" max="10" value={rows} onChange={e => setRows(Number(e.target.value))} className="bg-slate-950 border border-slate-700 p-2 w-20 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Columns</label>
          <input type="number" min="1" max="10" value={cols} onChange={e => setCols(Number(e.target.value))} className="bg-slate-950 border border-slate-700 p-2 w-20 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
           <label className="block text-sm text-slate-400 mb-2">Anchor point</label>
           <div className="flex gap-2">
              <button onClick={() => setAnchor("TOPLEFT")} className={`px-4 py-2 border border-black transition-colors ${anchor === "TOPLEFT" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"}`}>Top-Left</button>
              <button onClick={() => setAnchor("TOPRIGHT")} className={`px-4 py-2 border border-black transition-colors ${anchor === "TOPRIGHT" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"}`}>Top-Right</button>
           </div>
        </div>
        <div>
           <label className="block text-sm text-slate-400 mb-2">Growth direction</label>
           <div className="flex gap-2">
              <button onClick={() => setOrientation("HORIZONTAL")} className={`px-4 py-2 border border-black transition-colors ${orientation === "HORIZONTAL" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"}`}>Horizontal</button>
              <button onClick={() => setOrientation("VERTICAL")} className={`px-4 py-2 border border-black transition-colors ${orientation === "VERTICAL" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"}`}>Vertical</button>
           </div>
        </div>

        {/* MY REALM DROPDOWN */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">My Realm (Hide in export)</label>
          <div className="relative w-48">
            <select 
              value={myRealm} 
              onChange={(e) => setMyRealm(e.target.value)} 
              className="w-full appearance-none p-2 pr-8 cursor-pointer bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {euRealms.map(realm => (
                <option key={realm} value={realm}>{realm}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      {/* Midtre rad: Auto-sort + Layouts */}
      <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-start gap-4 items-center">
        <div className="flex items-stretch">
          <button
            onClick={handleAutoSort}
            title="Auto-fill grid with everyone in roster: Tanks -> Melee -> Ranged -> Healers"
            className="bg-slate-950 hover:bg-purple-900/40 text-purple-400 px-6 py-2 font-semibold border border-black transition-colors cursor-pointer"
          >
            Auto-sort to Grid
          </button>
          <button
            onClick={handleOpenSortSettings}
            title="Configure sort order and class priority"
            className="bg-slate-950 hover:bg-purple-900/40 text-purple-400 px-3 py-2 font-semibold border border-black border-l-0 transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>

        <button
          onClick={handleOpenLayouts}
          title="Save or load a grid layout"
          className="bg-slate-950 hover:bg-amber-900/40 text-amber-400 px-6 py-2 font-semibold border border-black transition-colors cursor-pointer"
        >
          Layouts
        </button>
      </div>

      {/* Nederste rad: Import/Export/Clear */}
      <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-start gap-4">
        <button onClick={handleResetGrid} className="bg-slate-950 hover:bg-red-900/40 text-red-800 px-6 py-2 font-semibold border border-black transition-colors cursor-pointer">
          Clear Grid
        </button>
        <button onClick={handleOpenImport} className="bg-slate-950 hover:bg-green-900/40 text-green-500 px-6 py-2 font-semibold border border-black transition-colors cursor-pointer">
          Import Grid
        </button>
        <button onClick={handleExport} className="bg-slate-950 hover:bg-blue-900/40 text-blue-500 px-8 py-2 font-semibold border border-black transition-colors shadow-lg shadow-blue-900/20 cursor-pointer">
          Export Grid2 names
        </button>
      </div>

    </div>
  );
}
