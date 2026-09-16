import { NextRequest, NextResponse } from "next/server";
import { recommendSpecialist } from "@/lib/smart-search";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptoms } = body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "An array of symptoms is required" }, { status: 400 });
    }

    const result = await recommendSpecialist(symptoms);
    
    return NextResponse.json({
      ...result,
      disclaimer: "This is an AI-assisted suggestion and should not replace professional medical advice."
    });
  } catch (error) {
    console.error("Error recommending specialist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
