/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEmailService } from '@modules/communication/services/email/IEmailService';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendExampleEmail() {
    return true;
  }

  async sendExampleEmail_2() {
    return true;
  }

  async sendResetPasswordLinkEmail(args: {
    resetLink: string;
    email: string;
  }): Promise<boolean> {
    return true;
  }

  async sendPasswordResetSuccessEmail(args: {
    firstName: string;
    email: string;
  }): Promise<boolean> {
    return true;
  }
}
