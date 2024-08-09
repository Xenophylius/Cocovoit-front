import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarService } from './navbar.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginResponse } from './login-response';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private navbarService: NavbarService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId); // Assurez-vous que `response.userId` contient l'ID de l'utilisateur
        this.navbarService.setLoginStatus(true);
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.error('Erreur lors de la connexion:', error);
        return of(null); // Retourner un observable vide en cas d'erreur
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}user`, userData).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'inscription:', error);
        return of(null); // Retourner un observable vide en cas d'erreur
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.navbarService.setLoginStatus(false);
    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    // Assurez-vous que l'ID utilisateur est stocké dans le localStorage après la connexion
    return localStorage.getItem('userId');
  }
}
