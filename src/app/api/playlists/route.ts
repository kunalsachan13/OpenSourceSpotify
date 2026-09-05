import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const PLAYLISTS_PATH = path.join(process.cwd(), "data", "playlists.json");

async function getPlaylists() {
  const data = await readFile(PLAYLISTS_PATH, "utf-8");
  return JSON.parse(data);
}

async function savePlaylists(playlists: any[]) {
  await writeFile(PLAYLISTS_PATH, JSON.stringify(playlists, null, 2));
}

// GET /api/playlists - list all playlists
export async function GET() {
  try {
    const playlists = await getPlaylists();
    return NextResponse.json(playlists);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/playlists - create a new playlist
export async function POST(request: Request) {
  try {
    const { name, description, userId, songIds } = await request.json();
    if (!name || !userId) {
      return NextResponse.json({ error: "Name and userId required" }, { status: 400 });
    }

    const playlists = await getPlaylists();
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      description: description || "",
      userId,
      songIds: songIds || [],
    };
    playlists.push(newPlaylist);
    await savePlaylists(playlists);

    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/playlists/[id] - update playlist
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Playlist ID required" }, { status: 400 });
    }

    const { name, description, songIds } = await request.json();
    const playlists = await getPlaylists();
    const idx = playlists.findIndex((p: any) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }
    playlists[idx].name = name;
    playlists[idx].description = description;
    playlists[idx].songIds = songIds || [];
    await savePlaylists(playlists);

    return NextResponse.json(playlists[idx]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/playlists/[id] - delete playlist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Playlist ID required" }, { status: 400 });
    }

    const playlists = await getPlaylists();
    const filtered = playlists.filter((p: any) => p.id !== id);
    if (filtered.length === playlists.length) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }
    await savePlaylists(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
