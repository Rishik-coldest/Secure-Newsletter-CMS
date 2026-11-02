import { NextResponse } from "next/server";
import { prisma } from "./../../lib/prisma";

interface RouteProps {
  params: Promise<{ id: string }>;
}

// PUT Handler: Updates an existing record's parameters or status options
export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, image, status } = body;

    const updatedLetter = await prisma.newsletter.update({
      where: { id },
      data: {
        title,
        content,
        image,
        status, // Allows switching between "Draft", "Schedule", and "Sent"
      },
    });

    return NextResponse.json(updatedLetter, { status: 200 });
  } catch (error) {
    console.error("API error updating record:", error);
    return NextResponse.json({ error: "Failed to update database row" }, { status: 500 });
  }
}

// DELETE Handler: Permanently purges a specific record from the database tier
export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    await prisma.newsletter.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API error deleting record:", error);
    return NextResponse.json({ error: "Failed to purge database row" }, { status: 500 });
  }
}
