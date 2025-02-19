import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
