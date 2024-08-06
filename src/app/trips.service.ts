import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TripInterface } from './trip-interface';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private apiUrl = 'http://127.0.0.1:8000/api/trip';

  constructor(private http: HttpClient) { }

  getTrips(): Observable<TripInterface[]> {
    return this.http.get<TripInterface[]>(this.apiUrl);
  }

  getTripById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
