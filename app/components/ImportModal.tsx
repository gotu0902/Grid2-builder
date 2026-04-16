import React, { useState } from "react";
import { classColors } from "./Icons";

export interface ParsedEntry {
  name: string;
  server?: string;
}

export interface ResolvedPlayer {
  id: string;
  name: string;
  server?: string;
  class: string;
  color: string;
  role: string;
}

interface Props {
  isOpen: boolean;
  myRealm: string;
  onClose: () => void;
  // Called with the final list of placed players (in the original order)
  onImport: (placements: (ResolvedPlayer | null)[]) => void;
  // Called to try resolving names via WCL. Returns players found in the log.
  fetchFromWCLById: (id: string) => Promise<any[]>;
}

type Step = "paste" | "resolve-choice" | "wcl-lookup" | "manual-fill";

export default function ImportModal({ isOpen, myRealm, onClose, onImport, fetchFromWCLById }: Props) {
  const [step, setStep] = useState<Step>("paste");
  const [pasteText, setPasteText] = useState("");
  const [parsed, setParsed] = useState<ParsedEntry[]>([]);
  const [resolved, setResolved] = useState<Record<number, ResolvedPlayer | null>>({});
  const [wclId, setWclId] = useState("");
  const [wclLoading, setWclLoading] = useState(false);
  const [wclError, setWclError] = useState("");

  // Per-row manual fill state (keyed by parsed index)
  const [manualClass, setManualClass] = useState<Record<number, string>>({});
  const [manualRole, setManualRole] = useState<Record<number, string>>({});

  React.useEffect(() => {
    if (isOpen) {
      setStep("paste");
      setPasteText("");
      setParsed([]);
      setResolved({});
      setWclId("");
      setWclError("");
      setManualClass({});
      setManualRole({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const parsePaste = (): ParsedEntry[] => {
    // Export format: "Name, Name-Server, Name, ..."
    return pasteText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(entry => {
        const dashIdx = entry.indexOf("-");
        if (dashIdx === -1) return { name: entry };
        return {
          name: entry.substring(0, dashIdx).trim(),
          server: entry.substring(dashIdx + 1).trim(),
        };
      });
  };

  const handleProceed = () => {
    const p = parsePaste();
    if (p.length === 0) return;
    setParsed(p);
    // Default server is myRealm if not specified
    setStep("resolve-choice");
  };

  const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();

  const matchPlayerInList = (entry: ParsedEntry, players: any[]): any | null => {
    const targetName = normalize(entry.name);
    const targetServer = entry.server ? normalize(entry.server) : normalize(myRealm);
    // Prefer name + server match
    const exact = players.find(p =>
      normalize(p.name) === targetName &&
      normalize(p.server || myRealm) === targetServer
    );
    if (exact) return exact;
    // Fall back to just name match
    return players.find(p => normalize(p.name) === targetName) || null;
  };

  const handleWclLookup = async () => {
    if (!wclId.trim()) return;
    setWclLoading(true);
    setWclError("");
    try {
      const players = await fetchFromWCLById(wclId.trim());
      // Match each parsed entry against WCL players
      const newResolved: Record<number, ResolvedPlayer | null> = {};
      parsed.forEach((entry, i) => {
        const match = matchPlayerInList(entry, players);
        if (match) {
          newResolved[i] = {
            id: "imported_" + Date.now() + "_" + i,
            name: match.name,
            server: match.server,
            class: match.class,
            color: classColors[match.class] || "text-slate-300",
            role: match.role || "DPS",
          };
        } else {
          newResolved[i] = null;
        }
      });
      setResolved(newResolved);
      // If anyone unresolved → go to manual fill, else finish
      const missing = parsed.some((_, i) => !newResolved[i]);
      if (missing) {
        // Pre-fill defaults for manual
        const mClass: Record<number, string> = {};
        const mRole: Record<number, string> = {};
        parsed.forEach((_, i) => {
          if (!newResolved[i]) {
            mClass[i] = "Warrior";
            mRole[i] = "DPS";
          }
        });
        setManualClass(mClass);
        setManualRole(mRole);
        setStep("manual-fill");
      } else {
        finishImport(newResolved);
      }
    } catch (err: any) {
      setWclError(err.message || "Failed to fetch from WCL");
    } finally {
      setWclLoading(false);
    }
  };

  const handleAllManual = () => {
    const mClass: Record<number, string> = {};
    const mRole: Record<number, string> = {};
    parsed.forEach((_, i) => {
      mClass[i] = "Warrior";
      mRole[i] = "DPS";
    });
    setManualClass(mClass);
    setManualRole(mRole);
    setResolved({}); // all treated as missing
    setStep("manual-fill");
  };

  const handleManualComplete = () => {
    const final: Record<number, ResolvedPlayer | null> = { ...resolved };
    parsed.forEach((entry, i) => {
      if (!final[i]) {
        const cls = manualClass[i] || "Warrior";
        const role = manualRole[i] || "DPS";
        final[i] = {
          id: "imported_" + Date.now() + "_" + i,
          name: entry.name,
          server: entry.server,
          class: cls,
          color: classColors[cls] || "text-slate-300",
          role,
        };
      }
    });
    finishImport(final);
  };

  const finishImport = (final: Record<number, ResolvedPlayer | null>) => {
    const placements = parsed.map((_, i) => final[i] || null);
    onImport(placements);
  };

  const missingCount = parsed.filter((_, i) => !resolved[i]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">
            {step === "paste" && "Import Grid Names"}
            {step === "resolve-choice" && "How to resolve missing players?"}
            {step === "wcl-lookup" && "Fetching from WCL..."}
            {step === "manual-fill" && `Manual fill (${missingCount} missing)`}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {step === "paste" && (
            <div>
              <p className="text-sm text-slate-400 mb-3">
                Paste the exported string (comma-separated names, with <code className="text-slate-300">-Server</code> for cross-realm).
              </p>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Sven, Björn-Ragnaros, Astrid, Malin..."
                className="w-full h-40 bg-slate-950 border border-slate-700 p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
          )}

          {step === "resolve-choice" && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                Found <span className="text-slate-200 font-semibold">{parsed.length}</span> names. 
                How should we figure out their class and role?
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {parsed.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 font-mono text-xs w-6 text-right">{i + 1}.</span>
                    <span className="text-slate-200">{e.name}</span>
                    {e.server && <span className="text-slate-500 text-xs">- {e.server}</span>}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep("wcl-lookup")}
                  className="bg-blue-700 hover:bg-blue-600 text-white p-3 font-semibold transition-colors text-left"
                >
                  <div>Look up from a WCL log</div>
                  <div className="text-xs font-normal text-blue-200 opacity-80">Auto-fills class and role from a report ID</div>
                </button>
                <button
                  onClick={handleAllManual}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 font-semibold transition-colors text-left border border-slate-700"
                >
                  <div>Fill everything manually</div>
                  <div className="text-xs font-normal text-slate-400">Pick class and role for each name yourself</div>
                </button>
              </div>
            </div>
          )}

          {step === "wcl-lookup" && (
            <div>
              <label className="text-xs text-slate-400 mb-2 block">WCL Log ID</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. aBcDeFg123"
                  value={wclId}
                  onChange={(e) => setWclId(e.target.value)}
                  className="flex-1 p-2 bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleWclLookup}
                  disabled={wclLoading || !wclId.trim()}
                  className="bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 px-4 py-2 text-sm font-semibold transition-colors text-white"
                >
                  {wclLoading ? "..." : "Fetch"}
                </button>
              </div>
              {wclError && <p className="text-red-400 text-sm">{wclError}</p>}
              <p className="text-xs text-slate-500 mt-2">
                Anyone missing from the log will go to a manual-fill step next.
              </p>
            </div>
          )}

          {step === "manual-fill" && (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                Pick class and role for each missing name. Resolved ones are shown too, but locked.
              </p>
              <div className="space-y-2">
                {parsed.map((entry, i) => {
                  const r = resolved[i];
                  if (r) {
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-950/50 border border-slate-800 text-sm">
                        <span className="text-slate-600 font-mono text-xs w-6 text-right">{i + 1}.</span>
                        <span className={`${r.color} font-medium`}>{r.name}</span>
                        {r.server && <span className="text-slate-500 text-xs">- {r.server}</span>}
                        <span className="ml-auto text-xs text-slate-500">{r.class} / {r.role} ✓</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-700 text-sm">
                      <span className="text-slate-600 font-mono text-xs w-6 text-right">{i + 1}.</span>
                      <span className="text-slate-200 font-medium min-w-0 truncate flex-1">
                        {entry.name}
                        {entry.server && <span className="text-slate-500 text-xs"> - {entry.server}</span>}
                      </span>
                      <select
                        value={manualClass[i] || "Warrior"}
                        onChange={(e) => setManualClass(prev => ({ ...prev, [i]: e.target.value }))}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                      >
                        {Object.keys(classColors).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select
                        value={manualRole[i] || "DPS"}
                        onChange={(e) => setManualRole(prev => ({ ...prev, [i]: e.target.value }))}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                      >
                        <option value="TANK">Tank</option>
                        <option value="HEALER">Heal</option>
                        <option value="DPS">DPS</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {step === "paste" && (
              <button 
                onClick={handleProceed}
                disabled={!pasteText.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-2 font-semibold transition-colors"
              >
                Continue
              </button>
            )}
            {step === "resolve-choice" && (
              <button 
                onClick={() => setStep("paste")}
                className="px-4 py-2 font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            )}
            {step === "wcl-lookup" && (
              <button 
                onClick={() => setStep("resolve-choice")}
                className="px-4 py-2 font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            )}
            {step === "manual-fill" && (
              <button 
                onClick={handleManualComplete}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 font-semibold transition-colors"
              >
                Import {parsed.length} players
              </button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
