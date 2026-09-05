import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDesc] = useState("");
  const [newSongIds, setNewSongIds] = useState("");

  useEffect(() => {
    async function fetchPlaylists() {
      const res = await fetch("/api/playlists");
      const data = await res.json();
      setPlaylists(data);
    }
    fetchPlaylists();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        description: newDesc,
        userId: "user-1", // hardcoded for demo
        songIds: newSongIds.split(",").map(s => s.trim()).filter(s => s),
      }),
    });
    const playlist = await res.json();
    setPlaylists((prev) => [...prev, playlist]);
    setNewName("");
    setNewDesc("");
    setNewSongIds("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playlists</h1>

      {/* Create form */}
      <div className="mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Playlist name"
          className="border rounded p-2 w-full"
        />
        <textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description"
          className="mt-2 border rounded p-2 w-full"
        ></textarea>
        <input
          value={newSongIds}
          onChange={(e) => setNewSongIds(e.target.value)}
          placeholder="Song IDs (comma-separated)"
          className="mt-2 border rounded p-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
        >
          Create Playlist
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex justify-between items-center p-3 border rounded">
            <span className="font-medium">{playlist.name}</span>
            <span className="text-sm text-gray-500">
              {playlist.songIds.length} songs
            </span>
            <button
              className="text-red-500 underline cursor-pointer"
              onClick={() => {
                // TODO: delete playlist
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
