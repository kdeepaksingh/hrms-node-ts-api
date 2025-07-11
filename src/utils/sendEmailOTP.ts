import nodemailer from "nodemailer";
import moment from "moment";

export const sendEmailOTP = async (
  to: string,
  otp: string,
  employeeName = "Deepali Singh"
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const year = moment().format("YYYY");

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Your OTP Code</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #003366;
          color: white;
          padding: 20px 30px;
          text-align: center;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 30px;
          color: #333;
        }
        .email-body p {
          font-size: 16px;
          line-height: 1.6;
        }
        .otp-box {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          background: #f0f4ff;
          color: #003366;
          padding: 15px 0;
          margin: 20px 0;
          letter-spacing: 8px;
          border-radius: 6px;
        }
        .email-footer {
          text-align: center;
          font-size: 14px;
          color: #999;
          padding: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>HRMS Portal</h1>
          <p style="margin: 5px 0 0;">Secure Verification</p>
        </div>
        <div class="email-body">
          <p>Hi ${employeeName},</p>
          <p>
            You are trying to verify your email for access to the HRMS Portal.
            Please use the OTP below to proceed. This OTP is valid for the next 10 minutes.
          </p>
          <div class="otp-box">${otp}</div>
          <p>
            If you did not request this, please ignore this email or contact HR support
            immediately.
          </p>
          <p>Thank you,<br />HRMS Team</p>
        </div>
        <div class="email-footer">
          &copy; ${year} HRMS Portal. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"HRMS OTP Verification" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for HRMS Portal",
    html,
  });
};
