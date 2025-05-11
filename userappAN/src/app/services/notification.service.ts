import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // EmailJS configuration
  private readonly EMAILJS_USER_ID = 'FAMPrlSrh2YY6Mf9F';
  private readonly EMAILJS_TEMPLATE_ID = 'template_b7mu6hr';
  private readonly EMAILJS_SERVICE_ID = 'service_s8368ek';

  // Twilio configuration
  private readonly TWILIO_ACCOUNT_SID = 'AC4d695ff327a958d61a077acc9aa86b8c';
  private readonly TWILIO_AUTH_TOKEN = '8027ec5ad739cd18748fd8ec53d158fd';
  private readonly TWILIO_PHONE_NUMBER = '+19033451691';

  constructor(private http: HttpClient) {
    // Initialize EmailJS
    try {
      emailjs.init(this.EMAILJS_USER_ID);
      console.log('EmailJS initialized with User ID:', this.EMAILJS_USER_ID);
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  }

  /**
   * Send an email notification
   * @param toEmail Recipient email address
   * @param subject Email subject
   * @param message Email message content
   */
  async sendEmail(to: string, subject: string, message: string): Promise<void> {
    console.log('Attempting to send email to:', to);

    try {
      // Check if EmailJS is properly configured
      if (!this.EMAILJS_USER_ID || !this.EMAILJS_TEMPLATE_ID || !this.EMAILJS_SERVICE_ID) {
        console.warn('EmailJS not properly configured, falling back to mock email sending');
        console.log('Current EmailJS configuration:', {
          userId: this.EMAILJS_USER_ID,
          templateId: this.EMAILJS_TEMPLATE_ID,
          serviceId: this.EMAILJS_SERVICE_ID
        });
        return this.sendMockEmail(to, subject, message);
      }

      // Prepare template parameters
      const templateParams = {
        to_name: to.split('@')[0], // Extract name from email
        to_email: to,
        from_name: 'HR System',
        subject: subject,
        message: message,
        reply_to: to,
        email: to // Adding this as a fallback parameter name
      };

      console.log('Sending email with parameters:', templateParams);

      // Send email using EmailJS
      const response = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_USER_ID
      );

      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
      // Fall back to mock email sending if EmailJS fails
      return this.sendMockEmail(to, subject, message);
    }
  }

  private async sendMockEmail(to: string, subject: string, message: string): Promise<void> {
    console.log('Sending mock email:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Send an SMS notification using Twilio
   * @param phoneNumber Recipient phone number
   * @param message SMS message content
   */
  async sendSMS(phoneNumber: string, message: string): Promise<any> {
    try {
      // Check if Twilio is properly configured
      if (!this.TWILIO_ACCOUNT_SID || !this.TWILIO_AUTH_TOKEN || !this.TWILIO_PHONE_NUMBER) {
        console.warn('Twilio not properly configured, falling back to mock SMS sending');
        return this.sendMockSMS(phoneNumber, message);
      }

      // Format phone number to ensure it's a string and remove any non-digit characters
      const cleanedNumber = String(phoneNumber).replace(/\D/g, '');

      // Send SMS using Twilio API
      const response = await this.http.post(`${environment.apiUrl}/api/sms/send`, {
        to: cleanedNumber,
        message: message,
        from: this.TWILIO_PHONE_NUMBER
      }).toPromise();

      console.log('SMS sent successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Error sending SMS:', error);

      // Check if this is a trial account limitation
      const errorMessage = error.error || '';
      if (typeof errorMessage === 'string' && errorMessage.includes('unverified')) {
        console.warn('Twilio trial account limitation: Cannot send SMS to unverified number');
        // Return a mock success response for unverified numbers in trial mode
        return this.sendMockSMS(phoneNumber, message);
      }

      // Fall back to mock SMS sending if Twilio fails
      return this.sendMockSMS(phoneNumber, message);
    }
  }

  private async sendMockSMS(phoneNumber: string, message: string): Promise<any> {
    console.log(`SMS sent to ${phoneNumber}: ${message}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, mock: true };
  }

  /**
   * Format phone number to E.164 format
   * @param phoneNumber Phone number to format
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add country code if not present (assuming Tunisia +216)
    if (!cleaned.startsWith('216')) {
      return `+216${cleaned}`;
    }

    return `+${cleaned}`;
  }

  /**
   * Send both email and SMS notifications
   * @param email Recipient email address
   * @param phoneNumber Recipient phone number
   * @param subject Email subject
   * @param message Message content for both email and SMS
   */
  async sendNotifications(email: string, phoneNumber: string, subject: string, message: string): Promise<any[]> {
    try {
      const emailPromise = this.sendEmail(email, subject, message);
      const smsPromise = this.sendSMS(phoneNumber, message);

      return await Promise.all([emailPromise, smsPromise]);
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }
}
