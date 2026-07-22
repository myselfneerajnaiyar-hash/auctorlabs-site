import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { email, name } = body

    const data = await resend.emails.send({
      from: "Auctor <hello@auctorlabs.in>",
      to: email,
      subject: "🎉 Your 4 Free AI VARC Mocks Are Ready",

      html: `
<div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:40px;">

  <div style="max-width:600px;margin:auto;background:white;border-radius:18px;padding:40px;">

    <h1 style="font-size:36px;margin-bottom:10px;">
      Your 4 Free AI VARC Mocks Are Ready 🚀
    </h1>

    <p style="font-size:18px;color:#444;">
      Hi ${name},
    </p>

    <p style="font-size:18px;line-height:1.7;color:#444;">
      Thank you for registering for Auctor's AI Powered CAT VARC Test Series.
    </p>

    <p style="font-size:18px;line-height:1.7;color:#444;">
      Your free access includes:
    </p>

    <div style="margin-top:30px;">

      <div style="margin-bottom:18px;">
        ✅ <strong>4 Full-Length CAT VARC Mocks</strong>
      </div>

      <div style="margin-bottom:18px;">
        🧠 <strong>AI Mentor Verdict</strong>
      </div>

      <div style="margin-bottom:18px;">
        📊 <strong>Detailed Performance Analytics</strong>
      </div>

      <div style="margin-bottom:18px;">
        🎯 <strong>Cognitive Diagnosis & Trap Analysis</strong>
      </div>

    </div>

    <div style="margin-top:40px;text-align:center;">

      <a
        href="https://rc.auctorlabs.in/login?next=cat&free=1"
        style="
          background:#f97316;
          color:white;
          padding:16px 30px;
          border-radius:12px;
          text-decoration:none;
          font-weight:bold;
          display:inline-block;
        "
      >
        Start My Free Mocks →
      </a>

    </div>

    <div
      style="
        margin-top:35px;
        background:#fff7ed;
        border:1px solid #fdba74;
        border-radius:12px;
        padding:20px;
      "
    >

      <strong>💻 Best Experience</strong>

      <p style="margin-top:10px;color:#555;line-height:1.7;">
        Please open the above link on a <strong>laptop or desktop</strong>
        for the best CAT exam experience.
      </p>

    </div>

    <p style="margin-top:40px;color:#666;line-height:1.7;">
      Once you've experienced the free mocks, you can unlock the complete test series containing:
    </p>

    <ul style="color:#666;line-height:1.9;">
      <li>10 AI VARC Mock Tests</li>
      <li>24 Official CAT Previous Year Papers</li>
      <li>Reader DNA Report</li>
      <li>Mentor Verdict</li>
      <li>Trap Analysis</li>
      <li>Detailed Performance Dashboard</li>
    </ul>

    <p style="margin-top:35px;color:#666;">
      Happy Learning! 🚀
    </p>

    <p style="color:#666;">
      Team Auctor
    </p>

  </div>

</div>
`
    })

    return Response.json(data)

 } catch (error) {

  console.error(error)

  return Response.json({
    error: error instanceof Error ? error.message : "Unknown error",
  })

}

}