import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const status = searchParams.get("status") || undefined;
    const userId = searchParams.get("userId") || session?.user?.id;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }

    // Fetch images with pagination
    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
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
          } : false
        }
      }),
      prisma.image.count({ where })
    ]);

    // Transform the data to include native JSON fields
    const transformedImages = images.map(image => ({
      ...image,
      designOptions: image.designOptions,
      tags: image.tags || [],
      upscaledUrls: image.upscaledUrls || [],
      isFavorited: session?.user ? image.favorites.length > 0 : false
    }));

    return NextResponse.json({
      images: transformedImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      prompt,
      designOptions,
      status = "pending",
      progress = 0,
      imageUrl,
      upscaledUrls = [],
      tags = [],
      parentImageId
    } = body;

    // Create new image record
    const image = await prisma.image.create({
      data: {
        userId: session?.user?.id || null,
        parentImageId,
        prompt,
        imageUrl,
        upscaledUrls,
        status,
        progress,
        designOptions,
        tags
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

    return NextResponse.json(transformedImage, { status: 201 });

  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}