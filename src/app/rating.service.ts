import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Rating } from './rating-interface';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiURL + 'rating';

  constructor(private http: HttpClient) { }

  // Soumettre une note pour un trajet
  submitRating(trip_id: number, rating: number, userId: string | null): Observable<any> {
    // Type explicite pour les paramètres
    const body = { trip_id, user_id: userId, rating };
    return this.http.post<any>(this.apiUrl, body);
  }

  // Récupérer les notes d'un trajet
  getRatings(tripId: number): Observable<Rating[]> {
    // Assurez-vous que Rating est défini quelque part dans votre code
    return this.http.get<Rating[]>(`${this.apiUrl}/${tripId}`);
  }

  // Vérifier si un utilisateur a déjà noté un trajet
  hasRated(tripId: number, userId: string | null): Observable<boolean> {
    return new Observable(observer => {
      this.getRatings(tripId).subscribe(ratings => {
        const hasRated = ratings.some(rating => rating.user_id === userId);
        observer.next(hasRated);
        observer.complete();
      });
    });
  }
}

