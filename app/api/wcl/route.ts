import { NextResponse } from 'next/server';

// Nøyaktige RGB Hex-koder fra WoW via Tailwind's arbitrary values
const classColors: Record<string, string> = {
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

export async function GET() {
  return NextResponse.json({ message: "WCL API-et fungerer og lytter!" });
}

export async function POST(request: Request) {
  try {
    const { reportCode } = await request.json();
    if (!reportCode) return NextResponse.json({ error: "Mangler reportCode" }, { status: 400 });

    // 1. Hent Access Token fra WCL
    const credentials = Buffer.from(`${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch("https://www.warcraftlogs.com/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("Kunne ikke autentisere med WCL");

    // 2. Gjør GraphQL spørring (Lagt til 'server')
    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            masterData {
              actors(type: "Player") {
                id
                name
                subType
                server 
              }
            }
          }
        }
      }
    `;

    const wclRes = await fetch("https://www.warcraftlogs.com/api/v2/client", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const wclData = await wclRes.json();
    const actors = wclData.data?.reportData?.report?.masterData?.actors || [];

    // 3. Formater dataen i route.ts
    const formattedPlayers = actors
      .filter((player: any) => player.subType !== "Unknown") 
      .map((player: any) => ({
        id: player.id.toString(),
        name: player.name,
        server: player.server ? player.server.replace(/\s+/g, '') : "", 
        class: player.subType,
        color: classColors[player.subType] || "text-slate-300",
        role: "DPS" // <-- NY LINJE: Setter standardrolle
      }));

    // Fjern duplikater og sorter alfabetisk
    const uniquePlayers = Array.from(new Map(formattedPlayers.map((p: any) => [p.name, p])).values()) as any[];
    uniquePlayers.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ players: uniquePlayers });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}