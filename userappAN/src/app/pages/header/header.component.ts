import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

   constructor(
      private router: Router,
      private tokenService: TokenService,
    ) {}
  

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  } 


}
