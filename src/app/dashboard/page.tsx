import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function DashboardHome() {
  const [artistsCount, setArtistsCount] = useState(0);
  const [songsCount, setSongsCount] = useState(0);
  const [donationsTotal, setDonationsTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res1 = await fetch("/api/artists");
      const artists = await res1.json();
      setArtistsCount(artists.length);

      const res2 = await fetch("/api/songs");
      const songs = await res2.json();
      setSongsCount(songs.length);

      const res3 = await fetch("/api/donations");
      const donations = await res3.json();
      const total = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
      setDonationsTotal(total);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{artistsCount}</div>
            <div className="text-sm text-gray-500">Active artists</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{songsCount}</div>
            <div className="text-sm text-gray-500">Tracks available</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${donationsTotal.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total contributed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
