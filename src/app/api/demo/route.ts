import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add contact to Brevo via API
    try {
      const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_SMTP_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: { DEMO_REQUESTED: true },
          listIds: [],
          updateEnabled: true,
        }),
      });
      console.log("Brevo contact response:", contactRes.status, await contactRes.text());
    } catch (err) {
      console.error("Brevo contact creation failed:", err);
    }

    // Send notification to team
    console.log("Sending notification email to info@docunarrio.com...");
    const notifResult = await transporter.sendMail({
      from: '"Docunarrio" <info@docunarrio.com>',
      to: "info@docunarrio.com",
      subject: `Demo Request from ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #700911;">New Demo Request</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    });
    console.log("Notification sent:", notifResult.messageId);

    // Send confirmation to requester
    console.log("Sending confirmation email to", email);
    const confirmResult = await transporter.sendMail({
      from: '"Docunarrio" <info@docunarrio.com>',
      to: email,
      subject: "We received your demo request",
      html: `
        <div style="font-family: sans-serif; max-width: 520px; color: #1e1e1e;">
          <h2 style="color: #700911;">Thanks for your interest in Docunarrio</h2>
          <p>We've received your demo request and will get back to you within 24 hours.</p>
          <p style="color: #7b776f; font-size: 14px; margin-top: 24px;">
            — The Docunarrio Team
          </p>
        </div>
      `,
    });
    console.log("Confirmation sent:", confirmResult.messageId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
