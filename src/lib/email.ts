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
    from: `"GSB Connect" <${process.env.EMAIL_USER}>`,
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
