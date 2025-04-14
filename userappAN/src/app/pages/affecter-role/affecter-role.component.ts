import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleControllerService, UserControllerService } from 'src/app/services/services';
import { TokenService } from 'src/app/token/token.service';
import { User } from 'src/app/services/models';
import { Role } from 'src/app/services/models/role';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


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
  selectedRole: { [userId: number]: Role | undefined } = {}; 
  flippedState: { [userId: number]: boolean } = {};
  showRoleSelection: { [userId: number]: boolean } = {}; 
  replaceExistingRole: { [userId: number]: boolean } = {}; 
  userBanStatus: { [userId: number]: boolean } = {};  


  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserControllerService,
    private roleService: RoleControllerService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.fullName = decodedToken.fullName;
      this.userRole = decodedToken.roles[0]; 
      this.dateOfBirth = decodedToken.dateOfBirth; 
      this.userId = decodedToken.idUser;  
      this.getUsersExceptMe();
      this.getRoles();
    }
  }

  banUser(userId: number, lockStatus: boolean): void {
    console.log(`Banning user with ID: ${userId} and lockStatus: ${lockStatus}`);

    this.userService.banUser({ idUser: userId, lockStatus: lockStatus }).subscribe(
      response => {
        console.log('User banned successfully:', response);
        this.toastr.success('User has been banned successfully', 'Success', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        });
  
        const user = this.users.find(u => u.idUser === userId);
        if (user) {
          user.accountLocked = lockStatus;  
        }
      },
      error => {
        console.error('Error banning user:', error);
        this.toastr.error('An error occurred while processing the action', 'Error');
      }
    );
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
        this.roles = data; 
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  flipCard(userId: number, event: MouseEvent): void {
    if (event && event.target && (event.target as HTMLElement).closest('.role-selection')) {
      return;  
    }

    if (userId !== undefined) {
      this.flippedState[userId] = !this.flippedState[userId];  
    }
  }

  getRoleNames(user: User): string {
    return user.roles ? user.roles.map(role => role.name).join(', ') : 'No role assigned';
  }

  onRoleChange(userId: number, selectedRole: Role | undefined): void {
    if (!selectedRole) {
        console.error('Selected role is undefined');
        return;
    }
    this.selectedRole[userId] = selectedRole;
    console.log(`Selected role for user ${userId}: ${selectedRole.name}`);
  }

  assignOrReplaceRole(userId: number, role: Role | undefined, replaceExisting: boolean) {
    if (!role) {
      console.error('No role selected');
      return;
    }

    const roleName = role?.name ?? '';  

    if (replaceExisting) {
      this.userService.assignAndReplaceRoleToUser({ idUser: userId, roleName }).subscribe(
        (response) => {
          console.log('Role replaced successfully', response);
        },
        (error) => {
          console.error('Error replacing role', error);
        }
      );
    } else {
      this.userService.assignRoleToUser({ idUser: userId, roleName }).subscribe(
        (response) => {
          console.log('Role assigned successfully', response);
        },
        (error) => {
          console.error('Error assigning role', error);
        }
      );
    }
  }


  toggleRoleSelection(userId: number, event: Event) {
    event.stopPropagation();
    this.showRoleSelection[userId] = !this.showRoleSelection[userId];
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
