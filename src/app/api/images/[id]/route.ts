import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const { id } = params;

    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        favorites: session?.user ? {
          where: { userId: session.user.id }
        } : false,
        variations: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Transform response
    const transformedImage = {
      ...image,
      designOptions: image.designOptions,
      tags: image.tags || [],
      upscaledUrls: image.upscaledUrls || [],
      isFavorited: session?.user ? image.favorites.length > 0 : false,
      variations: image.variations.map(variation => ({
        ...variation,
        designOptions: variation.designOptions,
        tags: variation.tags || [],
        upscaledUrls: variation.upscaledUrls || []
      }))
    };

    return NextResponse.json(transformedImage);

  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    // Check if user owns the image or is admin
    const existingImage = await prisma.image.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    if (existingImage.userId !== session?.user?.id && session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const {
      status,
      progress,
      imageUrl,
      upscaledUrls,
      tags
    } = body;

    // Update image
    const image = await prisma.image.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(imageUrl && { imageUrl }),
        ...(upscaledUrls && { upscaledUrls }),
        ...(tags && { tags })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Transform response
    const transformedImage = {
      ...image,
      designOptions: image.designOptions,
      tags: image.tags || [],
      upscaledUrls: image.upscaledUrls || []
    };

    return NextResponse.json(transformedImage);

  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const { id } = params;

    // Check if user owns the image or is admin
    const existingImage = await prisma.image.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    if (existingImage.userId !== session?.user?.id && session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete image
    await prisma.image.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}