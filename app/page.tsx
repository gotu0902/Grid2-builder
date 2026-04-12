"use client";
import { useState, useEffect } from "react";
import { classColors, getRoleIcon } from "./components/Icons";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";

export default function Home() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(4);
  const [anchor, setAnchor] = useState("TOPLEFT");
  const [orientation, setOrientation] = useState("HORIZONTAL");
  const [myRealm, setMyRealm] = useState("Tarren Mill");
  
  // STANDARD ER NÅ EMPTY:
  const [roster, setRoster] = useState<any[]>([]);
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null));
  const [wclCode, setWclCode] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ALPHABETICAL");
  const [isLoaded, setIsLoaded] = useState(false);

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverMode, setDragOverMode] = useState<"swap" | "insert-before" | "insert-after">("swap");

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert" as "alert" | "confirm",
    onConfirm: () => {}
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const showAlert = (title: string, message: string) => setModal({ isOpen: true, title, message, type: "alert", onConfirm: closeModal });
  const showConfirm = (title: string, message: string, onConfirmAction: () => void) => setModal({ isOpen: true, title, message, type: "confirm", onConfirm: onConfirmAction });

  useEffect(() => {
    const savedGrid = localStorage.getItem("raidGrid");
    const savedRoster = localStorage.getItem("raidRoster");
    const savedRows = localStorage.getItem("raidRows");
    const savedCols = localStorage.getItem("raidCols");
    const savedAnchor = localStorage.getItem("raidAnchor");
    const savedOrientation = localStorage.getItem("raidOrientation");
    const savedRealm = localStorage.getItem("raidMyRealm");

    if (savedGrid) setGrid(JSON.parse(savedGrid));
    if (savedRoster) setRoster(JSON.parse(savedRoster));
    if (savedRows) setRows(JSON.parse(savedRows));
    if (savedCols) setCols(JSON.parse(savedCols));
    if (savedAnchor) setAnchor(savedAnchor);
    if (savedOrientation) setOrientation(savedOrientation);
    if (savedRealm) setMyRealm(savedRealm);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) { 
      localStorage.setItem("raidGrid", JSON.stringify(grid));
      localStorage.setItem("raidRoster", JSON.stringify(roster));
      localStorage.setItem("raidRows", JSON.stringify(rows));
      localStorage.setItem("raidCols", JSON.stringify(cols));
      localStorage.setItem("raidAnchor", anchor);
      localStorage.setItem("raidOrientation", orientation);
      localStorage.setItem("raidMyRealm", myRealm);
    }
  }, [grid, roster, rows, cols, anchor, orientation, myRealm,isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const newSize = rows * cols;
    setGrid(prev => {
      const newGrid = [...prev];
      return newSize > prev.length ? [...newGrid, ...Array(newSize - prev.length).fill(null)] : newGrid.slice(0, newSize);
    });
  }, [rows, cols, isLoaded]);

  const fetchFromWCL = async () => {
    if (!wclCode) return showAlert("Missing ID", "Please enter a WCL log ID first.");
    setIsFetching(true);
    try {
      const res = await fetch("/api/wcl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportCode: wclCode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRoster(data.players);
      showAlert("Success!", `Found ${data.players.length} players! Roster updated.`);
    } catch (err: any) {
      showAlert("Error fetching data", err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleToggleRole = (e: React.MouseEvent, playerId: string, location: "roster" | "grid") => {
    e.stopPropagation();
    const getNextRole = (current: string) => current === "DPS" ? "TANK" : current === "TANK" ? "HEALER" : "DPS";
    if (location === "roster") {
      setRoster(prev => prev.map(p => p.id === playerId ? { ...p, role: getNextRole(p.role || "DPS") } : p));
    } else {
      setGrid(prev => prev.map(p => p?.id === playerId ? { ...p, role: getNextRole(p.role || "DPS") } : p));
    }
  };
  const handleDragStart = (e: React.DragEvent, player: any, sourceIndex: number, source: string) => {
    e.dataTransfer.setData("player", JSON.stringify(player));
    e.dataTransfer.setData("sourceIndex", sourceIndex.toString());
    e.dataTransfer.setData("source", source);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    setDragOverMode("swap");
  };

  const handleDragOverCell = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let mode: "swap" | "insert-before" | "insert-after";
    if (orientation === "VERTICAL") {
      // For vertikal: topp 25% = insert-before, bunn 25% = insert-after, midten = swap
      const relY = e.clientY - rect.top;
      const pct = relY / rect.height;
      if (pct < 0.25) mode = "insert-before";
      else if (pct > 0.75) mode = "insert-after";
      else mode = "swap";
    } else {
      // For horisontal: venstre 25% = insert-before, høyre 25% = insert-after, midten = swap
      const relX = e.clientX - rect.left;
      const pct = relX / rect.width;
      if (pct < 0.25) mode = "insert-before";
      else if (pct > 0.75) mode = "insert-after";
      else mode = "swap";
    }
    setDragOverIndex(index);
    setDragOverMode(mode);
  };

  const handleDropOnGrid = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const player = JSON.parse(e.dataTransfer.getData("player"));
    const source = e.dataTransfer.getData("source");
    const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));
    const mode = dragOverMode;

    setDragOverIndex(null);
    setDragOverMode("swap");

    let newGrid = [...grid];
    let newRoster = [...roster];

    if (mode === "swap") {
      const existingPlayerInTarget = newGrid[targetIndex];
      if (source === "roster") {
        newGrid[targetIndex] = player;
        newRoster = newRoster.filter(p => p.id !== player.id);
        if (existingPlayerInTarget) newRoster.push(existingPlayerInTarget);
      } else if (source === "grid") {
        newGrid[targetIndex] = player;
        newGrid[sourceIndex] = existingPlayerInTarget;
      }
    } else {
      // Insert-modus: skyv spillere
      const insertAt = mode === "insert-before" ? targetIndex : targetIndex + 1;

      if (source === "grid") {
        // Fjern spilleren fra kilden
        newGrid.splice(sourceIndex, 1);
        // Juster insertAt hvis nødvendig (vi fjernet et element før)
        const adjustedInsert = sourceIndex < insertAt ? insertAt - 1 : insertAt;
        newGrid.splice(adjustedInsert, 0, player);
      } else if (source === "roster") {
        newRoster = newRoster.filter(p => p.id !== player.id);
        // Hvis vi setter inn på en null-plass, bare sett den direkte
        // Ellers: skyv alle fra insertAt og fremover én plass
        // og det siste elementet som faller ut (null eller spiller) havner i roster
        const displaced = newGrid[newGrid.length - 1];
        newGrid.splice(insertAt, 0, player);
        newGrid = newGrid.slice(0, grid.length); // hold samme lengde
        if (displaced) newRoster.push(displaced);
      }
    }

    setGrid(newGrid);
    setRoster(newRoster);
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.getData("source") !== "grid") return; 
    const player = JSON.parse(e.dataTransfer.getData("player"));
    const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));

    let newGrid = [...grid];
    let newRoster = [...roster];
    
    newGrid[sourceIndex] = null;
    if (!newRoster.find(p => p.id === player.id)) newRoster.push(player);
    
    setGrid(newGrid);
    setRoster(newRoster);
  };

  const handleResetGrid = () => {
    showConfirm(
      "Clear Grid", 
      "This will remove all players from the grid and put them back in the roster. Continue?", 
      () => {
        const playersInGrid = grid.filter(p => p !== null);
        setRoster(prev => [...prev, ...playersInGrid]);
        setGrid(Array(rows * cols).fill(null));
        closeModal(); 
      }
    );
  };

  const handleEmptyRoster = () => {
    showConfirm(
      "Empty Roster", 
      "This will delete ALL players from both the grid and the roster. Are you sure?", 
      () => {
        setGrid(Array(rows * cols).fill(null));
        setRoster([]);
        closeModal();
      }
    );
  };

  const handleTestMode = () => {
    const testPlayers = [
      { id: "t1", name: "Sven", class: "Paladin", color: classColors["Paladin"], role: "TANK" },
      { id: "t2", name: "Björn", class: "Warrior", color: classColors["Warrior"], role: "TANK" },
      { id: "h1", name: "Astrid", class: "Priest", color: classColors["Priest"], role: "HEALER" },
      { id: "h2", name: "Malin", class: "Druid", color: classColors["Druid"], role: "HEALER" },
      { id: "h3", name: "Karin", class: "Shaman", color: classColors["Shaman"], role: "HEALER" },
      { id: "h4", name: "Elin", class: "Evoker", color: classColors["Evoker"], role: "HEALER" },
      { id: "d1", name: "Lars", class: "Hunter", color: classColors["Hunter"], role: "DPS" },
      { id: "d2", name: "Anders", class: "Mage", color: classColors["Mage"], role: "DPS" },
      { id: "d3", name: "Johan", class: "Rogue", color: classColors["Rogue"], role: "DPS" },
      { id: "d4", name: "Mikael", class: "Warlock", color: classColors["Warlock"], role: "DPS" },
      { id: "d5", name: "Nils", class: "DeathKnight", color: classColors["DeathKnight"], role: "DPS" },
      { id: "d6", name: "Karl", class: "DemonHunter", color: classColors["DemonHunter"], role: "DPS" },
      { id: "d7", name: "Erik", class: "Monk", color: classColors["Monk"], role: "DPS" },
      { id: "d8", name: "Per", class: "Hunter", color: classColors["Hunter"], role: "DPS" },
      { id: "d9", name: "Olof", class: "Mage", color: classColors["Mage"], role: "DPS" },
      { id: "d10", name: "Mats", class: "Rogue", color: classColors["Rogue"], role: "DPS" },
      { id: "d11", name: "Leif", class: "Warlock", color: classColors["Warlock"], role: "DPS" },
      { id: "d12", name: "Kjell", class: "DeathKnight", color: classColors["DeathKnight"], role: "DPS" },
      { id: "d13", name: "Gunnar", class: "DemonHunter", color: classColors["DemonHunter"], role: "DPS" },
      { id: "d14", name: "Tomas", class: "Paladin", color: classColors["Paladin"], role: "DPS" },
    ];
    setGrid(Array(rows * cols).fill(null));
    setRoster(testPlayers);
  };

  const handleAddManualPlayer = (name: string, playerClass: string, role: string) => {
    if (!name.trim()) return showAlert("Woops!", "Please enter a name first.");
    const newPlayer = {
      id: "manual_" + Date.now(),
      name: name.trim(),
      class: playerClass,
      color: classColors[playerClass] || "text-slate-300",
      role
    };
    setRoster(prev => [...prev, newPlayer]);
  };
  // ------------------------------

  const displayedRoster = roster
    .filter(player => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "ALPHABETICAL") return a.name.localeCompare(b.name, "no");
      if (sortBy === "CLASS") {
        const classCompare = (a.class || "").localeCompare(b.class || "", "en");
        return classCompare !== 0 ? classCompare : a.name.localeCompare(b.name, "no"); 
      }
      if (sortBy === "ROLE") {
        const roleWeight: Record<string, number> = { TANK: 1, HEALER: 2, DPS: 3 };
        const weightA = roleWeight[a.role || "DPS"] || 4;
        const weightB = roleWeight[b.role || "DPS"] || 4;
        return weightA !== weightB ? weightA - weightB : a.name.localeCompare(b.name, "no");
      }
      return 0;
    });

  const handleExport = () => {
    // Sjekk om realm er valgt
    if (!myRealm) {
      showAlert("Missing realm", "You have to choose your own realm, otherwise Grid will tell you to fuck off.");
      return;
    }

    const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();

    const exportString = grid
      .filter(slot => slot !== null)
      .map(p => {
        if (!p.server) return p.name;
        
        // Sammenligner normaliserte servernavn
        if (normalize(p.server) === normalize(myRealm)) {
          return p.name;
        }

        return `${p.name}-${p.server}`;
      })
      .join(", ");
      
    navigator.clipboard.writeText(exportString);
    showAlert("Exported!", "The following is copied to the clipboard:\n\n" + exportString);
  };

  const getGridStyle = () => ({
    display: "grid",
    gridTemplateRows: orientation === "VERTICAL" ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
    gridTemplateColumns: orientation === "HORIZONTAL" ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
    gridAutoFlow: orientation === "VERTICAL" ? "column" : undefined,
    direction: anchor === "TOPRIGHT" ? "rtl" : "ltr"
  } as React.CSSProperties);

  if (!isLoaded) return null; 

  return (
    <main className="flex min-h-screen bg-slate-950 text-white p-8 font-sans" onDragOver={e => e.preventDefault()} onDrop={handleDropOutside}>
      <div className="flex-1 pr-8 flex flex-col">       
          {/* GRID */}
        <div className="w-full max-w-4xl bg-slate-900 p-4 border border-slate-800 mb-6 shadow-lg">
          <div style={getGridStyle()} className="gap-2">
            {grid.map((player, index) => {
              const isSwapTarget = dragOverIndex === index && dragOverMode === "swap";
              const isInsertBefore = dragOverIndex === index && dragOverMode === "insert-before";
              const isInsertAfter = dragOverIndex === index && dragOverMode === "insert-after";
              const isVertical = orientation === "VERTICAL";

              return (
                <div
                  key={index}
                  onDragOver={(e) => handleDragOverCell(e, index)}
                  onDragLeave={(e) => {
                    // Bare reset hvis vi forlater cellen helt (ikke til et child-element)
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDragOverIndex(null);
                      setDragOverMode("swap");
                    }
                  }}
                  onDrop={(e) => handleDropOnGrid(e, index)}
                  className={[
                    "h-24 bg-slate-950 border flex items-center justify-center relative overflow-visible group",
                    isSwapTarget
                      ? "border-blue-400 shadow-[0_0_0_2px_rgba(96,165,250,0.5)]"
                      : "border-slate-700 hover:border-slate-500",
                  ].join(" ")}
                  style={{ direction: "ltr" }}
                >
                  {/* Insert-before indikator */}
                  {isInsertBefore && (
                    <div className={[
                      "absolute z-20 bg-green-400 rounded-full pointer-events-none",
                      isVertical
                        ? "top-0 left-1 right-1 h-0.5 -translate-y-1/2"
                        : "left-0 top-1 bottom-1 w-0.5 -translate-x-1/2"
                    ].join(" ")} />
                  )}
                  {/* Insert-after indikator */}
                  {isInsertAfter && (
                    <div className={[
                      "absolute z-20 bg-green-400 rounded-full pointer-events-none",
                      isVertical
                        ? "bottom-0 left-1 right-1 h-0.5 translate-y-1/2"
                        : "right-0 top-1 bottom-1 w-0.5 translate-x-1/2"
                    ].join(" ")} />
                  )}

                  <span className="absolute top-1 left-2 text-xs text-slate-600 font-mono">{index + 1}</span>
                  {player ? (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, player, index, "grid")}
                      onDragEnd={handleDragEnd}
                      className={[
                        "w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing bg-slate-800 border-2 relative",
                        isSwapTarget ? "border-blue-400" : "border-transparent hover:border-slate-500",
                        player.color,
                      ].join(" ")}
                    >
                      <button onClick={(e) => handleToggleRole(e, player.id, "grid")} className="absolute top-1 right-2 p-1 hover:bg-slate-700 opacity-70 hover:opacity-100" title="Klikk for å bytte rolle">
                        {getRoleIcon(player.role || "DPS")}
                      </button>
                      <span className="font-semibold drop-shadow-md">{player.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm italic opacity-50">Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* INNSTILLINGER */}
        <Settings rows={rows} setRows={setRows} cols={cols} setCols={setCols} anchor={anchor} setAnchor={setAnchor} orientation={orientation} setOrientation={setOrientation} handleResetGrid={handleResetGrid} handleExport={handleExport} myRealm={myRealm} setMyRealm={setMyRealm} />
      </div>

      {/* SIDEBAR */}
      <Sidebar 
        roster={roster}
        wclCode={wclCode}
        setWclCode={setWclCode}
        isFetching={isFetching}
        fetchFromWCL={fetchFromWCL}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        displayedRoster={displayedRoster}
        handleDragStart={handleDragStart}
        handleToggleRole={handleToggleRole}
        handleEmptyRoster={handleEmptyRoster}
        handleTestMode={handleTestMode}
        handleAddManualPlayer={handleAddManualPlayer}
      />
      
      {/* MODAL POPUP */}
      <Modal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />
    </main>
  );
}