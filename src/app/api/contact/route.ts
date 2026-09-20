import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface ContactRequestBody {
  fullName?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  message?: unknown;
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

export async function POST(request: Request) {
  try {
    // 1. Get request body
    const body = (await request.json()) as ContactRequestBody;

    // 2. Validate / sanitize input types
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const whatsapp =
      typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // 3. Required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    // 4. Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    // 5. Environment variables
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPassword = process.env.MAIL_PASSWORD?.trim();
    const contactEmail = process.env.CONTACT_EMAIL?.trim();
    const smtpPort = Number(process.env.SMTP_PORT ?? "465");

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword ||
      !contactEmail ||
      !Number.isFinite(smtpPort)
    ) {
      console.error("Missing or invalid SMTP environment variables");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    // 6. Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      // 465 → SSL
      // 587 → STARTTLS
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },

      connectionTimeout: 30000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    // 7. Check SMTP connection
    await transporter.verify();

    // 8. Escape user data before inserting into HTML
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);

    const safeWhatsapp = escapeHtml(whatsapp || "Not provided");

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    // 9. Send email
    const info = await transporter.sendMail({
      from: `"Website Contact" <${smtpUser}>`,

      to: contactEmail,

      // Important:
      // clicking Reply will reply directly to the customer
      replyTo: email,

      subject: `New travel request from ${fullName}`,

      text: `New Travel Request
             Name: ${fullName}
             Email: ${email}
             WhatsApp: ${whatsapp || "Not provided"}
             Message:${message}`.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          "
        >
          <h2>New Travel Request</h2>

          <p>
            <strong>Name:</strong><br />
            ${safeFullName}
          </p>

          <p>
            <strong>Email:</strong><br />
            ${safeEmail}
          </p>

          <p>
            <strong>WhatsApp:</strong><br />
            ${safeWhatsapp}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <p>
            ${safeMessage}
          </p>
        </div>
      `,
    });

    // 10. Success response
    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error(
      "Contact SMTP error:",
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "We couldn't send your message. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}
