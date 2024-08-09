import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiURL + 'contact';

  constructor(private http: HttpClient) {}

  sendContactForm(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
