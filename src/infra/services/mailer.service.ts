import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EnvSchema } from '@/infra/config/env.schema';

export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(config: ConfigService<EnvSchema>) {
    this.from = config.get('SMTP_FROM') ?? 'ponto@studio.local';
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST') ?? 'localhost',
      port: Number(config.get('SMTP_PORT') ?? 1025),
      auth: config.get('SMTP_USER')
        ? {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          }
        : undefined,
    });
  }

  async send(options: MailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
