import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarService } from './navbar.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn2: boolean = false;
  menuVisible: boolean = false;
  userId: string | null = null;

  constructor(private authService: AuthService, private navbarService: NavbarService, private router: Router) {
    // Abonnez-vous aux modifications de l'état de connexion
    this.navbarService.getLoginStatus().subscribe(() => {
      this.updateNavbar();
    });
  }

  ngOnInit(): void {
    this.updateNavbar();

    // Écoute les modifications dans le localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        this.updateNavbar();
      }
    });
  }

  // Vérifie si l'utilisateur est connecté en fonction de la présence du token
  updateNavbar(): void {
    this.isLoggedIn2 = !!localStorage.getItem('authToken');
    if (this.isLoggedIn2) {
      this.userId = localStorage.getItem('userId');
    }
  }

  handleLogout(): void {
    // Supprimer les informations d'authentification
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');

    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('translate-x-full', !this.menuVisible);
    }
  }

}
