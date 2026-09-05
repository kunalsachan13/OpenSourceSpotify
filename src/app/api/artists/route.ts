import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const ARTISTS_PATH = path.join(process.cwd(), "data", "artists.json");

async function getArtists() {
  const data = await readFile(ARTISTS_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveArtists(artists: any[]) {
  await writeFile(ARTISTS_PATH, JSON.stringify(artists, null, 2));
}

// GET /api/artists - list all artists
export async function GET() {
  try {
    const artists = await getArtists();
    return NextResponse.json(artists);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/artists - create a new artist
export async function POST(request: Request) {
  try {
    const { name, bio } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const artists = await getArtists();
    const newArtist = {
      id: `artist-${Date.now()}`,
      name,
      bio: bio || "",
      songs: [],
    };
    artists.push(newArtist);
    await saveArtists(artists);

    return NextResponse.json(newArtist, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/artists/[id] - update artist
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Artist ID required" }, { status: 400 });
    }

    const { name, bio } = await request.json();
    const artists = await getArtists();
    const idx = artists.findIndex((a: any) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }
    artists[idx].name = name;
    artists[idx].bio = bio;
    await saveArtists(artists);

    return NextResponse.json(artists[idx]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/artists/[id] - delete artist
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Artist ID required" }, { status: 400 });
    }

    const artists = await getArtists();
    const filtered = artists.filter((a: any) => a.id !== id);
    if (filtered.length === artists.length) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }
    await saveArtists(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
