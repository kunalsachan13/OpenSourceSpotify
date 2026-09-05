import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    async function fetchArtists() {
      const res = await fetch("/api/artists");
      const data = await res.json();
      setArtists(data);
    }
    fetchArtists();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, bio: newBio }),
    });
    const artist = await res.json();
    setArtists((prev) => [...prev, artist]);
    setNewName("");
    setNewBio("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artists</h1>

      {/* Create form */}
      <div className="mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Artist name"
          className="border rounded p-2 w-full"
        />
        <textarea
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Bio"
          className="mt-2 border rounded p-2 w-full"
        ></textarea>
        <button
          onClick={handleCreate}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Artist
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {artists.map((artist) => (
          <div key={artist.id} className="flex justify-between items-center p-3 border rounded">
            <span className="font-medium">{artist.name}</span>
            <span className="text-sm text-gray-500">{artist.bio || ""}</span>
            <button
              className="text-red-500 underline cursor-pointer"
              onClick={() => {
                // TODO: delete artist
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
