import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Fetch user's favorites with images
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          image: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit
      }),
      prisma.favorite.count({
        where: { userId: session.user.id }
      })
    ]);

    // Transform the data
    const transformedFavorites = favorites.map(favorite => ({
      id: favorite.id,
      createdAt: favorite.createdAt,
      image: {
        ...favorite.image,
        designOptions: favorite.image.designOptions,
        tags: favorite.image.tags || [],
        upscaledUrls: favorite.image.upscaledUrls || [],
        isFavorited: true
      }
    }));

    return NextResponse.json({
      favorites: transformedFavorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_imageId: {
          userId: session.user.id,
          imageId
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Image already favorited" },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        imageId
      },
      include: {
        image: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Transform response
    const transformedFavorite = {
      id: favorite.id,
      createdAt: favorite.createdAt,
      image: {
        ...favorite.image,
        designOptions: favorite.image.designOptions,
        tags: favorite.image.tags || [],
        upscaledUrls: favorite.image.upscaledUrls || [],
        isFavorited: true
      }
    };

    return NextResponse.json(transformedFavorite, { status: 201 });

  } catch (error) {
    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { error: "Failed to create favorite" },
      { status: 500 }
    );
  }
}