import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/token/token.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userRole: string[] = [];  
  userId: number | null = null;

  isVisible = false; 
  isAdmin = false;  
  dropdownVisible = false; // control dropdown visibility


  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    this.userRole = this.tokenService.getUserRoles(); 
    this.userId = this.tokenService.getUserId(); 
    this.isAdmin = this.userRole.includes('ADMIN');
  }

  navigateToProfile() {
    if (this.isAdmin) {
      this.router.navigate(['/profile', this.userId]);
    } else if (this.userRole.includes('USER') || this.userRole.includes('CHEF')) {
      this.router.navigate(['/notadminusers']);
    }
  }

  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isVisible = !this.isVisible;
    this.toggle.emit(this.isVisible); 
  }

  isProjectMenuOpen = false;

  toggleProjectMenu() {
  this.isProjectMenuOpen = !this.isProjectMenuOpen;
}

toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}



}