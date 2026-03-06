import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: members, error } = await supabaseAdmin
      .from("family_members")
      .select("*")
      .eq("user_id", session.user.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("Family members fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch family members" },
        { status: 500 },
      );
    }

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Family members fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, relationship, special_needs } = body;

    if (!name || !age || !relationship) {
      return NextResponse.json(
        { error: "Name, age, and relationship are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("family_members")
      .insert({
        user_id: session.user.id,
        name,
        age,
        relationship,
        special_needs: special_needs || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Family member create error:", error);
      return NextResponse.json(
        { error: "Failed to create family member" },
        { status: 500 },
      );
    }

    return NextResponse.json({ member: data });
  } catch (error) {
    console.error("Family member create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, age, relationship, special_needs } = body;

    if (!name || !age || !relationship) {
      return NextResponse.json(
        { error: "Name, age, and relationship are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("family_members")
      .update({
        name,
        age,
        relationship,
        special_needs: special_needs || null,
      })
      .eq("id", memberId)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Family member update error:", error);
      return NextResponse.json(
        { error: "Failed to update family member" },
        { status: 500 },
      );
    }

    return NextResponse.json({ member: data });
  } catch (error) {
    console.error("Family member update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("family_members")
      .delete()
      .eq("id", memberId)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Family member delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete family member" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Family member deleted" });
  } catch (error) {
    console.error("Family member delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
