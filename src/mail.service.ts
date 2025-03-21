import { Injectable } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { renderFile } from 'ejs';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
}

interface MemberInvitationData {
  id: string;
  blogTitle: string;
}

interface VerificationCodeData {
  code: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter = null;
  private templatePath = join(process.cwd(), 'templates');

  constructor(private config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: parseInt(this.config.get<string>('SMTP_PORT')),
      secure: true,
      auth: {
        user: this.config.get<string>('SMTP_MAIL'),
        pass: this.config.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async renderEmailTemplate(templateName: string, data: Record<string, any>) {
    try {
      const path = join(this.templatePath, `${templateName}.ejs`);

      const htmlString = await renderFile(path, data, { async: true });

      return htmlString;
    } catch (err) {
      //TODO: Handle Errors
      throw err;
    }
  }

  private async sendMail(html: string, emailOptions: EmailOptions) {
    try {
      const mailOptions = {
        from: {
          name: 'LetterCMS',
          address: this.config.get<string>('SMTP_MAIL'),
        },
        to: emailOptions.to,
        subject: emailOptions.subject,
        html,
      };

      const data = await this.transporter.sendMail(mailOptions);

      return data;
    } catch (err) {
      console.error(err);
      //TODO: Handle Errors

      throw err;
    }
  }

  async sendMemberInvitationMail(email: string, data: MemberInvitationData) {
    const dataToSend = {
      invitationUrl: `${process.env.LETTERCMS_URL}/invitation/${data.id}`,
      blogTitle: data.blogTitle,
    };

    const renderedTemplate = await this.renderEmailTemplate(
      'invitation',
      dataToSend,
    );

    return this.sendMail(renderedTemplate, {
      to: email,
      subject: `Invitación a ${data.blogTitle} | LetterCMS`,
    });
  }

  async sendVerificationCode(email: string, data: VerificationCodeData) {
    const renderedTemplate = await this.renderEmailTemplate(
      'verification-code',
      data,
    );

    return this.sendMail(renderedTemplate, {
      to: email,
      subject: 'Verifica tu cuenta | LetterCMS',
    });
  }
}
