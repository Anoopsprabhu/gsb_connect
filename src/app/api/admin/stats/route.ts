import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      eventCount,
      adminCount,
      enquiryCount,
      startupCount,
      registrationCount,
      uniqueVenues,
      uniqueTypes,
      unreadEnquiries,
      callbackEnquiries,
      todayEnquiries,
      pendingStartups,
      approvedStartups,
      todayStartups,
      pendingRegistrations,
      confirmedRegistrations,
      todayRegistrations,
      activeAdmins,
      superAdmins,
      totalEnquiries,
      totalStartups,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.admin.count(),
      prisma.enquiry.count({ where: { status: "new" } }),
      prisma.startup.count({ where: { status: "pending" } }),
      prisma.registration.count(),
      
      prisma.event.groupBy({ by: ["location"] }).then(res => res.length),
      prisma.event.groupBy({ by: ["type"] }).then(res => res.length),
      
      prisma.enquiry.count({ where: { status: "new" } }),
      prisma.enquiry.count({ where: { status: "callback" } }),
      prisma.enquiry.count({ where: { createdAt: { gte: startOfToday } } }),
      
      prisma.startup.count({ where: { status: "pending" } }),
      prisma.startup.count({ where: { status: "approved" } }),
      prisma.startup.count({ where: { createdAt: { gte: startOfToday } } }),
      
      prisma.registration.count({ where: { status: "pending" } }),
      prisma.registration.count({ where: { status: "confirmed" } }),
      prisma.registration.count({ where: { createdAt: { gte: startOfToday } } }),
      
      prisma.admin.count({ where: { status: "active" } }),
      prisma.admin.count({ where: { role: "superadmin" } }),
      
      prisma.enquiry.count(),
      prisma.startup.count(),
    ]);

    return NextResponse.json({
      events: eventCount,
      members: adminCount,
      newEnquiries: enquiryCount,
      pendingStartups: startupCount,
      
      sections: {
        events: {
          total: eventCount,
          venues: uniqueVenues,
          categories: uniqueTypes
        },
        enquiries: {
          total: totalEnquiries,
          unread: unreadEnquiries,
          callback: callbackEnquiries,
          today: todayEnquiries
        },
        startups: {
          total: totalStartups,
          pending: pendingStartups,
          approved: approvedStartups,
          today: todayStartups
        },
        registrations: {
          total: registrationCount,
          pending: pendingRegistrations,
          confirmed: confirmedRegistrations,
          today: todayRegistrations
        },
        users: {
          total: adminCount,
          active: activeAdmins,
          superAdmins: superAdmins
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

