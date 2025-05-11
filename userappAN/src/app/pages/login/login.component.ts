import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenficationRequest } from "../../services/models/authenfication-request";
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/token/token.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authRequest: AuthenficationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];
  showPassword = false;
  isLoading = false;
  userBirthDate: string | null = null;
  forgotPasswordEmail: string = '';
  showForgotPasswordForm: boolean = false;
  resetSuccess: boolean = false;
  resetError: string = '';


  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadGoogleSignInScript();
  }

  toggleForgotPasswordForm() {
    this.showForgotPasswordForm = !this.showForgotPasswordForm;
    this.resetSuccess = false;
    this.resetError = '';
  }

  requestPasswordReset() {
    if (!this.forgotPasswordEmail) {
      this.resetError = this.translate.instant('Please enter your email address');
      return;
    }
  
    this.isLoading = true;
    this.resetError = '';
    this.resetSuccess = false;
  
    this.authService.forgotPassword({ email: this.forgotPasswordEmail }).subscribe({
      next: () => {
        this.isLoading = false;
        this.resetSuccess = true;
        this.forgotPasswordEmail = '';
        
        setTimeout(() => {
          this.showForgotPasswordForm = false;
          this.resetSuccess = false;
        }, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        
        if (err.status === 404) {
          this.resetError = this.translate.instant('Email not found');
        } else if (err.status === 429) {
          this.resetError = this.translate.instant('Too many requests. Please try again later.');
        } else {
          this.resetError = this.translate.instant('Failed to send reset email. Please try again later.');
        }
        
        setTimeout(() => this.resetError = '', 5000);
      }
    });
  }




  private loadGoogleSignInScript() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initializeGoogleSignIn();
      document.head.appendChild(script);
    } else {
      this.initializeGoogleSignIn();
    }
  }

  private initializeGoogleSignIn() {
    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleSignIn(response),
        auto_select: false,
        cancel_on_tap_outside: true,
        scope: 'profile email https://www.googleapis.com/auth/user.birthday.read'
      });

      const buttonConfig = {
        theme: 'outline',
        size: 'large',
        text: this.translate.currentLang === 'fr' ? 'continue_with' : 'signin_with',
        locale: this.translate.currentLang
      };

      google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        buttonConfig
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      this.errorMsg = ['Failed to initialize Google Sign-In'];
    }
  }

  handleGoogleSignIn(response: any) {
    this.ngZone.run(() => {
      if (response.credential) {
        this.isLoading = true;
        this.authService.authenticateWithGoogle({ googleToken: response.credential }).subscribe({
          next: (res) => {
            this.tokenService.token = res.token as string;
            const birthDate = this.tokenService.getDateOfBirth();
            
            if (birthDate === '2000-01-01') {
              this.router.navigate(['/notadminusers'], { 
                queryParams: { requireBirthdate: true } 
              });
            } else {
              this.router.navigate(['/notadminusers']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMsg = ['Google authentication failed'];
          }
        });
      }
    });
  }

  private handleSuccessfulAuthentication() {
    this.userBirthDate = this.tokenService.getDateOfBirth();
    
    if (!this.userBirthDate) {
      console.warn('User birth date not provided in token');
    }

    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      const idUser = this.tokenService.getUserId();
      const userRole = decodedToken.roles[0];

      const redirectPath = userRole === 'ADMIN' 
        ? `/profile/${idUser}`
        : '/notadminusers';
      
      this.router.navigate([redirectPath]);
    }
    
    this.isLoading = false;
  }

  private handleAuthenticationError(err: any) {
    this.isLoading = false;
    console.error('Authentication failed:', err);
    
    if (err.error?.validationErrors) {
      this.errorMsg = err.error.validationErrors;
    } else if (err.error?.error) {
      this.errorMsg = [err.error.error];
    } else {
      this.errorMsg = ['Authentication failed. Please try again.'];
    }
  }

  login() {
    this.errorMsg = [];
    this.isLoading = true;
    
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.handleSuccessfulAuthentication();
      },
      error: (err) => {
        this.handleAuthenticationError(err);
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  switchLanguage(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value;
    if (selectedLang) {
      this.translate.use(selectedLang);
      this.initializeGoogleSignIn(); // Reinitialize Google button with new language
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}