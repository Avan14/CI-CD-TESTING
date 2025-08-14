import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGO_URL || "mongodb://localhost:27017");

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("ci-cd-db"); 
    const users = db.collection("users");

    // Optionally check for existing user
    const existing = await users.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    await users.insertOne({ username, password });
    return NextResponse.json({ message: "User added!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    await client.close();
  }
}