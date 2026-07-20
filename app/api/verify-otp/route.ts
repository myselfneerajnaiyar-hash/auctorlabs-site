import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { verificationId, otp } = await req.json();

    if (!verificationId || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP verification failed.",
        },
        { status: 400 }
      );
    }

    const url =
      `https://cpaas.messagecentral.com/verification/v3/validateOtp` +
      `?countryCode=91` +
      `&verificationId=${verificationId}` +
      `&code=${otp}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN || "",
        accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();

    if (!text.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP verification failed.",
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(text);

    if (
      data.responseCode === 200 &&
      data.data?.verificationStatus === "VERIFICATION_COMPLETED"
    ) {
      return NextResponse.json({
        success: true,
        message: "Phone verified successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          data.data?.errorMessage ||
          data.message ||
          "Invalid OTP.",
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "OTP verification failed.",
      },
      { status: 500 }
    );
  }
}