import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

interface Rating {
  rating: number;
  // Ajoutez d'autres propriétés si nécessaire, comme user_id, trip_id, etc.
}

@Component({
  selector: 'app-trip-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-rating.component.html',
  styleUrls: ['./trip-rating.component.css']
})
export class TripRatingComponent implements OnInit {

  @Input() tripId!: number;
  ratings: Rating[] = [];
  averageRating: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  // Charge les notes pour le trajet donné
  loadRatings(): void {
    this.http.get<Rating[]>(`${environment.apiURL}rating/${this.tripId}`).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.ratings = response;
          this.calculateAverageRating();
        } else {
          // Aucun rating trouvé, gérer cela selon vos besoins
          this.averageRating = null;
        }
      },
      (error) => {
        console.error('Une erreur est survenue lors de la récupération des notes', error);
        this.averageRating = null; // Gérer l'erreur
      }
    );
  }

  // Calcule la note moyenne
  calculateAverageRating(): void {
    if (this.ratings.length > 0) {
      const sum = this.ratings.reduce((total, ratingObj) => total + ratingObj.rating, 0);
      this.averageRating = sum / this.ratings.length;
      console.log('Somme des notes:', sum);
    } else {
      this.averageRating = null; // ou 0, selon votre préférence
    }
  }

  // Envoie la note pour le trajet
  rateTrip(rating: number): void {
    const body = {
      user_id: Number(localStorage.getItem('userId')), // Convertit l'ID utilisateur en nombre
      trip_id: this.tripId,
      rating: rating
    };

    this.http.post(`${environment.apiURL}rating`, body).subscribe(
      response => {
        console.log('Note ajoutée avec succès', response);
        this.loadRatings(); // Recharger les ratings pour mettre à jour la moyenne
      },
      error => {
        if (error.status === 409) {
          alert('Vous avez déjà noté ce trajet.');
        } else {
          console.error('Une erreur est survenue lors de l\'ajout de la note', error);
          alert('Une erreur est survenue lors de l\'ajout de la note.');
        }
      }
    );
  }
}
