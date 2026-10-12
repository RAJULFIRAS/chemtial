import nodemailer, { Transporter } from "nodemailer";
import { config } from "../../config/env.validation.js";
import { logger } from "../../shared/utils/logger.js";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private enabled: boolean = false;

  constructor() {
    if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_SECURE,
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });
      this.enabled = true;
      logger.info(`[EmailService] SMTP configured: ${config.SMTP_HOST}`);
    } else {
      logger.warn(
        "[EmailService] SMTP not configured — emails will be logged to console only",
      );
    }
  }

  async send(options: SendMailOptions): Promise<void> {
    const from = `"${config.SMTP_FROM_NAME}" <${config.SMTP_FROM_EMAIL}>`;

    if (!this.enabled || !this.transporter) {
      logger.warn(
        `[EmailService] Email NOT sent (SMTP disabled). To: ${options.to}, Subject: ${options.subject}`,
      );
      logger.debug(`[EmailService] Body:\n${options.text || options.html}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      logger.info(`[EmailService] Email sent to ${options.to}`);
    } catch (error) {
      logger.error({ err: error }, "[EmailService] Failed to send email");
      throw error;
    }
  }

  async sendPasswordReset(
    to: string,
    userName: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Password Chemtial</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background:#2f5143;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Chemtial</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="color:#2f5143;margin:0 0 16px 0;font-size:20px;">Reset Your Password</h2>
              <p style="color:#555;line-height:1.6;margin:0 0 16px 0;">
                Hello <strong>${userName}</strong>,
              </p>
              <p style="color:#555;line-height:1.6;margin:0 0 24px 0;">
                We received a request to reset your Chemtial account password.
                Click the button below to create a new password:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background:#2f5143;border-radius:8px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#888;font-size:13px;line-height:1.6;margin:24px 0 8px 0;">
                Or copy the following link into your browser:
              </p>
              <p style="color:#2f5143;font-size:12px;word-break:break-all;background:#f5f5f5;padding:12px;border-radius:6px;margin:0 0 24px 0;">
                ${resetUrl}
              </p>
              <p style="color:#888;font-size:13px;line-height:1.6;margin:0;">
                This link is valid for <strong>1 hour</strong>. If you did not make this request,
                ignore this email — your password will not change.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                © 2026 Chemtial LLC · D St, Boston, MA 02210, United States
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const text = `
Hello ${userName},

We received a request to reset your Chemtial account password.

Open the following link to reset your password:
${resetUrl}

The link is valid for 1 hour. If you did not make this request, ignore this email.

© 2026 Chemtial LLC
    `;

    await this.send({
      to,
      subject: "Reset Your Chemtial Account Password",
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
