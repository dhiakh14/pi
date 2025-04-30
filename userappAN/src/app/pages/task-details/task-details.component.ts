import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskControllerService } from 'src/app/services1/services';
import { Task } from 'src/app/services1/models';
import jsPDF from 'jspdf';
import { GetTaskRecommendations$Params } from 'src/app/services1/fn/task-controller/get-task-recommendations';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;
  taskId: number | undefined;
  isDarkMode: boolean = false;
  recommendations: string | undefined;
  showRecommendations: boolean = false; 
  isLoadingRecommendations: boolean = false; 


  constructor(
    private route: ActivatedRoute, 
    private taskService: TaskControllerService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['idTask'];  
      this.loadTaskDetails();
    });
  }

  loadTaskDetails(): void {
    if (this.taskId) {
      const params = { id: this.taskId };  
      this.taskService.getTaskById(params).subscribe(
        (response) => {
          if (response) {
            this.task = response;
          } else {
            console.error('Task not found.');
          }
        },
        (error) => {
          console.error('Error fetching task details:', error);
        }
      );
    }
  }

  fetchRecommendations(): void {
    if (this.taskId && !this.isLoadingRecommendations) {
      this.isLoadingRecommendations = true;
      
      const params: GetTaskRecommendations$Params = {
        taskId: this.taskId
      };
      
      this.taskService.getTaskRecommendations(params).subscribe({
        next: (response: string) => {
          this.recommendations = response;
          this.showRecommendations = true;
          this.isLoadingRecommendations = false;
        },
        error: (error) => {
          console.error('Error fetching recommendations:', error);
          this.isLoadingRecommendations = false;
        }
      });
    }
  }

  toggleRecommendations(): void {
    if (!this.showRecommendations && !this.recommendations) {
      this.fetchRecommendations();
    } else {
      this.showRecommendations = !this.showRecommendations;
    }
  }

  setActualEndDate(): void {
    if (this.task && !this.task.actual_end_date) {  
      const currentDate = new Date().toISOString();  
      this.task.actual_end_date = currentDate;  

      if (this.task.status !== 'COMPLETED') {
        this.task.status = 'COMPLETED';
      }

      if (this.task.idTask !== undefined) {
        const updateParams = {
          idTask: this.task.idTask,
          body: this.task
        };

        this.taskService.updateTask(updateParams).subscribe(
          (response) => {
            console.log('Task updated successfully', response);
          },
          (error) => {
            console.error('Error updating task', error);
          }
        );
      } else {
        console.error('Task ID is undefined, cannot update task');
      }
    } else {
      console.log('Actual End Date is already set or Task is completed');
    }
  }

  getStatusClass(): string {
    const plannedDate = this.task?.planned_end_date ? new Date(this.task.planned_end_date) : null;
    const actualDate = this.task?.actual_end_date ? new Date(this.task.actual_end_date) : null;

    if (!actualDate) {
      return ''; 
    }

    if (plannedDate && actualDate > plannedDate) {
      return 'late'; 
    } else if (plannedDate && actualDate < plannedDate) {
      return 'early'; 
    } else {
      return 'on-time'; 
    }
  }

  getStatusMessage(): string {
    const plannedDate = this.task?.planned_end_date ? new Date(this.task.planned_end_date) : null;
    const actualDate = this.task?.actual_end_date ? new Date(this.task.actual_end_date) : null;

    if (!actualDate) {
      return '';
    }

    if (plannedDate && actualDate > plannedDate) {
      return 'Late';
    } else if (plannedDate && actualDate < plannedDate) {
      return 'Early';
    } else {
      return 'In Date';
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  exportToPDF(): void {
    if (!this.task) {
      console.error('No task available to export.');
      return;
    }
  
    const doc = new jsPDF();
    const marginLeft = 10;
    let yPosition = 10;
  
    doc.setFontSize(18);
    doc.text('Task Details Report', marginLeft, yPosition);
    yPosition += 10;
  
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, marginLeft, yPosition);
    yPosition += 10;
    doc.setTextColor(0);
  
    doc.setFontSize(12);
    const introText = `This document provides detailed information regarding the task, including its name, description, start date, and status. 
    The goal of this report is to offer a clear and structured overview of the task's progress and completion details.`;
    const introLines = doc.splitTextToSize(introText, 180);
    doc.text(introLines, marginLeft, yPosition);
    yPosition += introLines.length * 5 + 5;
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 150);
    doc.text('Task Overview', marginLeft, yPosition);
    yPosition += 8;
    doc.setTextColor(0);
  
    doc.setFontSize(12);
    const taskDetails = [
      `Task Name: ${this.task.name}`,
      `Description: ${this.task.description ? this.task.description : 'No description provided'}`,
      `Start Date: ${this.task.startDate ? new Date(this.task.startDate).toLocaleDateString() : 'Not Available'}`,
      `Planned End Date: ${this.task.planned_end_date ? new Date(this.task.planned_end_date).toLocaleDateString() : 'Not Available'}`,
      `Status: ${this.task.status}`,
      `Actual End Date: ${this.task.actual_end_date ? new Date(this.task.actual_end_date).toLocaleDateString() : 'Not Set'}`
    ];
    doc.text(doc.splitTextToSize(taskDetails.join('\n'), 180), marginLeft, yPosition);
    yPosition += taskDetails.length * 8 + 5;
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 150);
    doc.text('Task Description', marginLeft, yPosition);
    yPosition += 8;
    doc.setTextColor(0);
  
    doc.setFontSize(12);
    const descriptionText = this.task.description
      ? this.task.description
      : "No additional description was provided for this task.";
    const descriptionLines = doc.splitTextToSize(descriptionText, 180);
    doc.text(descriptionLines, marginLeft, yPosition);
    yPosition += descriptionLines.length * 5 + 5;
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 150);
    doc.text('Status Analysis', marginLeft, yPosition);
    yPosition += 8;
    doc.setTextColor(0);
  
    doc.setFontSize(12);
    let statusMessage = "";
    if (this.task.status === 'COMPLETED') {
      statusMessage = `This task has been successfully completed. The actual end date was recorded as ${new Date(this.task.actual_end_date!).toLocaleDateString()}. 
      The team has successfully met the objectives outlined for this task.`;
    } else {
      statusMessage = `As of now, this task remains in progress. Please refer to the planned end date (${new Date(this.task.planned_end_date!).toLocaleDateString()}) 
      and ensure that all necessary actions are taken to complete it in a timely manner.`;
    }
    const statusLines = doc.splitTextToSize(statusMessage, 180);
    doc.text(statusLines, marginLeft, yPosition);
    yPosition += statusLines.length * 5 + 5;
  
    if (this.task.actual_end_date) {
      doc.setTextColor(0, 100, 0);
      doc.setFontSize(14);
      doc.text('✅ Task Completion Confirmation', marginLeft, yPosition);
      yPosition += 8;
      doc.setTextColor(0);
  
      doc.setFontSize(12);
      const completionText = `This document confirms that the task has been marked as completed. The completion date is officially recorded as ${new Date(this.task.actual_end_date).toLocaleDateString()}. 
      If there are any discrepancies, please verify with the project manager.`;
      const completionLines = doc.splitTextToSize(completionText, 180);
      doc.text(completionLines, marginLeft, yPosition);
      yPosition += completionLines.length * 5 + 5;
    }
  
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generated by Task Management System', marginLeft, 290);
    
    doc.save(`task-details-${this.task.idTask}.pdf`);
  }
  
  
  
}