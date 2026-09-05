import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const SONGS_PATH = path.join(process.cwd(), "data", "songs.json");

async function getSongs() {
  const data = await readFile(SONGS_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveSongs(songs: any[]) {
  await writeFile(SONGS_PATH, JSON.stringify(songs, null, 2));
}

// GET /api/songs - list all songs
export async function GET() {
  try {
    const songs = await getSongs();
    return NextResponse.json(songs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/songs - create a new song
export async function POST(request: Request) {
  try {
    const { title, description, duration, url, artistId } = await request.json();
    if (!title || !url || !artistId) {
      return NextResponse.json({ error: "Title, URL, and artistId required" }, { status: 400 });
    }

    const songs = await getSongs();
    const newSong = {
      id: `song-${Date.now()}`,
      title,
      description: description || "",
      duration: duration || "",
      url,
      artistId,
    };
    songs.push(newSong);
    await saveSongs(songs);

    return NextResponse.json(newSong, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/songs/[id] - update song
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Song ID required" }, { status: 400 });
    }

    const { title, description, duration, url, artistId } = await request.json();
    const songs = await getSongs();
    const idx = songs.findIndex((s: any) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    songs[idx] = { id, title, description, duration, url, artistId };
    await saveSongs(songs);

    return NextResponse.json(songs[idx]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/songs/[id] - delete song
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Song ID required" }, { status: 400 });
    }

    const songs = await getSongs();
    const filtered = songs.filter((s: any) => s.id !== id);
    if (filtered.length === songs.length) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
    await saveSongs(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
