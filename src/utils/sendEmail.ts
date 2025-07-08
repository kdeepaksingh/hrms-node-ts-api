import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, resetToken: string) => {
  const resetLink = `${process.env.BASE_FRONTEND_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetLink}" style="display:inline-block;margin:10px 0;padding:10px 20px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
  });
};



