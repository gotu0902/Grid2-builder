import React from "react";
import { euRealms } from "./Icons";

export default function Settings({ rows, setRows, cols, setCols, anchor, setAnchor, orientation, setOrientation, myRealm, setMyRealm, handleResetGrid, handleExport }: any) {
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

        {/* NY DROPDOWN FOR MY REALM */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">My Realm (Hide in export)</label>
          <div className="relative w-48">
            <select 
              value={myRealm} 
              onChange={(e) => setMyRealm(e.target.value)} 
              className="w-full appearance-none p-2 pr-8 cursor-pointer bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {/* "None" er fjernet herfra */}
              {euRealms.map(realm => (
                <option key={realm} value={realm}>{realm}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      {/* Nederste rad: Handlinger */}
      <div className="pt-6 border-t border-slate-800 flex justify-start gap-4">
        <button onClick={handleResetGrid} className="bg-slate-950 hover:bg-red-900/40 text-red-800 px-6 py-2 font-semibold border border-black transition-colors cursor-pointer">
          Clear Grid
        </button>
        <button onClick={handleExport} className="bg-slate-950 hover:bg-blue-900/40 text-blue-500 px-8 py-2 font-semibold border border-black transition-colors shadow-lg shadow-blue-900/20 cursor-pointer">
          Export Grid2 names
        </button>
      </div>

    </div>
  );
}