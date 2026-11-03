import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "@/auth";

// INDIVIDUAL FETCH
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await prisma.newsletter.findFirst({
    where: {
      id: params.id,
      authorId: parseInt(session.user.id), // Enforce isolation barrier
    },
  });

  if (!item) return NextResponse.json({ error: "Not Found or Access Denied" }, { status: 404 });
  return NextResponse.json(item);
}

// UPDATE
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, image, content, status } = await request.json();

  try {
    // updateMany returns a count of rows altered. If 0, the record doesn't belong to them!
    const updateResult = await prisma.newsletter.updateMany({
      where: {
        id:params.id,
        authorId: parseInt(session.user.id), 
      },
      data: { title, image, content, status },
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Unauthorized resource update attempt" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const deleteResult = await prisma.newsletter.deleteMany({
      where: {
        id: params.id,
        authorId: parseInt(session.user.id),
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Unauthorized deletion attempt" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
