import React, { useState } from "react";

export interface SavedLayout {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  rows: number;
  cols: number;
  anchor: string;
  orientation: string;
  grid: any[];
}

interface Props {
  isOpen: boolean;
  layouts: SavedLayout[];
  currentGrid: any[];
  currentRows: number;
  currentCols: number;
  currentAnchor: string;
  currentOrientation: string;
  onClose: () => void;
  onSave: (name: string) => void;
  onLoad: (layout: SavedLayout) => void;
  onDelete: (id: string) => void;
  onOverwrite: (id: string) => void;
}

export default function LayoutsModal({
  isOpen,
  layouts,
  currentGrid,
  onClose,
  onSave,
  onLoad,
  onDelete,
  onOverwrite,
}: Props) {
  const [name, setName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setConfirmDeleteId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("no-NO", { year: "numeric", month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
  };

  const playersInCurrentGrid = currentGrid.filter(p => p !== null).length;

  const sorted = [...layouts].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">Layouts</h3>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Save new */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Save current grid</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Layout name (e.g. Mythic Nerub-ar)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="flex-1 p-2 bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="bg-green-700 hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-500 px-4 py-2 text-sm font-semibold transition-colors text-white"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {playersInCurrentGrid} players in grid
            </p>
          </div>

          {/* List */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Saved layouts {layouts.length > 0 && <span className="text-slate-500 font-normal">({layouts.length})</span>}
            </label>
            {sorted.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No saved layouts yet.</p>
            ) : (
              <div className="space-y-2">
                {sorted.map(layout => {
                  const players = layout.grid.filter((p: any) => p !== null).length;
                  const isConfirming = confirmDeleteId === layout.id;
                  return (
                    <div key={layout.id} className="bg-slate-950 border border-slate-700 p-3 hover:border-slate-600 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-slate-200 font-semibold truncate">{layout.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {layout.rows} × {layout.cols} · {players} players · {formatDate(layout.updatedAt)}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {isConfirming ? (
                            <>
                              <button
                                onClick={() => { onDelete(layout.id); setConfirmDeleteId(null); }}
                                className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs font-semibold transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => onLoad(layout)}
                                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 text-xs font-semibold transition-colors"
                              >
                                Load
                              </button>
                              <button
                                onClick={() => onOverwrite(layout.id)}
                                title="Overwrite with current grid"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 text-xs transition-colors border border-slate-700"
                              >
                                Overwrite
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(layout.id)}
                                title="Delete layout"
                                className="bg-slate-800 hover:bg-red-900/50 text-red-400 px-2 py-1 text-xs transition-colors border border-slate-700"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2 font-semibold transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
        
      </div>
    </div>
  );
}
