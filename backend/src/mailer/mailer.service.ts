// src/mailer/mailer.service.ts
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY is not set!');
      throw new Error('RESEND_API_KEY is required');
    }
    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const from = process.env.MAIL_FROM;
    if (!from) {
      throw new Error('MAIL_FROM is not configured');
    }

    try {
      await this.resend.emails.send({
        from,
        to,
        subject: 'Reset Your Password',
        html: `
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <div style="margin: 20px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; padding: 10px 20px; background-color: #006d77; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The YSHAI Team</p>
        `,
        text: `Hello,\n\nYou requested to reset your password. Use this link to proceed:\n${resetLink}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
      });

      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send password reset email', error instanceof Error ? error.stack : String(error));
      throw new ServiceUnavailableException('Failed to send email. Please try again later.');
    }
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const verifyLink = `${process.env.FRONTEND_URL}/auth/verify?token=${encodeURIComponent(token)}`;

    const from = process.env.MAIL_FROM;
    if (!from) {
      throw new Error('MAIL_FROM is not configured');
    }

    try {
      await this.resend.emails.send({
        from,
        to,
        subject: 'Verify Your Email Address',
        html: `
          <p>Hello,</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <div style="margin: 20px 0;">
            <a href="${verifyLink}" 
               style="display: inline-block; padding: 10px 20px; background-color: #2a9d8f; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn’t create an account, you can safely ignore this email.</p>
          <br>
          <p>Welcome aboard!<br>The YSHAI Team</p>
        `,
        text: `Hello,\n\nPlease verify your email by clicking this link:\n${verifyLink}\n\nThis link expires in 1 hour. If you didn't sign up, ignore this email.`,
      });

      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send verification email', error instanceof Error ? error.stack : String(error));
      throw new ServiceUnavailableException('Failed to send email. Please try again later.');
    }
  }
}
