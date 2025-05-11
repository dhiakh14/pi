import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HumanResources } from 'src/app/ServiceMaram/models';
import { HumanResourcesRestControllerService } from 'src/app/ServiceMaram/services';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-hr',
  templateUrl: './add-hr.component.html',
  styleUrls: ['./add-hr.component.css']
})
export class AddHRComponent {
  // Initialize a new HumanResources object with proper types
  humanResource: HumanResources = {
    idHR: 0,
    name: '',
    lastName: '',
    email: '',
    phoneNumber: null as any, // Will be converted to number on submit
    availability: true,
    job_Role: 'MASON'
  };

  constructor(
    private hrService: HumanResourcesRestControllerService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  // Handle form submission
  addHR() {
    // Validate required fields
    if (!this.humanResource.name?.trim()) {
      alert('Name is required!');
      return;
    }
    if (!this.humanResource.lastName?.trim()) {
      alert('Last Name is required!');
      return;
    }
    if (!this.humanResource.email?.trim()) {
      alert('Email is required!');
      return;
    }
    if (!this.humanResource.phoneNumber) {
      alert('Phone Number is required!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.humanResource.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    // Convert phoneNumber to number if it's a string
    if (typeof this.humanResource.phoneNumber === 'string') {
      this.humanResource.phoneNumber = parseInt(this.humanResource.phoneNumber, 10);
    }

    // Create a copy of the object to send
    const hrToAdd: HumanResources = {
      ...this.humanResource,
      availability: Boolean(this.humanResource.availability)
    };

    console.log('Sending HR data:', hrToAdd);

    // Call the service to add the HumanResources entity
    this.hrService.addHr({ body: hrToAdd }).subscribe({
      next: (response) => {
        console.log('Human Resource added successfully:', response);
        this.sendNotifications();
      },
      error: (error) => {
        console.error('Error adding Human Resource:', error);
        
        // Check if the error is due to XML response instead of JSON
        if (error.status === 200) {
          // This is actually a success case, but with XML response
          console.log('Human Resource added successfully (XML response)');
          this.sendNotifications();
        } else {
          // This is a real error
          let errorMessage = 'Failed to add Human Resource.';
          if (error.error?.message) {
            errorMessage += ' ' + error.error.message;
          }
          alert(errorMessage);
        }
      }
    });
  }

  // Helper method to send notifications
  private sendNotifications() {
    const subject = 'Welcome to Our HR System';
    const message = `Dear ${this.humanResource.name} ${this.humanResource.lastName},\n\n` +
      `Welcome to our HR system! Your account has been successfully created.\n\n` +
      `Your details:\n` +
      `- Name: ${this.humanResource.name} ${this.humanResource.lastName}\n` +
      `- Email: ${this.humanResource.email}\n` +
      `- Phone: ${this.humanResource.phoneNumber}\n` +
      `- Job Role: ${this.humanResource.job_Role}\n\n` +
      `We look forward to working with you!\n\n` +
      `Best regards,\n` +
      `HR Team`;
    
    console.log('Sending notifications to:', this.humanResource.email);
    
    this.notificationService.sendNotifications(
      this.humanResource.email,
      this.humanResource.phoneNumber.toString(),
      subject,
      message
    ).then(() => {
      console.log('Notifications sent successfully');
      alert('Human Resource added successfully! Email and SMS notifications have been sent.');
      this.router.navigate(['/listHr']);
    }).catch(error => {
      console.error('Error sending notifications:', error);
      
      // Check if this is a Twilio trial account limitation
      const errorMessage = error?.error || '';
      if (typeof errorMessage === 'string' && errorMessage.includes('unverified')) {
        alert('Human Resource added successfully! Email notification sent, but SMS could not be sent due to Twilio trial account limitations. Please verify the phone number in your Twilio account or upgrade to a paid account.');
      } else {
        alert('Human Resource added successfully, but there was an error sending notifications.');
      }
      
      this.router.navigate(['/listHr']);
    });
  }

  // Cancel and return to list
  cancel() {
    this.router.navigate(['/listHr']);
  }
}