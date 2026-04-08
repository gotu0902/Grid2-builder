import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "alert" | "confirm";
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Modal({ isOpen, title, message, type, onClose, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700  shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* whitespace-pre-wrap gjør at \n i teksten faktisk blir linjeskift */}
          <p className="text-slate-300 whitespace-pre-wrap">{message}</p>
        </div>

        {/* Footer / Buttons */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
          {type === "confirm" ? (
            <>
              <button 
                onClick={onClose}
                className="px-4 py-2  font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2  font-semibold transition-colors shadow-lg shadow-red-900/20"
              >
                Ye fuck it
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2  font-semibold transition-colors shadow-lg shadow-blue-900/20"
            >
              OK
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}