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

export const euRealms = [
  "Aegwynn", "Aerie Peak", "Agamaggan", "Aggramar", "Ahn'Qiraj", "Al'Akir", "Alexstrasza", "Alleria", "Alonsus", "Ambossar", "Anachronos", "Antonidas", "Anub'arak", "Arak-arahm", "Arathi", "Arathor", "Archimonde", "Area 52", "Argent Dawn", "Arthas", "Aszune", "Auchindoun", "Azjol-Nerub", "Azshara", "Azuremyst", "Baelgun", "Balnazzar", "Blackhand", "Blackmoore", "Blackrock", "Blade's Edge", "Bladefist", "Bloodfeather", "Bloodhoof", "Bloodscalp", "Blutkessel", "Booty Bay", "Borean Tundra", "Boulderfist", "Bronze Dragonflight", "Bronzebeard", "Burning Blade", "Burning Legion", "Burning Steppes", "C'Thun", "Chamber of Aspects", "Chants éternels", "Cho'gall", "Chromaggus", "Clairvoyants", "Colinas Pardas", "Confrérie du Thorium", "Conseil des Ombres", "Crashridge", "Cromush", "Culte de la Rive noire", "Daggerspine", "Dalaran", "Dalvengyr", "Darkmoon Faire", "Darksorrow", "Darkspear", "Das Konsortium", "Das Syndikat", "Deathguard", "Deathweaver", "Deathwing", "Defias Brotherhood", "Dentarg", "Der abyssische Rat", "Der Mithrilorden", "Der Rat von Dalaran", "Destromath", "Dethecus", "Die Aldor", "Die Arguswacht", "Die Nachtwache", "Die Silberne Hand", "Die Todeskrallen", "Doomhammer", "Draenor", "Dragonblight", "Dragonmaw", "Drak'thul", "Drek'Thar", "Dun Modr", "Dunemaul", "Durotan", "Earthen Ring", "Echsenkessel", "Eitrigg", "Eldre'Thalas", "Elune", "Emerald Dream", "Emeriss", "Eonar", "Eredar", "Eversong", "Executus", "Exodar", "Festung der Stürme", "Fordragon", "Forscherliga", "Frostmane", "Frostmourne", "Frostwhisper", "Frostwolf", "Galakrond", "Garona", "Garrosh", "Genjuros", "Ghostlands", "Gilneas", "Goldrinn", "Gordunni", "Gorgonnash", "Greymane", "Grim Batol", "Grom", "Gul'dan", "Hakkar", "Haomarush", "Hellfire", "Hellscream", "Howling Fjord", "Hyjal", "Illidan", "Jaedenar", "Kael'thas", "Karazhan", "Kargath", "Kazzak", "Kel'Thuzad", "Khadgar", "Khaz Modan", "Khaz'goroth", "Kil'jaeden", "Kilrogg", "Kirin Tor", "Kor'gall", "Krag'jin", "Krasus", "Kul Tiras", "Kult der Verdammten", "Kurinaxx", "Kurog", "Laughing Skull", "Les Clairvoyants", "Les Sentinelles", "Lich King", "Lightbringer", "Lightning's Blade", "Lordaeron", "Los Errantes", "Lothar", "Madmortem", "Magtheridon", "Mal'Ganis", "Malfurion", "Malorne", "Malygos", "Mannoroth", "Marécage de Zangar", "Mazrigos", "Medivh", "Minahonda", "Moonglade", "Mug'thol", "Nagrand", "Nathrezim", "Naxxramas", "Nazjatar", "Nefarian", "Nemesis", "Neptus", "Nera'thor", "Nethersturm", "Nordrassil", "Norgannon", "Onyxia", "Outland", "Perenolde", "Pozzo dell'Eternità", "Proudmoore", "Quel'Thalas", "Ragnaros", "Rajaxx", "Rashgarroth", "Ravencrest", "Ravenholdt", "Reliquary of Souls", "Rexxar", "Runetotem", "Sanguino", "Sargeras", "Saurfang", "Scarshield Legion", "Sen'jin", "Shadowsong", "Shattered Hand", "Shattered Halls", "Shattrath", "Shen'dralar", "Silvermoon", "Sinstralis", "Skullcrusher", "Slithice", "Spinebreaker", "Sporeggar", "Steamwheedle Cartel", "Stormrage", "Stormreaver", "Stormscale", "Sunstrider", "Suramar", "Sylvanas", "Taerar", "Talnivarr", "Tarren Mill", "Teldrassil", "Temple noir", "Terenas", "Terokkar", "Terrordar", "The Maelstrom", "The Sha'tar", "The Venture Co", "Theradras", "Thermaplugg", "Thrall", "Throk'Feroth", "Thunderhorn", "Tichondrius", "Tirion", "Todeswache", "Trollbane", "Turalyon", "Twilight's Hammer", "Twisting Nether", "Tyrande", "Uldaman", "Ulduar", "Uldum", "Un'Goro", "Varimathras", "Vashj", "Vek'lor", "Vek'nilash", "Vol'jin", "Wildhammer", "Wrathbringer", "Xavius", "Ysera", "Ysondre", "Zenedar", "Zirkel des Cenarius", "Zul'jin", "Zuluhed"
].sort();