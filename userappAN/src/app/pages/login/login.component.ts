import { Component } from '@angular/core';
import {AuthenficationRequest} from "../../services/models/authenfication-request"
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/services';
import { TokenService } from 'src/app/token/token.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


authRequest : AuthenficationRequest = {email: '', password: ''};
errorMsg: Array<String>= [];
showPassword = false;
constructor(private router : Router,
  private authService : AuthenticationService,
  private tokenServcie : TokenService,
  private translate: TranslateService

) {}

login() {
  this.errorMsg = [];
  this.authService.authenticate({
    body: this.authRequest
  }).subscribe({
    next: (res) => {
      this.tokenServcie.token = res.token as string;
      const decodedToken = this.tokenServcie.getDecodedToken();

      if (decodedToken) {
        const idUser = this.tokenServcie.getUserId();
        const userRole = decodedToken.roles[0]; 

        if (userRole === 'ADMIN') {
          this.router.navigate([`/profile/${idUser}`]); 
        } else {
          this.router.navigate(['/notadminusers']); 
        }
      }
    },
    error: (err) => {
      console.log(err);
      if (err.error.validationErrors) {
        this.errorMsg = err.error.validationErrors;
      } else {
        this.errorMsg.push(err.error.error);
      }
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
    }}

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }  


}
