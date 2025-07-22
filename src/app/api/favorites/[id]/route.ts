import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await props.params;
    const { id } = params;

    // Check if favorite exists and belongs to user
    const favorite = await prisma.favorite.findFirst({
      where: {
        OR: [
          { id }, // Delete by favorite ID
          { imageId: id, userId: session.user.id } // Delete by image ID
        ],
        userId: session.user.id
      }
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: { id: favorite.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}