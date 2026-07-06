import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      institute_name,
      phone,
      email,
      exams,
      student_count,
      
    } = body;

    // Validate required fields
    if (!name || !institute_name || !phone || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("institute_leads")
      .insert({
        name,
        institute_name,
        phone,
        email,
        exams,
        student_count,
    
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: data,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}