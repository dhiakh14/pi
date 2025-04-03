  import { Injectable } from '@angular/core';
  import { jwtDecode } from 'jwt-decode';


  @Injectable({
    providedIn: 'root'
  })
  export class TokenService {
    private readonly tokenKey = 'token';

  set token(token : string){
    localStorage.setItem('token', token);
  }
  get token(){
    return localStorage.getItem('token') as string;
  }
  getDecodedToken(): any {
    const token = this.token;
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    console.log("Decoded Token:", decoded);
    return decoded?.idUser || null; 
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getDateOfBirth(): string | null {
    const decoded = this.getDecodedToken();
    if (decoded?.dateOfBirth) {
      if (typeof decoded.dateOfBirth === 'string') {
        return decoded.dateOfBirth;
      } else if (decoded.dateOfBirth instanceof Date) {
        return decoded.dateOfBirth.toISOString().split('T')[0];
      }
    }
    return null;
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    console.log('Decoded Token:', decoded); 
  
    if (decoded?.roles && Array.isArray(decoded.roles)) {
      return decoded.roles.map((role: string) => role.toUpperCase()); 
    }
  
    return [];
  }
  
  
  clearToken(): void {
    localStorage.removeItem(this.tokenKey); 
  }
  
  }
