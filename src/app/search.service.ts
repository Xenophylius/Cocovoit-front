import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripInterface } from './trip-interface';
import { SearchInterface } from './search-interface';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = environment.apiURL + 'trips';

  constructor(private http: HttpClient) { }

  searchTrips(from: string, to: string, date: string): Observable<SearchInterface[]> {
    const params = new HttpParams()
      .set('start', from)
      .set('end', to)
      .set('date', date);

      console.log('Fetching trips with params:', params.toString()); // Ajoutez cette ligne pour vérifier les paramètres

    return this.http.get<SearchInterface[]>(this.apiUrl, { params });
  }
}
