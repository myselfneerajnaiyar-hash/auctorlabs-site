import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    const url =
      `https://cpaas.messagecentral.com/verification/v3/send` +
      `?countryCode=91` +
      `&flowType=SMS` +
      `&mobileNumber=${phone}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN || "",
        accept: "application/json",
      },
    });

    const text = await response.text();

    if (!text.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to send OTP.",
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP.",
      },
      { status: 500 }
    );
  }
}