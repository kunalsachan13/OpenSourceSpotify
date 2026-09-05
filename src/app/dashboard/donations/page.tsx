import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [newAmount, setNewAmount] = useState("");
  const [newCurrency, setNewCurrency] = useState("USD");
  const [newArtistId, setNewArtistId] = useState("");

  useEffect(() => {
    async function fetchDonations() {
      const res = await fetch("/api/donations");
      const data = await res.json();
      setDonations(data);
    }
    fetchDonations();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(newAmount),
        currency: newCurrency,
        userId: "user-1", // hardcoded for demo
        artistId: newArtistId,
      }),
    });
    const donation = await res.json();
    setDonations((prev) => [...prev, donation]);
    setNewAmount("");
    setNewCurrency("USD");
    setNewArtistId("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donations</h1>

      {/* Create form */}
      <div className="mb-4">
        <input
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          className="border rounded p-2 w-full"
        />
        <select
          value={newCurrency}
          onChange={(e) => setNewCurrency(e.target.value)}
          className="mt-2 border rounded p-2 w-full"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <input
          value={newArtistId}
          onChange={(e) => setNewArtistId(e.target.value)}
          placeholder="Artist ID"
          className="mt-2 border rounded p-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="mt-2 bg-orange-600 text-white px-4 py-2 rounded"
        >
          Donate
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="flex justify-between items-center p-3 border rounded">
            <span className="font-medium">Donate to {donation.artistId}</span>
            <span className="text-sm text-gray-500">${donation.amount.toFixed(2)} {donation.currency}</span>
            <button
              className="text-red-500 underline cursor-pointer"
              onClick={() => {
                // TODO: delete donation
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
