import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleControllerService, UserControllerService } from 'src/app/services/services';
import { TokenService } from 'src/app/token/token.service';
import { User } from 'src/app/services/models';
import { Role } from 'src/app/services/models/role';

@Component({
  selector: 'app-affecter-role',
  templateUrl: './affecter-role.component.html',
  styleUrls: ['./affecter-role.component.css']
})
export class AffecterRoleComponent implements OnInit {

  fullName: string = '';
  userRole: string = '';
  dateOfBirth: string = ''; 
  users: User[] = [];  
  userId!: number;
  roles: Role[] = [];
  selectedRole: Role | undefined; 
  flippedState: { [userId: number]: boolean } = {};
  showRoleSelection: { [userId: number]: boolean } = {}; // Store visibility for each user

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserControllerService,
    private roleService: RoleControllerService 
  ) {}

  ngOnInit(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.fullName = decodedToken.fullName;
      this.userRole = decodedToken.roles[0]; 
      this.dateOfBirth = decodedToken.dateOfBirth; 
      this.userId = decodedToken.idUser;  
      this.getUsersExceptMe();
      this.getRoles(); // Fetch roles on component initialization
    }
  }
  toggleRoleSelection(userId: number, event: MouseEvent): void {
    // Prevent the event from bubbling up to the card flip
    event.stopPropagation();
    this.showRoleSelection[userId] = !this.showRoleSelection[userId]; // Toggle visibility for specific user
  }

  getUsersExceptMe() {
    const decodedToken = this.tokenService.getDecodedToken();
    if (!decodedToken || !decodedToken.idUser) {
      console.error('User ID not found in token');
      return;
    }

    this.userService.getAllUsersExceptMe({ currentUserId: decodedToken.idUser }).subscribe({
      next: (data: User[]) => {
        this.users = data.map(user => ({
          ...user,
          roleNames: user.roles ? user.roles.map(role => role.name).join(', ') : 'No role assigned'
        }));
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: (data: Role[]) => {
        this.roles = data; // Set the fetched roles
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  flipCard(userId: number, event: MouseEvent): void {
    // Check if the click is inside the role selection (or other areas we want to prevent flipping)
    if (event && event.target && (event.target as HTMLElement).closest('.role-selection')) {
      return;  // Prevent flip if clicked inside the role selection
    }
  
    if (userId !== undefined) {
      this.flippedState[userId] = !this.flippedState[userId];  // Toggle flip state for this user
    }
  }
  

  getRoleNames(user: User): string {
    return user.roles ? user.roles.map(role => role.name).join(', ') : 'No role assigned';
  }

  onRoleChange(userId: number): void {
    // Log the selected role name
    console.log(`Selected role for user ${userId}: ${this.selectedRole?.name}`);
  }

  assignRole(userId: number): void {
    if (!this.selectedRole || !this.selectedRole.name) {
      console.error('No role selected');
      return;
    }
  
    const roleName: string = this.selectedRole.name;
  
    // Call the service to assign the role
    this.userService.assignRoleToUser({ idUser: userId, roleName }).subscribe({
      next: (response: string) => {
        console.log(`Role ${roleName} assigned to user ${userId}: ${response}`);
        
        alert(response);
        this.getUsersExceptMe();  
      },
      error: (err) => {
        console.error('Error assigning role:', err);
      }
    });
  }
  
  
  
  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
