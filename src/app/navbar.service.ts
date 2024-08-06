import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private loginStatus = new BehaviorSubject<boolean>(false);

  setLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }
}
