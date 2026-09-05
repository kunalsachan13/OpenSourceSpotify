import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const users = await readFile(USERS_PATH, "utf-8");
    const userList = JSON.parse(users);
    const user = userList.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set session cookie
    const response = NextResponse.json({ success: true, user });
    response.cookies.set("user-id", user.id, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
