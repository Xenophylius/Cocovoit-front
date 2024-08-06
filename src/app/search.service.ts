import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripInterface } from './trip-interface';
import { SearchInterface } from './search-interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://127.0.0.1:8000/api/trips';

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
