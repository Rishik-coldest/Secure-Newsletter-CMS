import { NextResponse } from "next/server";
import { prisma } from "./../lib/prisma";

// GET: Fetches entries from the database
export async function GET() {
  try {
    const records = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("API error fetching records:", error);
    return NextResponse.json({ error: "Failed to read database rows" }, { status: 500 });
  }
}

// POST: Instantiates a new database row item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, image, authorId } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const newLetter = await prisma.newsletter.create({
      data: {
        title,
        content,
        image: image || "https://unsplash.com",
        status: "Draft",
        authorId: parseInt(authorId),
      },
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error) {
    console.error("API error creating record:", error);
    return NextResponse.json({ error: "Failed to build database row" }, { status: 500 });
  }
}
