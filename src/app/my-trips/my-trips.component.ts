import { Component, OnInit } from '@angular/core';
import { TripsService } from '../trips.service';
import { CommonModule } from '@angular/common';
import { TripInterface } from '../trip-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css']
})
export class MyTripsComponent implements OnInit {
  userId: number | null = null; // Type ajusté pour être un nombre
  createdTrips: TripInterface[] = []; // Les trajets créés par l'utilisateur
  participatingTrips: TripInterface[] = []; // Les trajets auxquels l'utilisateur participe

  constructor(private tripService: TripsService, private router: Router) { }

  ngOnInit(): void {
    // Convertir userId en nombre ou null si non disponible
    this.userId = Number(localStorage.getItem('userId'));

    if (this.userId !== null) { // Vérifiez que userId n'est pas null
      this.loadAllTrips();
    } else {
      console.error('User ID is not available in localStorage');
    }
  }

  loadAllTrips(): void {
    this.tripService.getTrips().subscribe(
      (data: TripInterface[]) => {
        // Assurez-vous que userId est bien un nombre pour la comparaison
        if (this.userId !== null) {
          // Filtrer les trajets créés par l'utilisateur
          this.createdTrips = data.filter(trip => Number(trip.user_id) === this.userId);

          // Filtrer les trajets auxquels l'utilisateur participe
          this.participatingTrips = data.filter(trip => trip.participate && trip.participate.includes(Number(this.userId)) && Number(trip.user_id) !== Number(this.userId));
        }
      },
      error => {
        console.error('Error fetching trips:', error);
      }
    );
  }

  onTripClick(tripId: number): void {
    this.router.navigate(['/trip', tripId]);
  }

  deleteTrip(tripId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      this.tripService.deleteTrip(tripId).subscribe(
        () => {
          this.createdTrips = this.createdTrips.filter(trip => trip.id !== tripId);
          console.log('Trajet supprimé avec succès.');
        },
        error => {
          console.error('Erreur lors de la suppression du trajet:', error);
        }
      );
    }
  }
}
