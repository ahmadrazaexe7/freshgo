import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const dbPath = path.join(process.cwd(), "data", "streaks.json");
    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    let existing: any[] = [];
    try {
      const raw = await fs.readFile(dbPath, "utf-8");
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const entry = {
      id: Date.now(),
      receivedAt: new Date().toISOString(),
      payload: body
    };

    existing.push(entry);
    await fs.writeFile(dbPath, JSON.stringify(existing, null, 2), "utf-8");

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("/api/streak error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), "data", "streaks.json");
    const raw = await fs.readFile(dbPath, "utf-8");
    return new Response(raw, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
