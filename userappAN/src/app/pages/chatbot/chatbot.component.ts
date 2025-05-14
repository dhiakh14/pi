import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  userInput: string = '';
  chatbotResponse: string = '';
  chatHistory: string[] = [];
  currentStep: number = 0;
  userResponses: string[] = [];  
  chatStarted: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  startChat() {
    this.chatHistory = [];
    this.chatStarted = true;
    this.currentStep = 0;
    this.userResponses = [];
    this.chatHistory.push("Bot: Hello! Let's start by gathering some information.");
    this.askQuestion();
  }

  askQuestion() {
    if (this.currentStep === 12) {
      this.submitData();
    } else {
      const questions = [
        "How would you rate the quality of your work on a scale of 1 to 5? (1 being poor, 5 being excellent)",
        "Is there anything about your deliverable that you are uncertain about? (Answer Yes or No)",
        "Have any of your previous deliverables been rejected?  (yes/no)",
        "Did your deliverable undergo a peer review process? (Rate from 1 to 5, where 1 means 'Not reviewed' and 5 means 'Thoroughly reviewed')",
        "How satisfied are you with the timing of your submission? (Rate from 1 to 5, where 1 is 'Very dissatisfied' and 5 is 'Very satisfied')",
        "How many times did you revise this deliverable before submitting it? (Enter a number)",
        "How would you rate the level of effort you put into this deliverable? (Rate from 1 to 5, where 1 means 'Very little effort' and 5 means 'A lot of effort')",
        "Did this deliverable depend on any external factors or other resources? (yes/no)",
        "Were the project requirements clear to you from the beginning?  (yes/no)",
        "How many of your previous deliverables were successfully approved? (Enter a number)",
        "Did you receive any feedback from your teammates before submitting this deliverable? (yes/no)",
        "How would you rate the quality of the documentation for this deliverable? (Rate from 1 to 5, where 1 means 'Very poor' and 5 means 'Excellent')"
      ];
      this.chatHistory.push("Bot: " + questions[this.currentStep]);
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.chatHistory.push(`You: ${this.userInput}`);
      this.userResponses.push(this.userInput); // Save input
      this.userInput = '';
      this.currentStep++;
      this.askQuestion();
    }
  }

  submitData() {
    const fieldNames = [
      'self_rating',
      'unsure',
      'past_rejection',
      'peer_reviewed',
      'timing',
      'revision_count',
      'effort_level',
      'external_dependencies',
      'requirements_clear',
      'prev_approval_count',
      'team_feedback_received',
      'documentation_quality'
    ];

    // Convert yes/no to 1/0 and ensure numeric inputs are numbers
    const mappedData: { [key: string]: number } = {};
    this.userResponses.forEach((value, index) => {
      const val = value.toLowerCase();
      if (val === 'yes') mappedData[fieldNames[index]] = 1;
      else if (val === 'no') mappedData[fieldNames[index]] = 0;
      else mappedData[fieldNames[index]] = Number(value);
    });

    this.http.post('http://127.0.0.1:5001/predictApprovalEmira', mappedData)
      .subscribe({
        next: (response: any) => {
          this.chatHistory.push(`Bot: Based on your responses, the prediction is: ${response.prediction}`);
          this.chatStarted = false;
          this.chatHistory.push("Bot: The chat has ended. Thank you for the information! bara orkod taw");
        },
        error: (err) => {
          console.error('HTTP error:', err);
          this.chatHistory.push("Bot: An error occurred while sending your responses. Please try again.");
        }
      });
  }

}
