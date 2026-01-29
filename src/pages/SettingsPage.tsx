import React, { useState, useEffect } from 'react';
import { Bell, Globe, Shield, Palette, Database, Calendar, Mail } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmailSettingsService } from '../services/EmailSettingsService';
import type { EmailSettings } from '../types/emailSettings';

export const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: false,
    meeting_reminders: true,
    document_updates: true,
    expense_approvals: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Europe/Stockholm',
    currency: 'SEK',
    date_format: 'DD/MM/YYYY'
  });

  const [loading, setLoading] = useState(false);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: false,
    sender_email: '',
    sender_name: 'Foundation Management System',
    default_html_template: '<p>This is a test email to verify your SMTP configuration.</p>'
  });
  const [testEmail, setTestEmail] = useState({
    to_email: '',
    subject: 'Test Email from Foundation Management System',
    html_template: '<p>This is a test email to verify your SMTP configuration.</p>'
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleEmailSettingChange = (key: keyof EmailSettings, value: string | number | boolean) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestEmailChange = (key: string, value: string) => {
    setTestEmail(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const loadEmailSettings = async () => {
    try {
      const config = await EmailSettingsService.getSMTPConfig();
      setEmailSettings({
        ...config,
        default_html_template: config.default_html_template || '<p>This is a test email to verify your SMTP configuration.</p>'
      });
      
      // Also initialize the test email template with the saved default
      setTestEmail(prev => ({
        ...prev,
        html_template: config.default_html_template || '<p>This is a test email to verify your SMTP configuration.</p>'
      }));
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  };

  const saveEmailSettings = async () => {
    setEmailLoading(true);
    try {
      await EmailSettingsService.updateSMTPConfig({
        ...emailSettings,
        default_html_template: testEmail.html_template
      });
      setTestResult({ success: true, message: 'Email settings saved successfully! You can now test the configuration.' });
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      setTestResult({ success: false, message: error instanceof Error ? error.message : 'Failed to save email settings' });
      setTimeout(() => setTestResult(null), 5000);
    } finally {
      setEmailLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.to_email) {
      setTestResult({ success: false, message: 'Please enter a recipient email address' });
      return;
    }

    setEmailLoading(true);
    setTestResult(null);
    try {
      const result = await EmailSettingsService.testEmail(
        testEmail.to_email,
        testEmail.subject,
        testEmail.html_template
      );
      setTestResult({ success: true, message: result.message });
      setTimeout(() => setTestResult(null), 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send test email';
      setTestResult({ 
        success: false, 
        message: errorMessage.includes('SMTP configuration is missing') 
          ? 'Please configure SMTP settings first before sending test emails.' 
          : errorMessage 
      });
      setTimeout(() => setTestResult(null), 5000);
    } finally {
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    loadEmailSettings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card title="Notification Preferences" subtitle="Choose how you want to be notified">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email_notifications}
                  onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-600">Receive browser notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push_notifications}
                  onChange={(e) => handleNotificationChange('push_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting Reminders</p>
                  <p className="text-xs text-gray-600">Get reminded about upcoming meetings</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.meeting_reminders}
                  onChange={(e) => handleNotificationChange('meeting_reminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Document Updates</p>
                  <p className="text-xs text-gray-600">Notifications for document status changes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.document_updates}
                  onChange={(e) => handleNotificationChange('document_updates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Expense Approvals</p>
                  <p className="text-xs text-gray-600">Notifications for expense approvals</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.expense_approvals}
                  onChange={(e) => handleNotificationChange('expense_approvals', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Application Preferences */}
        <Card title="Application Preferences" subtitle="Customize your experience">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="sv">Svenska</option>
                <option value="no">Norsk</option>
                <option value="da">Dansk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Europe/Stockholm">Stockholm (CET)</option>
                <option value="Europe/Oslo">Oslo (CET)</option>
                <option value="Europe/Copenhagen">Copenhagen (CET)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-2" />
                Default Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="SEK">Swedish Krona (SEK)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="NOK">Norwegian Krone (NOK)</option>
                <option value="DKK">Danish Krone (DKK)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Format
              </label>
              <select
                value={preferences.date_format}
                onChange={(e) => handlePreferenceChange('date_format', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card title="Email Configuration" subtitle="Configure SMTP settings for email notifications">
          <div className="space-y-6">
            {/* SMTP Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-500" />
                SMTP Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={emailSettings.smtp_host}
                    onChange={(e) => handleEmailSettingChange('smtp_host', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={emailSettings.smtp_port}
                    onChange={(e) => handleEmailSettingChange('smtp_port', parseInt(e.target.value) || 587)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                  <input
                    type="text"
                    value={emailSettings.smtp_user}
                    onChange={(e) => handleEmailSettingChange('smtp_user', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                  <input
                    type="password"
                    value={emailSettings.smtp_pass}
                    onChange={(e) => handleEmailSettingChange('smtp_pass', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your app password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                  <input
                    type="email"
                    value={emailSettings.sender_email}
                    onChange={(e) => handleEmailSettingChange('sender_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                  <input
                    type="text"
                    value={emailSettings.sender_name}
                    onChange={(e) => handleEmailSettingChange('sender_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Foundation Management System"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="smtp_secure"
                  checked={emailSettings.smtp_secure}
                  onChange={(e) => handleEmailSettingChange('smtp_secure', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smtp_secure" className="ml-2 block text-sm text-gray-900">
                  Use SSL/TLS encryption
                </label>
              </div>
            </div>

            {/* Test Email Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Email Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={testEmail.to_email}
                    onChange={(e) => handleTestEmailChange('to_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
                  <input
                    type="text"
                    value={testEmail.subject}
                    onChange={(e) => handleTestEmailChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Test Email from Foundation Management System"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HTML Template</label>
                  <textarea
                    value={testEmail.html_template}
                    onChange={(e) => handleTestEmailChange('html_template', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="<p>This is a test email...</p>"
                  />
                </div>
              </div>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button onClick={saveEmailSettings} loading={emailLoading}>
                Save Settings
              </Button>
              <Button variant="secondary" onClick={sendTestEmail} loading={emailLoading}>
                Send Test Email
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Settings */}
      <Card title="Security & Privacy" subtitle="Manage your account security">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Account Security</p>
                <p className="text-xs text-gray-600">Your account is secure</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              <Button variant="danger" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Privacy Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Visibility</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Foundation Members Only</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activity Tracking</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};