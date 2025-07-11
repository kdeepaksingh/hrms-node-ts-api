import nodemailer from "nodemailer";
import moment from "moment";

export const sendResetEmail = async (
  to: string,
  resetToken: string,
  name = "Deepak Singh"
) => {
  const resetLink = `${process.env.BASE_FRONTEND_URL}/reset-password/${resetToken}`;
  const year = moment().format("YYYY");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Reset Your HRMS Password</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #003366;
          color: #ffffff;
          text-align: center;
          padding: 30px 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
        }
        .reset-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color:rgb(255, 0, 136);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          background-color: #f1f1f1;
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HRMS Portal</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>You recently requested to reset your password for your HRMS account.</p>
          <p>Click the button below to reset it. This link will expire in 1 hour.</p>
          <a href="${resetLink}" class="reset-btn">Reset Password</a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p>Thanks,<br/>HRMS Team</p>
        </div>
        <div class="footer">
          &copy; ${year} HRMS Portal. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"HRMS Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your HRMS account password",
    html,
  });
};

export default sendResetEmail;
