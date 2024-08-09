import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  addTripForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.addTripForm = this.fb.group({
      starting_point: ['', Validators.required],
      ending_point: ['', Validators.required],
      starting_at: ['', Validators.required],
      available_places: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.addTripForm.valid) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const userId = this.authService.getUserId(); // Assurez-vous que votre authService renvoie l'ID utilisateur
      const tripData = { ...this.addTripForm.value, user_id: userId };

      this.http.post(environment.apiURL + 'trip', tripData, { headers }).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error adding trip:', error);
        }
      });
    }
  }
}
