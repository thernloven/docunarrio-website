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
    const { name, email, message } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const sanitizedName = name.trim();
    const sanitizedMessage = message.trim();

    // Send notification to team
    await transporter.sendMail({
      from: '"Docunarrio" <info@docunarrio.com>',
      to: "info@docunarrio.com",
      subject: `Contact Form: ${sanitizedName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #700911;">New Contact Message</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <hr style="border: none; border-top: 1px solid #e4e2dd; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
        </div>
      `,
    });

    // Send confirmation to sender
    await transporter.sendMail({
      from: '"Docunarrio" <info@docunarrio.com>',
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: sans-serif; max-width: 520px; color: #1e1e1e;">
          <h2 style="color: #700911;">Thanks for reaching out, ${sanitizedName}</h2>
          <p>We've received your message and will get back to you shortly.</p>
          <p style="color: #7b776f; font-size: 14px; margin-top: 24px;">
            — The Docunarrio Team
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email send failed:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
