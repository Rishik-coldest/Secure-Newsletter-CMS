import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { auth } from "@/auth"; 

// GET: Fetches user-isolated newsletters
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const userNewsletters = await prisma.newsletter.findMany({
      where: {
        authorId: parseInt(session.user.id),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(userNewsletters);
  } catch (error) {
    return NextResponse.json({ error: "Database transaction failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    // 1. Safe extraction check
    const userIdRaw = session?.user?.id;
    const parsedAuthorId = userIdRaw ? parseInt(userIdRaw) : NaN;

    // 2. Reject early if unauthorized or non-numeric id
    if (isNaN(parsedAuthorId)) {
      console.error("Authentication Error: session.user.id is missing or not a valid number. Value:", userIdRaw);
      return NextResponse.json({ error: "Unauthorized or invalid user session ID" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, image } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 3. Save to database with verified safe integer id
    const newLetter = await prisma.newsletter.create({
      data: {
        title,
        content,
        image: image || "https://unsplash.com",
        status: "Draft",
        authorId: parsedAuthorId, 
      },
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error) {
    console.error("API error creating record:", error);
    return NextResponse.json({ error: "Failed to build database row" }, { status: 500 });
  }
}
