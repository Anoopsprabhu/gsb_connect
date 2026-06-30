import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendCofounderInvite(to: string, startupName: string, startupId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/register/startup/edit/${startupId}`;
  
  const mailOptions = {
    from: `"GSB Startup Angels" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Invitation to collaborate on ${startupName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 24px;">
        <h2 style="color: #ea580c;">Collaborate on GSB Connect</h2>
        <p>Hello,</p>
        <p>You have been invited to collaborate as a co-founder for <strong>${startupName}</strong> on GSB Connect.</p>
        <p>You can view and edit the application by clicking the button below:</p>
        <a href="${inviteLink}" style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 10px;">Accept Invitation</a>
        <p style="margin-top: 20px; color: #64748b; font-size: 14px;">If you weren't expecting this invitation, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">GSB Connect - Cultural Heritage meets Modern Innovation</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendWebinarConfirmation(
  to: string,
  registrantName: string,
  webinar: {
    title: string;
    date: Date;
    startTime?: string | null;
    endTime?: string | null;
    speakers?: string | null;
    platform: string;
    webinarLink?: string | null;
  }
) {
  const formattedDate = new Date(webinar.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = webinar.startTime
    ? `${webinar.startTime}${webinar.endTime ? ` – ${webinar.endTime}` : ""}`
    : "Check details closer to the event";

  const speakersList = webinar.speakers
    ? webinar.speakers
        .split(",")
        .map((s: string) => `<li style="padding: 4px 0; color: #334155;">${s.trim()}</li>`)
        .join("")
    : "";

  const mailOptions = {
    from: `"GSB Startup Angels" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎓 Registration Confirmed: "${webinar.title}"`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #e8b923 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0; font-weight: 700;">Registration Confirmed! 🎉</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">You're all set for the webinar</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Hi <strong>${registrantName}</strong>,
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Thank you for registering for <strong style="color: #b8860b;">${webinar.title}</strong>. We're excited to have you join us!
          </p>

          <!-- Webinar Details Card -->
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
            <h3 style="color: #92400e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; font-weight: 700;">📋 Webinar Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 100px; vertical-align: top;">Title</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${webinar.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Date</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">📅 ${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Time</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">🕐 ${timeStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Platform</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">💻 ${webinar.platform}</td>
              </tr>
            </table>
          </div>

          ${speakersList ? `
          <!-- Speakers -->
          <div style="margin: 0 0 24px 0;">
            <h3 style="color: #334155; font-size: 14px; font-weight: 700; margin: 0 0 12px 0;">🎤 Speakers</h3>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
              ${speakersList}
            </ul>
          </div>
          ` : ""}

          <!-- 48-hour notice -->
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 20px; margin: 0 0 24px 0; text-align: center;">
            <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 600;">
              ⏰ The Webinar URL will be sent 48 hours before the Webinar day.
            </p>
          </div>

          <!-- Footer -->
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            GSB Startup Angels — Funding Dreams. Building Founders.<br/>
            If you have questions, reply to this email or <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contact" style="color: #b8860b;">contact us</a>.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
