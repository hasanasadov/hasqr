import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, fullName, message, selectedBudget, selectedProjects } = body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    // Admin email
    await transporter.sendMail({
      from: `"Your Website Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Inquiry Received – asadov.site`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 30px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
            <h2 style="color: #2563eb; font-weight: 700; margin-bottom: 20px; font-size: 24px; text-align: center;">
              📝 Yeni əlaqə formu müraciəti
            </h2>
            <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">
              Sizə yeni mesaj gəlib. Ətraflı məlumat aşağıdadır:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px; color: #4b5563;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; width: 130px;">Ad, Soyad:</td>
                  <td style="padding: 8px 0;">${fullName}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Büdcə:</td>
                  <td style="padding: 8px 0;">${selectedBudget}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 8px 0; font-weight: 600;">Seçilmiş layihələr:</td>
                  <td style="padding: 8px 0;">${selectedProjects.join(
                    ", "
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mesaj:</td>
                  <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://asadov.site/admin" target="_blank" 
                style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Admin Panelə keç
              </a>
            </div>

            <p style="text-align: center; color: #9ca3af; font-size: 13px; margin-top: 40px;">
              © ${new Date().getFullYear()} Hasanali Asadov · <a href="https://asadov.site" style="color: #2563eb; text-decoration: none;">asadov.site</a>
            </p>
          </div>
        </div>
      `,
    });

    // User email
    await transporter.sendMail({
      from: `"Hasanali Asadov" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We've received your message — Hasanali Asadov (asadov.site)`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 30px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
          <h2 style="color: #2563eb; font-weight: 700; margin-bottom: 20px; font-size: 24px; text-align: center;">
            Salam, ${fullName}!
          </h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">
            Mesajınızı aldıq, tezliklə sizinlə əlaqə saxlanılacaq. <br><br>
            <strong>Əlaqə məlumatlarınız:</strong>
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px; color: #4b5563;">
            <tbody>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 130px;">Ad, Soyad:</td>
                <td style="padding: 8px 0;">${fullName}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Büdcə:</td>
                <td style="padding: 8px 0;">${selectedBudget}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 8px 0; font-weight: 600;">Seçilmiş layihələr:</td>
                <td style="padding: 8px 0;">${selectedProjects.join(", ")}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mesajınız:</td>
                <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://asadov.site/contact" target="_blank" 
              style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Saytımıza baxın
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 40px; text-align: center;">
            Tezliklə sizinlə əlaqə saxlanılacaq.<br>
            — Hasanali Asadov
          </p>
        </div>
      </div>
    `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
