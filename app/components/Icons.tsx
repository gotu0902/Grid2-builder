import React from "react";

export const classColors: Record<string, string> = {
  DeathKnight: "text-[#C41E3A]",
  DemonHunter: "text-[#A330C9]",
  Druid: "text-[#FF7C0A]",
  Evoker: "text-[#33937F]",
  Hunter: "text-[#AAD372]",
  Mage: "text-[#3FC7EB]",
  Monk: "text-[#00FF98]",
  Paladin: "text-[#F48CBA]",
  Priest: "text-[#FFFFFF]",
  Rogue: "text-[#FFF468]",
  Shaman: "text-[#0070DD]",
  Warlock: "text-[#8788EE]",
  Warrior: "text-[#C69B6D]"
};

export const getRoleIcon = (role: string) => {
  if (role === "TANK") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  );
  if (role === "HEALER") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 21l2-2"></path></svg>
  );
};