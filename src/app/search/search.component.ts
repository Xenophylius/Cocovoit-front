import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from '../search.service';
import { SearchInterface } from '../search-interface';
import * as L from 'leaflet';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  trips: SearchInterface[] = [];
  noResultsMessage: string | null = null;
  showResults: boolean = false;
  map: L.Map | undefined;
  markers: L.Marker[] = [];
  distances: { [key: string]: number } = {};

  @ViewChild('map') mapElement: ElementRef | undefined;

  constructor(private fb: FormBuilder, private searchService: SearchService, private router: Router) {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      date: ['']
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialisez la carte si des résultats sont déjà affichés
    if (this.showResults) {
      this.initMap();
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const { from, to, date } = this.searchForm.value;
      this.searchService.searchTrips(from, to, date).subscribe(
        (data) => {
          this.trips = data;
          this.showResults = this.trips.length > 0;
          if (this.trips.length === 0) {
            this.noResultsMessage = 'Aucun trajet ne correspond à ces critères.';
          } else {
            this.noResultsMessage = null;
            this.showMap(); // Afficher la carte après avoir reçu les résultats
          }

          // Initialisez la carte si des résultats sont affichés
          if (this.showResults) {
            setTimeout(() => {
              this.initMap();
            }, 0);
          }
        },
        (error) => {
          console.error('Error fetching trips:', error);
          this.noResultsMessage = 'Une erreur est survenue lors de la recherche des trajets.';
        }
      );
    }
  }

  showMap(): void {
    if (this.mapElement) {
      this.mapElement.nativeElement.classList.remove('hidden');
      this.initMap();
    }
  }

  viewTrip(id: string): void {
    this.router.navigate(['/trip', id]);
  }

  initMap(): void {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      if (!this.map) {
        this.map = L.map(mapContainer).setView([48.8566, 2.3522], 6); // Vue initiale sur Paris

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(this.map);
      }

      this.trips.forEach(trip => {
        const geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=';

        const addMarkers = async () => {
          try {
            let startCoords: [number, number] | undefined;
            let endCoords: [number, number] | undefined;

            const startResponse = await fetch(geocodeUrl + encodeURIComponent(trip.starting_point));
            const startData = await startResponse.json();
            if (startData && startData.length > 0) {
              startCoords = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
              if (this.map) {
                L.marker(startCoords).addTo(this.map).bindPopup(`Départ: ${trip.starting_point}`);
              }
            }

            const endResponse = await fetch(geocodeUrl + encodeURIComponent(trip.ending_point));
            const endData = await endResponse.json();
            if (endData && endData.length > 0) {
              endCoords = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];
              if (this.map) {
                L.marker(endCoords).addTo(this.map).bindPopup(`Arrivée: ${trip.ending_point}`);
                if (startCoords) {
                  this.map?.fitBounds([startCoords, endCoords]);

                  // Calculer la distance entre le point de départ et d'arrivée
                  const distance = this.calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1]);
                  this.distances[trip.id] = distance; // Stocker la distance par ID de trajet
                }
              }
            }
          } catch (error) {
            console.error('Erreur lors de l\'obtention des coordonnées:', error);
          }
        };

        addMarkers();
      });
    } else {
      console.error('Map container not found');
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
