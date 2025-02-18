import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/token/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  fullName: string = '';
  userRole: string = '';
  dateOfBirth: Date=new Date; 

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      this.fullName = decodedToken.fullName;
      this.userRole = decodedToken.roles[0]; 
      this.dateOfBirth=decodedToken.dateOfBirth;
    }
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  

}
