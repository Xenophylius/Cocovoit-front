import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiURL + 'user';

  constructor(private http: HttpClient) { }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, profileData);
  }
}
