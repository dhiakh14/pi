import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationRequest } from 'src/app/services/models';
import { AuthenticationService } from 'src/app/services/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerRequest: RegistrationRequest = { email: '', firstName: '', lastName: '', password: '', dateOfBirth: new Date() };
  confirmPassword: string = '';
  errorMsg: Array<string> = [];
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private translate: TranslateService
  ) {}

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];

    if (this.registerRequest.password !== this.confirmPassword) {
      this.errorMsg.push('Passwords do not match');
      return;
    }

    this.authService.register({
      body: this.registerRequest
    }).subscribe({
      next: () => this.router.navigate(['activate-account']),
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  switchLanguage(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value;
    if (selectedLang) {
      this.translate.use(selectedLang);
    }
  }
}
