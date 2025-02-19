import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/models';
import { UserControllerService } from 'src/app/services/services';
import { TokenService } from 'src/app/token/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fullName: string = '';
  userRole: string = '';
  dateOfBirth: string = ''; // Store as string for proper display
  users: User[] = [];  
  userId!: number; 

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserControllerService
  ) {}

  ngOnInit(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.fullName = decodedToken.fullName;
      this.userRole = decodedToken.roles[0]; 
      this.dateOfBirth = decodedToken.dateOfBirth; 
      this.userId = decodedToken.idUser;  

    }
  }

  

  getRoleNames(user: User): string {
    return user.roles ? user.roles.map(role => role.name).join(', ') : 'No role assigned';
  }
  
  

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
