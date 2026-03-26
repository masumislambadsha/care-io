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

    const { data: addresses, error } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("user_id", session.user.id)
      .order("is_default", { ascending: false });

    if (error) {
      console.error("Addresses fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch addresses" },
        { status: 500 },
      );
    }

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Addresses fetch error:", error);
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
    const { label, division, district, city, area, address, is_default } = body;

    if (!label || !division || !district || !city || !area || !address) {
      return NextResponse.json(
        { error: "All address fields are required" },
        { status: 400 },
      );
    }

    
    if (is_default) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", session.user.id);
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .insert({
        user_id: session.user.id,
        label,
        division,
        district,
        city,
        area,
        address,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Address create error:", error);
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: 500 },
      );
    }

    return NextResponse.json({ address: data });
  } catch (error) {
    console.error("Address create error:", error);
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
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { label, division, district, city, area, address, is_default } = body;

    
    if (is_default) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", session.user.id);
    }

    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (division !== undefined) updateData.division = division;
    if (district !== undefined) updateData.district = district;
    if (city !== undefined) updateData.city = city;
    if (area !== undefined) updateData.area = area;
    if (address !== undefined) updateData.address = address;
    if (is_default !== undefined) updateData.is_default = is_default;

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .update(updateData)
      .eq("id", addressId)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Address update error:", error);
      return NextResponse.json(
        { error: "Failed to update address" },
        { status: 500 },
      );
    }

    return NextResponse.json({ address: data });
  } catch (error) {
    console.error("Address update error:", error);
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
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Address delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete address" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Address delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
