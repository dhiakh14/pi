import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from 'src/app/token/token.service';
import { ResetPasswordDto } from '../models/ResetPasswordDto';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private baseUrl = 'http://localhost:8082/GE/users';
  private updatePasswordUrl = 'http://localhost:8082/GE/auth/update-password';

  

  constructor(private http: HttpClient,
     private tokenService: TokenService
  ) { }

  updatePassword(resetData: ResetPasswordDto): Observable<any> {
    if (!this.tokenService.isAuthenticated()) {
      return throwError(() => new Error('User is not authenticated'));
    }

    const email = this.tokenService.getEmail();
    if (!email) {
      return throwError(() => new Error('Unable to retrieve user email from token'));
    }

    const requestPayload = {
      email: email, 
      currentPassword: resetData.currentPassword,
      newPassword: resetData.newPassword
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.token}`
    });

    return this.http.post(
      this.updatePasswordUrl,
      requestPayload,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Password update error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update password'));
      })
    );
  }


  


  updateFullName(idUser: number, fullName: string): Observable<any> {
    const params = new HttpParams().set('fullName', fullName);
    return this.http.put(`${this.baseUrl}/${idUser}/updateFullName`, null, { params });
  }

  updateDateOfBirth(idUser: number, newDateOfBirth: string): Observable<any> {
    const params = new HttpParams().set('newDateOfBirth', newDateOfBirth);
    return this.http.put(`${this.baseUrl}/${idUser}/updateDateOfBirth`, null, { params });
  }
}