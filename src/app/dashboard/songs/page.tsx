import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDesc] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newArtistId, setNewArtistId] = useState("");

  useEffect(() => {
    async function fetchSongs() {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    }
    fetchSongs();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        duration: newDuration,
        url: newUrl,
        artistId: newArtistId,
      }),
    });
    const song = await res.json();
    setSongs((prev) => [...prev, song]);
    setNewTitle("");
    setNewDesc("");
    setNewDuration("");
    setNewUrl("");
    setNewArtistId("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Songs</h1>

      {/* Create form */}
      <div className="mb-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Song title"
          className="border rounded p-2 w-full"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description"
          className="mt-2 border rounded p-2 w-full"
        ></textarea>
        <input
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value)}
          placeholder="Duration (e.g., 3:45)"
          className="mt-2 border rounded p-2 w-full"
        />
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Streaming URL"
          className="mt-2 border rounded p-2 w-full"
        />
        <input
          value={newArtistId}
          onChange={(e) => setNewArtistId(e.target.value)}
          placeholder="Artist ID"
          className="mt-2 border rounded p-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Song
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {songs.map((song) => (
          <div key={song.id} className="flex justify-between items-center p-3 border rounded">
            <span className="font-medium">{song.title}</span>
            <span className="text-sm text-gray-500">
              {song.artistId} • {song.duration}
            </span>
            <button
              className="text-red-500 underline cursor-pointer"
              onClick={() => {
                // TODO: delete song
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
