import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from '../search.service'; // Assurez-vous que le chemin est correct
import { SearchInterface } from '../search-interface'; // Assurez-vous que le chemin est correct

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

  constructor(private fb: FormBuilder, private searchService: SearchService, private router: Router) {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      date: ['']
    });
  }

  ngOnInit(): void {
    // Vous pouvez ajouter une logique ici si nécessaire
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const { from, to, date } = this.searchForm.value;
      this.searchService.searchTrips(from, to, date).subscribe(
        (data: SearchInterface[]) => {
          this.trips = data;
          this.showResults = this.trips.length > 0;
          if (this.trips.length === 0) {
            this.noResultsMessage = 'Aucun trajet ne correspond à ces critères.';
          } else {
            this.noResultsMessage = null;
          }
        },
        (error) => {
          console.error('Error fetching trips:', error);
          this.noResultsMessage = 'Une erreur est survenue lors de la recherche des trajets.';
        }
      );
    }
  }

  viewTrip(id: string): void {
    this.router.navigate(['/trip', id]);
  }
}
