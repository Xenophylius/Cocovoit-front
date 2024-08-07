import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TripInterface } from './trip-interface';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private apiUrl = 'http://cocovoit-back.test/api/trip';

  constructor(private http: HttpClient) { }

  getTrips(): Observable<TripInterface[]> {
    return this.http.get<TripInterface[]>(this.apiUrl);
  }

  getTripById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getUserTrips(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?user_id=${userId}`);
  }

  deleteTrip(tripId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${tripId}`);
  }

  getTrip(tripId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tripId}`);
  }

  reserveTrip(tripId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${tripId}/reserve`, { userId });
  }
}
