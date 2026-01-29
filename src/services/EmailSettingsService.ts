import type { EmailSettings } from '../types/emailSettings';
import { apiFetch } from '../utils/api';

export class EmailSettingsService {
  static async getSMTPConfig(): Promise<EmailSettings> {
    const response = await apiFetch('/api/email-settings/smtp', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SMTP configuration');
    }

    const data = await response.json();
    return data.data;
  }

  static async updateSMTPConfig(config: EmailSettings): Promise<void> {
    const response = await apiFetch('/api/email-settings/smtp', {
      method: 'POST',
      json: config
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update SMTP configuration');
    }
  }

  static async testEmail(toEmail: string, subject: string, htmlTemplate: string, smtpConfig?: EmailSettings): Promise<{ message: string; data: any }> {
    const response = await apiFetch('/api/email-settings/test', {
      method: 'POST',
      json: {
        to_email: toEmail,
        subject: subject,
        html_template: htmlTemplate,
        ...smtpConfig
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send test email');
    }

    return data;
  }
}