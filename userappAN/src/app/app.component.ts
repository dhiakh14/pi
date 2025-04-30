import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'userappAN';
  isSidebarVisible = false;


  toggleSidebar(isVisible: boolean) {
    this.isSidebarVisible = isVisible;
  }

 
}