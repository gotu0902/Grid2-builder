import React, { useState } from "react";
import { classColors } from "./Icons";

export type SortCategory = "TANK" | "DPS" | "HEALER";

export interface SortConfig {
  order: SortCategory[];
  classPriority: string[]; // class names in preferred order
  onlyGroupDpsClasses: boolean;
}

export const DEFAULT_SORT_CONFIG: SortConfig = {
  order: ["TANK", "DPS", "HEALER"],
  classPriority: Object.keys(classColors),
  onlyGroupDpsClasses: true,
};

const CATEGORY_LABEL: Record<SortCategory, string> = {
  TANK: "Tanks",
  DPS: "DPS",
  HEALER: "Healers",
};

interface Props {
  isOpen: boolean;
  config: SortConfig;
  onClose: () => void;
  onSave: (config: SortConfig) => void;
  onApply: (config: SortConfig) => void;
}

export default function SortSettingsModal({ isOpen, config, onClose, onSave, onApply }: Props) {
  const [local, setLocal] = useState<SortConfig>(config);
  const [dragItem, setDragItem] = useState<{ list: "order" | "class"; index: number } | null>(null);

  // Synker state når modal åpnes med ny config
  React.useEffect(() => {
    if (isOpen) setLocal(config);
  }, [isOpen, config]);

  if (!isOpen) return null;

  const moveItem = <T,>(arr: T[], from: number, to: number): T[] => {
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const handleDragStart = (list: "order" | "class", index: number) => {
    setDragItem({ list, index });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (list: "order" | "class", targetIndex: number) => {
    if (!dragItem || dragItem.list !== list) return;
    if (list === "order") {
      setLocal(prev => ({ ...prev, order: moveItem(prev.order, dragItem.index, targetIndex) }));
    } else {
      setLocal(prev => ({ ...prev, classPriority: moveItem(prev.classPriority, dragItem.index, targetIndex) }));
    }
    setDragItem(null);
  };

  const resetToDefault = () => setLocal(DEFAULT_SORT_CONFIG);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-200">Sort Settings</h3>
          <button onClick={resetToDefault} className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Reset to default</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Role order */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Role order</label>
            <p className="text-xs text-slate-500 mb-3">Drag to reorder. Groups will be placed in the grid in this order.</p>
            <div className="space-y-1">
              {local.order.map((cat, i) => (
                <div
                  key={cat}
                  draggable
                  onDragStart={() => handleDragStart("order", i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("order", i)}
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-700 cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors"
                >
                  <span className="text-slate-600 font-mono text-sm">{i + 1}.</span>
                  <span className="text-slate-500">⋮⋮</span>
                  <span className="text-slate-200 font-medium">{CATEGORY_LABEL[cat]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Only group DPS toggle */}
          <div className="bg-slate-950 border border-slate-700 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={local.onlyGroupDpsClasses}
                onChange={(e) => setLocal(prev => ({ ...prev, onlyGroupDpsClasses: e.target.checked }))}
                className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200">Only apply class priority to DPS</div>
                <div className="text-xs text-slate-500 mt-1">
                  When on, healer/tank classes ignore the priority list and stay in their role group.
                  E.g. 2x healer Shamans stay with the healers even if Shaman is prioritized in the DPS list.
                </div>
              </div>
            </label>
          </div>

          {/* Class priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Class priority (within each role group)</label>
            <p className="text-xs text-slate-500 mb-3">Drag to reorder. Same class + same role are always grouped together.</p>
            <div className="grid grid-cols-2 gap-1">
              {local.classPriority.map((cls, i) => (
                <div
                  key={cls}
                  draggable
                  onDragStart={() => handleDragStart("class", i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("class", i)}
                  className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-700 cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors"
                >
                  <span className="text-slate-600 font-mono text-xs w-5 text-right">{i + 1}</span>
                  <span className="text-slate-500 text-xs">⋮⋮</span>
                  <span className={`${classColors[cls]} font-medium text-sm`}>{cls}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(local)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 font-semibold transition-colors border border-slate-600"
          >
            Save
          </button>
          <button 
            onClick={() => onApply(local)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 font-semibold transition-colors shadow-lg shadow-blue-900/20"
          >
            Save &amp; Apply
          </button>
        </div>
        
      </div>
    </div>
  );
}
