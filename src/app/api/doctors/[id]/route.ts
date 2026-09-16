import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, users, hospitals, doctorReviews, favoriteDoctors } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctorId = parseInt(id, 10);
    
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    const session = await getSession();

    // Fetch doctor details
    const doctorResult = await db
      .select({
        id: doctors.id,
        userId: doctors.userId,
        name: users.name,
        email: users.email,
        phone: users.phone,
        specialization: doctors.specialization,
        qualification: doctors.qualification,
        experience: doctors.experience,
        consultationFee: doctors.consultationFee,
        rating: doctors.rating,
        languages: doctors.languages,
        onlineAvailable: doctors.onlineAvailable,
        offlineAvailable: doctors.offlineAvailable,
        hospitalId: doctors.hospitalId,
        hospitalName: hospitals.name,
        clinicAddress: doctors.clinicAddress,
        clinicTimings: doctors.clinicTimings,
        bio: doctors.bio,
        totalPatients: doctors.totalPatients,
        city: doctors.city,
        state: doctors.state,
        country: doctors.country,
        gender: doctors.gender,
        latitude: doctors.latitude,
        longitude: doctors.longitude,
        profileImage: doctors.profileImage,
        registrationNumber: doctors.registrationNumber,
        services: doctors.services,
        doctorPhone: doctors.phone,
        totalReviews: doctors.totalReviews,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id))
      .where(eq(doctors.id, doctorId))
      .limit(1);

    if (doctorResult.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const doctor = doctorResult[0];

    // Fetch reviews
    const reviews = await db
      .select({
        id: doctorReviews.id,
        rating: doctorReviews.rating,
        reviewText: doctorReviews.reviewText,
        createdAt: doctorReviews.createdAt,
        reviewerName: users.name,
        reviewerAvatar: users.avatar,
      })
      .from(doctorReviews)
      .innerJoin(users, eq(doctorReviews.patientId, users.id))
      .where(eq(doctorReviews.doctorId, doctorId));

    // Calculate computed average rating from reviews if there are any
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) / reviews.length 
      : Number(doctor.rating);

    // Check if favorited by current user
    let isFavorited = false;
    if (session?.userId) {
      const favResult = await db
        .select({ id: favoriteDoctors.id })
        .from(favoriteDoctors)
        .where(
          and(
            eq(favoriteDoctors.doctorId, doctorId),
            eq(favoriteDoctors.patientId, session.userId)
          )
        )
        .limit(1);
      
      isFavorited = favResult.length > 0;
    }

    return NextResponse.json({
      ...doctor,
      computedRating: avgRating,
      reviews,
      isFavorited,
    });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return NextResponse.json({ error: "Failed to fetch doctor details" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const doctorId = parseInt(id, 10);
    
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    const body = await req.json();
    if (body.action === 'favorite') {
      const existingFav = await db
        .select({ id: favoriteDoctors.id })
        .from(favoriteDoctors)
        .where(
          and(
            eq(favoriteDoctors.doctorId, doctorId),
            eq(favoriteDoctors.patientId, session.userId)
          )
        )
        .limit(1);

      if (existingFav.length > 0) {
        // Remove favorite
        await db.delete(favoriteDoctors).where(eq(favoriteDoctors.id, existingFav[0].id));
        return NextResponse.json({ isFavorited: false });
      } else {
        // Add favorite
        await db.insert(favoriteDoctors).values({
          doctorId,
          patientId: session.userId,
        });
        return NextResponse.json({ isFavorited: true });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
