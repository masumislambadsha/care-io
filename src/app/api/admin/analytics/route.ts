import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        service:services(name),
        caregiver:users!bookings_caregiver_id_fkey(id, name)
      `,
      )
      .gte("created_at", startDate.toISOString());

    if (bookingsError) {
      console.error("Bookings fetch error:", bookingsError);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 },
      );
    }

    
    const { data: users, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id, role, created_at");

    if (usersError) {
      console.error("Users fetch error:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      );
    }

    
    const { data: caregiverProfiles, error: profilesError } =
      await supabaseAdmin
        .from("caregiver_profiles")
        .select("user_id, avg_rating, total_bookings");

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
    }

    
    const totalRevenue = bookings
      .filter((b: any) => b.payment_status === "PAID")
      .reduce((sum: number, b: any) => sum + parseFloat(b.total_amount), 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const thisMonthRevenue = bookings
      .filter(
        (b: any) =>
          b.payment_status === "PAID" && new Date(b.created_at) >= thisMonth,
      )
      .reduce((sum: number, b: any) => sum + parseFloat(b.total_amount), 0);

    const lastMonthRevenue = bookings
      .filter(
        (b: any) =>
          b.payment_status === "PAID" &&
          new Date(b.created_at) >= lastMonth &&
          new Date(b.created_at) < thisMonth,
      )
      .reduce((sum: number, b: any) => sum + parseFloat(b.total_amount), 0);

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    
    const bookingsByStatus = bookings.reduce((acc: any, b: any) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    
    const bookingsByService = bookings.reduce((acc: any, b: any) => {
      const serviceName = b.service?.name || "Unknown";
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    
    const clients = users.filter((u: any) => u.role === "CLIENT").length;
    const caregivers = users.filter((u: any) => u.role === "CAREGIVER").length;
    const newThisMonth = users.filter(
      (u: any) => new Date(u.created_at) >= thisMonth,
    ).length;

    
    const caregiverStats = bookings.reduce((acc: any, b: any) => {
      if (b.caregiver_id) {
        if (!acc[b.caregiver_id]) {
          acc[b.caregiver_id] = {
            id: b.caregiver_id,
            name: b.caregiver?.name || "Unknown",
            bookings: 0,
            revenue: 0,
          };
        }
        acc[b.caregiver_id].bookings += 1;
        if (b.payment_status === "PAID") {
          acc[b.caregiver_id].revenue += parseFloat(b.total_amount);
        }
      }
      return acc;
    }, {});

    const topCaregivers = Object.values(caregiverStats)
      .map((c: any) => {
        const profile = caregiverProfiles?.find((p) => p.user_id === c.id);
        return {
          ...c,
          rating: profile?.avg_rating || 0,
        };
      })
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    
    const serviceStats = bookings.reduce((acc: any, b: any) => {
      const serviceName = b.service?.name || "Unknown";
      if (!acc[serviceName]) {
        acc[serviceName] = {
          id: b.service_id,
          name: serviceName,
          bookings: 0,
          revenue: 0,
        };
      }
      acc[serviceName].bookings += 1;
      if (b.payment_status === "PAID") {
        acc[serviceName].revenue += parseFloat(b.total_amount);
      }
      return acc;
    }, {});

    const topServices = Object.values(serviceStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    
    const revenueByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      monthDate.setDate(1);
      monthDate.setHours(0, 0, 0, 0);

      const nextMonth = new Date(monthDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthRevenue = bookings
        .filter(
          (b: any) =>
            b.payment_status === "PAID" &&
            new Date(b.created_at) >= monthDate &&
            new Date(b.created_at) < nextMonth,
        )
        .reduce((sum: number, b: any) => sum + parseFloat(b.total_amount), 0);

      revenueByMonth.push({
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        revenue: monthRevenue,
      });
    }

    const analytics = {
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: revenueGrowth,
      },
      bookings: {
        total: bookings.length,
        thisMonth: bookings.filter(
          (b: any) => new Date(b.created_at) >= thisMonth,
        ).length,
        byStatus: bookingsByStatus,
        byService: bookingsByService,
      },
      users: {
        total: users.length,
        clients,
        caregivers,
        newThisMonth,
      },
      topCaregivers,
      topServices,
      revenueByMonth,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
