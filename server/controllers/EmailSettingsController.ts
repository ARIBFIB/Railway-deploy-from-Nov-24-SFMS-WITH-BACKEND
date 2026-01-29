import { type RequestHandler, type Request, type Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';
import { EmailService } from '../services/EmailService';
import { supabase } from '../config/database';

// Simple encoding for sensitive data (should be replaced with proper encryption in production)
const encodePassword = (text: string): string => {
  if (!text) return '';
  return Buffer.from(text).toString('base64');
};

const decodePassword = (text: string): string => {
  if (!text) return '';
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch {
    return text; // Return original if decoding fails
  }
};

interface SMTPConfig {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  smtp_secure: boolean;
  sender_email: string;
  sender_name: string;
  default_html_template?: string;
}

export class EmailSettingsController {
  /**
   * Get SMTP configuration
   */
  static getSMTPConfig = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user || !user.foundation_id) {
        throw createError('User foundation not found', 400);
      }
      
      // Fetch SMTP settings from database
      const { data, error } = await supabase
        .from('email_settings')
        .select('smtp_host, smtp_port, smtp_user, smtp_pass_encrypted, smtp_secure, sender_email, sender_name, default_html_template')
        .eq('foundation_id', user.foundation_id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          // Return empty config if no settings exist
          res.status(200).json({
            success: true,
            data: {
              smtp_host: '',
              smtp_port: 587,
              smtp_user: '',
              smtp_pass: '',
              smtp_secure: false,
              sender_email: '',
              sender_name: 'Foundation Management System',
              default_html_template: '<p>This is a test email to verify your SMTP configuration.</p>'
            }
          });
          return;
        }
        // Check if the error is due to table not existing
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          // Table doesn't exist, return empty config
          console.warn('Email settings table does not exist. Please run database migrations.', error);
          res.status(200).json({
            success: true,
            data: {
              smtp_host: '',
              smtp_port: 587,
              smtp_user: '',
              smtp_pass: '',
              smtp_secure: false,
              sender_email: '',
              sender_name: 'Foundation Management System',
              default_html_template: '<p>This is a test email to verify your SMTP configuration.</p>'
            }
          });
          return;
        }
        throw error;
      }
      
      // Return the fetched config (without exposing encoded password)
      res.status(200).json({
        success: true,
        data: {
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_user: data.smtp_user,
          smtp_pass: '', // Don't expose the password
          smtp_secure: data.smtp_secure,
          sender_email: data.sender_email,
          sender_name: data.sender_name,
          default_html_template: data.default_html_template || '<p>This is a test email to verify your SMTP configuration.</p>'
        }
      });
    } catch (error: any) {
      console.error('Error fetching SMTP config:', error);
      res.status(500).json(createError('Failed to fetch SMTP configuration'));
    }
  });

  /**
   * Update SMTP configuration
   */
  static updateSMTPConfig = asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        smtp_host,
        smtp_port,
        smtp_user,
        smtp_pass,
        smtp_secure,
        sender_email,
        sender_name,
        default_html_template
      } = req.body;

      // Validate required fields
      if (!smtp_host || !smtp_port || !smtp_user || !sender_email) {
        res.status(400).json(createError('SMTP host, port, user, and sender email are required'));
        return;
      }

      const user = (req as any).user;
      if (!user || !user.foundation_id) {
        throw createError('User foundation not found', 400);
      }
      
      // Encode the password before storing, but allow empty passwords
      const encodedPassword = smtp_pass !== undefined && smtp_pass !== null ? encodePassword(String(smtp_pass)) : '';
      
      // Attempt to upsert to the email_settings table
      const { error: upsertError } = await supabase
        .from('email_settings')
        .upsert({
          foundation_id: user.foundation_id,
          smtp_host,
          smtp_port: parseInt(smtp_port.toString()),
          smtp_user,
          smtp_pass_encrypted: encodedPassword,
          smtp_secure: Boolean(smtp_secure),
          sender_email,
          sender_name: sender_name || 'Foundation Management System',
          default_html_template: default_html_template || '<p>This is a test email to verify your SMTP configuration.</p>'
        }, { onConflict: 'foundation_id' });

      if (upsertError) {
        // Check if the error is due to table not existing
        if (upsertError.code === '42P01' || upsertError.message.includes('does not exist')) {
          // Table doesn't exist, return a more informative error
          console.error('Email settings table does not exist. Please run migrations first.', upsertError);
          res.status(500).json(createError('Email settings table does not exist. Please run database migrations first.'));
          return;
        }
        throw upsertError;
      }

      res.status(200).json({
        success: true,
        message: 'SMTP configuration updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating SMTP config:', error);
      res.status(500).json(createError('Failed to update SMTP configuration'));
    }
  });

  /**
   * Test SMTP configuration and send test email
   */
  static testEmail = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { to_email, subject, html_template } = req.body;
      
      // Get user from request
      const user = (req as any).user;
      if (!user || !user.foundation_id) {
        throw createError('User foundation not found', 400);
      }
      
      // Fetch saved SMTP settings from database
      const { data: smtpConfig, error: dbError } = await supabase
        .from('email_settings')
        .select('smtp_host, smtp_port, smtp_user, smtp_pass_encrypted, smtp_secure, sender_email, sender_name, default_html_template')
        .eq('foundation_id', user.foundation_id)
        .single();

      if (dbError) {
        if (dbError.code === '42P01' || dbError.message.includes('does not exist')) {
          // Table doesn't exist
          console.error('Email settings table does not exist. Please run database migrations first.', dbError);
          throw createError('Email settings table does not exist. Please run database migrations first.', 500);
        }
        throw createError('SMTP configuration not found. Please save your SMTP settings first.', 400);
      }
      
      if (!to_email) {
        res.status(400).json(createError('Recipient email is required'));
        return;
      }

      // Use the provided HTML template, or fall back to the saved default template, or use a default
      const effectiveHtmlTemplate = html_template || smtpConfig.default_html_template || '<p>This is a test email to verify your SMTP configuration.</p>';
      
      if (!subject) {
        res.status(400).json(createError('Subject is required'));
        return;
      }

      // Validate required SMTP settings from database
      if (!smtpConfig.smtp_host || !smtpConfig.smtp_port || !smtpConfig.smtp_user || !smtpConfig.smtp_pass_encrypted) {
        res.status(400).json(createError('SMTP configuration is incomplete. Please check your saved settings.'));
        return;
      }

      // Test the email configuration
      const testEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Email Configuration Test</h1>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hello,</p>
            <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Timestamp: ${new Date().toLocaleString()}</li>
              <li>Server: ${smtpConfig.smtp_host}</li>
              <li>Port: ${smtpConfig.smtp_port}</li>
            </ul>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p>Your custom HTML template content:</p>
            <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
              ${effectiveHtmlTemplate}
            </div>
            <p>Best regards,<br>Foundation Management System Team</p>
          </div>
          <div style="text-align: center; padding: 10px; color: #666; font-size: 12px; margin-top: 20px;">
            <p>This is an automated test email. Please do not reply.</p>
          </div>
        </div>
      `;

      // Create a temporary transporter with the saved SMTP settings
      console.log('🔧 Creating SMTP transporter with settings from database:', {
        host: smtpConfig.smtp_host,
        port: smtpConfig.smtp_port,
        secure: smtpConfig.smtp_secure,
        user: smtpConfig.smtp_user,
        pass: smtpConfig.smtp_pass_encrypted ? '***' : 'MISSING'
      });
      
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: smtpConfig.smtp_host,
        port: parseInt(smtpConfig.smtp_port.toString()),
        secure: smtpConfig.smtp_secure || false,
        auth: {
          user: smtpConfig.smtp_user,
          pass: decodePassword(smtpConfig.smtp_pass_encrypted)
        }
      });
      
      console.log('✅ SMTP transporter created successfully');

      // Send test email using the temporary transporter
      console.log('📧 Sending test email to:', to_email);
      const info = await transporter.sendMail({
        from: smtpConfig.sender_email || smtpConfig.smtp_user,
        to: to_email,
        subject: subject,
        html: testEmail
      });
      console.log('📧 Email sent successfully, response:', info.response);

      console.log('Email sent successfully:', info.response);

      res.status(200).json({
        success: true,
        message: `Test email sent successfully to ${to_email}`,
        data: {
          recipient: to_email,
          subject: subject,
          sent_at: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('❌ Error sending test email:', error);
      console.error('❌ Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        command: error?.command,
        stack: error?.stack
      });
      
      // Handle specific SMTP errors
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for common SMTP errors
        if (errorMessage.toLowerCase().includes('authentication failed')) {
          errorMessage = 'SMTP authentication failed. Please check your username and password/App Password.';
        } else if (errorMessage.toLowerCase().includes('connection timeout')) {
          errorMessage = 'Connection timeout. Please check your SMTP host and port settings.';
        } else if (errorMessage.toLowerCase().includes('invalid login')) {
          errorMessage = 'Invalid login credentials. Please verify your SMTP username and password/App Password.';
        } else if (errorMessage.toLowerCase().includes('greeting failed')) {
          errorMessage = 'Server greeting failed. Please verify your SMTP host settings.';
        }
      }
      
      res.status(500).json(createError(`Failed to send test email: ${errorMessage}`));
    }
  });
}