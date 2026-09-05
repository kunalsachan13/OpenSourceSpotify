import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

async function getUsers() {
  const data = await readFile(USERS_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveUsers(users: any[]) {
  await writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const users = await getUsers();
    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In real app, hash password
    };

    users.push(newUser);
    await saveUsers(users);

    // Set a session cookie for logged-in user
    const response = NextResponse.json({ user: newUser, success: true });
    response.cookies.set("user-id", newUser.id, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
