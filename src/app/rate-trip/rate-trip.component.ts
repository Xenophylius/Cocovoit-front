import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RatingService } from '../rating.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TripsService } from '../trips.service'; // Assurez-vous que vous avez un service pour récupérer les informations du trajet

@Component({
  selector: 'app-rate-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rate-trip.component.html',
  styleUrls: ['./rate-trip.component.css']
})
export class RateTripComponent implements OnInit {
  @Input() tripId!: number;
  ratingForm: FormGroup;
  submissionStatus: string | null = null;
  tripDatePassed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService,
    private authService: AuthService,
    private tripService: TripsService // Service pour récupérer les trajets
  ) {
    this.ratingForm = this.fb.group({
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.checkTripDate();
  }

  checkTripDate(): void {
    this.tripService.getTripById(this.tripId).subscribe({
      next: (trip: any) => {
        const tripDate = new Date(trip.starting_at);
        const currentDate = new Date();
        this.tripDatePassed = tripDate < currentDate;
        if (!this.tripDatePassed) {
          this.submissionStatus = 'Vous ne pouvez noter un trajet que s\'il est déjà passé.';
        }
      },
      error: (err: any) => {
        console.error('Error fetching trip data:', err);
        this.submissionStatus = 'Erreur lors de la récupération des informations du trajet.';
      }
    });
  }

  submitRating(tripId: number): void {
    if (this.ratingForm.valid && this.tripDatePassed) {
      const rating = this.ratingForm.value.rating;
      this.ratingService.submitRating(tripId, rating, localStorage.getItem('userId')).subscribe({
        next: () => {
          this.submissionStatus = 'Note enregistrée avec succès!';
          this.ratingForm.reset({ rating: 1 });
        },
        error: (err: any) => {
          this.submissionStatus = err.error.message;
          console.error('Error submitting rating:', err);
        }
      });
    } else if (!this.tripDatePassed) {
      this.submissionStatus = 'Vous ne pouvez noter ce trajet car sa date n\'est pas encore passée.';
    }
  }

  setRating(star: number): void {
    this.ratingForm.get('rating')?.setValue(star);
  }
}
