import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });

    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMsg = 'Invalid or expired reset link. Please request a new one.';
    }
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid || !this.token) return;

    this.isSubmitting = true;
    this.errorMsg = null;
    this.successMsg = null;

    const params = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    this.authService.resetPassword(params).subscribe({
      next: () => {
        this.successMsg = 'Password reset successfully! Redirecting to login...';
        this.resetPasswordForm.reset();
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        
        if (err.status === 200) {
          this.successMsg = 'Password reset successfully! Redirecting to login...';
          this.resetPasswordForm.reset();
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.errorMsg = err.error?.message || 
                         (err.status === 400 ? 'Invalid or expired token' : 
                          'Failed to reset password. Please try again.');
        }
      }
    });
  }
}