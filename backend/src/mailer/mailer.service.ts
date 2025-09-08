// mailer.service.ts
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : port === 465;
    // nodemailer typing under NodeNext can be noisy; calls are safe here.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;

    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"YSHAI Support" <${from}>`,
      to,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <p>مرحبًا،</p>
        <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك.</p>
        <p>اضغط على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
        <p><a href="${resetLink}" target="_blank" style="color: #006d77; font-weight: bold;">إعادة تعيين كلمة المرور</a></p>
        <p>هذا الرابط صالح لمدة <strong>ساعة واحدة فقط</strong>.</p>
        <p>إذا لم تطلب هذا، يمكنك تجاهل هذه الرسالة.</p>
        <br>
        <p>تحياتنا، فريق YSHAI</p>
      `,
      text: `مرحبًا،\nلقد طلبت إعادة تعيين كلمة المرور. اضغط على الرابط أدناه:\n${resetLink}\nالرابط صالح لمدة ساعة. إذا لم تطلب هذا، تجاهل الرسالة.`,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (err: unknown) {
      const trace = err instanceof Error ? err.stack : undefined;
      this.logger.error('Failed to send password reset email', trace);
      throw new ServiceUnavailableException('فشل إرسال البريد الإلكتروني');
    }
  }
}
