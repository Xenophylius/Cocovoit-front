import { Component, OnInit } from '@angular/core';
import { TripInterface } from '../trip-interface';
import { TripsService } from '../trips.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-trip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-trip.component.html',
  styleUrl: './recent-trip.component.css'
})
export class RecentTripComponent implements OnInit {

  trips: TripInterface[] = []; // Initialisé à un tableau vide
  displayedTrips: TripInterface[] = []; // Les trajets à afficher

  constructor(private tripService: TripsService, private router: Router) {}

  ngOnInit(): void {
    this.tripService.getTrips().subscribe(
      (data: TripInterface[]) => { // Assurez-vous que data est un tableau de TripInterface
        // Trier les trajets par date de création (du plus récent au plus ancien)
        this.trips = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Limiter à 5 résultats
        this.displayedTrips = this.trips.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching trips:', error);
      }
    );
  }

  onTripClick(tripId: number): void {
    this.router.navigate(['/trip', tripId]);
  }
}
