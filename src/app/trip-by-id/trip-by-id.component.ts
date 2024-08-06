import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripsService } from '../trips.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trip-by-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-by-id.component.html',
  styleUrls: ['./trip-by-id.component.css']
})
export class TripByIdComponent implements OnInit {
  trip: any;
  errorMessage: string | null = null;

  constructor(private tripService: TripsService, private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tripService.getTripById(id).subscribe(
      (data) => {
        this.trip = data;
      },
      (error) => {
        console.error('Error fetching trip data:', error);
        this.errorMessage = 'Unable to fetch trip details.';
      }
    );
  }

  goBack(): void {
    this.location.back(); // Méthode pour revenir à la page précédente
  }
}
