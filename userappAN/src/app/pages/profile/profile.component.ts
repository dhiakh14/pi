import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/models';
import { ResetPasswordDto } from 'src/app/services/models/ResetPasswordDto';
import { UserControllerService } from 'src/app/services/services';
import { UpdateService } from 'src/app/services/services/updateService';
import { TokenService } from 'src/app/token/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fullName: string = '';
  userRole: string = '';
  dateOfBirth: string = ''; 
  users: User[] = [];  
  userId!: number; 
isEditingFullName: boolean = false;
isEditingDateOfBirth: boolean = false;
newFullName: string = '';
newDateOfBirth: string = '';
updateMessage: string = '';
isLoading: boolean = false;
firstName: string = '';
  lastName: string = '';
  email: string = '';
  showPasswordModal: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordUpdateMessage: string = '';
  passwordUpdateSuccess: boolean = false;

  passwordStrength = 0;
showPasswordRequirements = false;
isUpdating = false;
 


  constructor(
    private router: Router,
    private tokenService: TokenService,
    private updateservice: UpdateService,
    private userService: UserControllerService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.userId = decodedToken.idUser;
      this.isLoading = true;
      
      this.userService.getProfile({ idUser: this.userId }).subscribe({
        next: (user: User) => {
          this.firstName = user.firstName || '';
          this.lastName = user.lastName || '';
          this.fullName = `${this.firstName} ${this.lastName}`.trim();
          this.userRole = user.roles?.[0]?.name || ''; 
          this.dateOfBirth = user.dateOfBirth || '';
          this.newFullName = this.fullName;
          this.newDateOfBirth = this.dateOfBirth;
          this.email = user.email || '';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load user profile:', err);
          this.updateMessage = 'Failed to load user profile';
          this.isLoading = false;
          this.fallbackToTokenData(decodedToken);
        }
      });
    }
  }

  togglePasswordModal() {
    this.showPasswordModal = !this.showPasswordModal;
    this.resetPasswordForm();
  }
  
  resetPasswordForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordUpdateMessage = '';
    this.passwordUpdateSuccess = false;
    this.passwordStrength = 0;
    this.isUpdating = false;
  }
  
  checkPasswordStrength() {
    let strength = 0;
    if (this.newPassword.length >= 8) strength++;
   
  }
  
  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordUpdateMessage = 'New passwords do not match';
      this.passwordUpdateSuccess = false;
      return;
    }
  
    if (this.newPassword.length < 8) {
      this.passwordUpdateMessage = 'Password must be at least 8 characters long';
      this.passwordUpdateSuccess = false;
      return;
    }
  
    const resetData: ResetPasswordDto = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  
    this.isUpdating = true;
    
    this.updateservice.updatePassword(resetData).subscribe({
      next: () => {
        this.passwordUpdateMessage = 'Password updated successfully!';
        this.passwordUpdateSuccess = true;
        setTimeout(() => {
          this.togglePasswordModal();
        }, 2000);
      },
      error: (err) => {
        this.passwordUpdateMessage = err.message || 'Failed to update password';
        this.passwordUpdateSuccess = false;
        this.isUpdating = false;
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }

  private fallbackToTokenData(decodedToken: any): void {
    this.fullName = decodedToken.fullName;
    this.userRole = decodedToken.roles[0]; 
    this.dateOfBirth = decodedToken.dateOfBirth;
    this.newFullName = this.fullName;
    this.newDateOfBirth = this.dateOfBirth;
  }
  toggleEditFullName() {
    this.isEditingFullName = !this.isEditingFullName;
    this.newFullName = this.fullName;
  }
  
  toggleEditDateOfBirth() {
    this.isEditingDateOfBirth = !this.isEditingDateOfBirth;
    this.newDateOfBirth = this.dateOfBirth;
  }
  
  submitFullNameUpdate() {
    this.updateservice.updateFullName(this.userId, this.newFullName).subscribe({
      next: (response) => {
        this.fullName = this.newFullName;
        this.updateMessage = response;
        this.isEditingFullName = false;
      },
      error: (err) => {
        this.updateMessage = 'Error: Unable to update full name.';
      }
    });
  }
  submitDateOfBirthUpdate() {
    this.updateservice.updateDateOfBirth(this.userId, this.newDateOfBirth).subscribe({
      next: (response) => {
        this.dateOfBirth = this.newDateOfBirth;
        this.updateMessage = response;
        this.isEditingDateOfBirth = false;
      },
      error: (err) => {
        this.updateMessage = 'Error: Unable to update date of birth.';
      }
    });
  }

 

  getRoleNames(user: User): string {
    return user.roles ? user.roles.map(role => role.name).join(', ') : 'No role assigned';
  }
  
  

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

 
}
