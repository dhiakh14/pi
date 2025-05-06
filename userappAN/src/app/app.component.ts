import { Component, EventEmitter, Output } from '@angular/core';
import { LivrableAlertService } from './servicesEmira/livrable-alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'userappAN';
  isSidebarVisible = false;
  dropdownVisible = false; 

  constructor(private alertService: LivrableAlertService) {}
  ngOnInit(): void {
    this.alertService.fetchAndShowAlerts();
    /*
    // Poll every 5 minutes
    setInterval(() => {
      this.alertService.fetchAndShowAlerts();
    }, 5 * 60 * 1000);*/
  }






  toggleSidebar(isVisible: boolean) {
    this.isSidebarVisible = isVisible;
  }

 
}