import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripsService } from '../trips.service';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-trip-by-id',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trip-by-id.component.html',
  styleUrls: ['./trip-by-id.component.css']
})
export class TripByIdComponent implements OnInit, AfterViewInit {
  tripId: number | null = null;
  trip: any;
  userId: number | null = null;
  errorMessage: string | null = null;
  availablePlaces: number = 0;
  successMessage: string = '';
  map: L.Map | undefined;
  startCoords: [number, number] | undefined;
  endCoords: [number, number] | undefined;

  constructor(private tripService: TripsService, private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    const id = +this.route.paramMap.get('id')!;
    this.tripService.getTripById(id).subscribe(
      (data) => {
        this.trip = data;
        this.calculateAvailablePlaces();
        this.geocodeLocations(); // Commencez à géocoder les villes
      },
      (error) => {
        console.error('Error fetching trip data:', error);
        this.errorMessage = 'Unable to fetch trip details.';
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.startCoords && this.endCoords) {
      this.initMap();
    }
  }

  goBack(): void {
    this.location.back();
  }

  calculateAvailablePlaces(): void {
    if (this.trip) {
      const totalPlaces = this.trip.available_places || 0;
      const reservedPlaces = this.trip.participate ? this.trip.participate.length : 0;
      this.availablePlaces = totalPlaces - reservedPlaces;
    }
  }

  reserveTrip(tripId: number): void {
    const userId = Number(localStorage.getItem('userId'));
    console.log(this.trip.user_id, userId);
    if (tripId && userId) {
      if (this.trip.user_id === userId) {
        console.error('Vous ne pouvez pas réserver votre propre trajet.');
        this.errorMessage = 'Vous ne pouvez pas réserver votre propre trajet.';
        return;
      }
      this.tripService.reserveTrip(tripId, userId).subscribe(
        response => {
          console.log('Réservation réussie:', response);
          this.loadTrip(); // Recharger les détails du trajet pour refléter les changements
          this.successMessage = 'Réservation réussie !';
        },
        error => {
          console.error('Erreur lors de la réservation:', error);
          this.errorMessage = 'Vous avez déjà réservé ce trajet.';
        }
      );
    } else {
      console.error('ID utilisateur ou ID trajet non disponibles.');
      this.errorMessage = 'ID utilisateur ou ID trajet non disponibles.';
    }
  }

  isButtonDisabled(): boolean {
    return this.availablePlaces <= 0;
  }

  // Géocode les villes pour obtenir les coordonnées
  geocodeLocations(): void {
    if (this.trip.starting_point && this.trip.ending_point) {
      const geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=';
      // Géocode le point de départ
      fetch(geocodeUrl + encodeURIComponent(this.trip.starting_point))
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            this.startCoords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          }
          // Géocode le point d'arrivée
          return fetch(geocodeUrl + encodeURIComponent(this.trip.ending_point));
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            this.endCoords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            if (this.startCoords && this.endCoords) {
              this.initMap(); // Initialise la carte après avoir obtenu les coordonnées
            }
          }
        })
        .catch(error => {
          console.error('Error during geocoding:', error);
        });
    }
  }

  // Initialise la carte Leaflet
  initMap(): void {
    if (this.startCoords && this.endCoords) {
      this.map = L.map('map').setView(this.startCoords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      L.marker(this.startCoords).addTo(this.map).bindPopup('Starting Point');
      L.marker(this.endCoords).addTo(this.map).bindPopup('Ending Point');

      if (this.startCoords && this.endCoords) {
        L.polyline([this.startCoords, this.endCoords], { color: 'blue' }).addTo(this.map);
      }
    }
  }

  loadTrip(): void {
    if (this.tripId) {
      this.tripService.getTrip(this.tripId).subscribe(
        data => {
          this.trip = data;
          this.calculateAvailablePlaces();  
          this.successMessage = ''; // Réinitialiser les messages
          this.errorMessage = '';
        },
        error => {
          console.error('Erreur lors de la récupération du trajet:', error);
          this.errorMessage = 'Erreur lors de la récupération du trajet. Veuillez réessayer.';
        }
      );
    }
  }

  
}
