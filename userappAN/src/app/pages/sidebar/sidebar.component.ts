import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isVisible = false; // Sidebar starts hidden

  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isVisible = !this.isVisible;
    this.toggle.emit(this.isVisible); // Notify parent component
  }

}
