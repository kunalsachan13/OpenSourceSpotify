import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const DONATIONS_PATH = path.join(process.cwd(), "data", "donations.json");

async function getDonations() {
  const data = await readFile(DONATIONS_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveDonations(donations: any[]) {
  await writeFile(DONATIONS_PATH, JSON.stringify(donations, null, 2));
}

// GET /api/donations - list all donations
export async function GET() {
  try {
    const donations = await getDonations();
    return NextResponse.json(donations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/donations - create a new donation
export async function POST(request: Request) {
  try {
    const { amount, currency, userId, artistId } = await request.json();
    if (!amount || !userId || !artistId) {
      return NextResponse.json({ error: "amount, userId, and artistId required" }, { status: 400 });
    }

    const donations = await getDonations();
    const newDonation = {
      id: `donation-${Date.now()}`,
      amount: parseFloat(amount),
      currency: currency || "USD",
      userId,
      artistId,
      createdAt: new Date().toISOString(),
    };
    donations.push(newDonation);
    await saveDonations(donations);

    return NextResponse.json(newDonation, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
