import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { path } = await params;

    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const publicId = decodeURIComponent(path.join("/"));

    
    
    const publicIdForUrl = publicId;

    
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicIdForUrl}`;

    
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    
    const buffer = await response.arrayBuffer();

    
    const contentType = "application/pdf";

    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return NextResponse.json(
      { error: "Failed to serve document" },
      { status: 500 },
    );
  }
}
