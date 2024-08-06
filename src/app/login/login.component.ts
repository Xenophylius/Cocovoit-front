import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Pour afficher les messages d'erreur

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: response => {
          if (response && response.token) {
            // Si la réponse contient un token valide, redirige vers /home
            this.router.navigate(['/home']);
          } else {
            // Gérer le cas où la réponse ne contient pas de token
            this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          }
        },
        error: error => {
          console.error('Erreur lors de la connexion:', error);
          this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }
      });
    } else {
      // Optionnel: Afficher un message d'erreur si le formulaire n'est pas valide
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
    }
  }
}
