import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { login } from '../common/common';
import { Router } from '@angular/router';
const api_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  constructor(private http: HttpClient, private router: Router) {}

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(values: login) {
    return this.http
      .post<any>(api_url + `login`, {
        username: values.username,
        device: values.device,
        social_auth: values.social_auth,
      })
      .pipe(
        map((data) => {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          this.currentUserSubject.next(data.user);
          return data;
        })
      );
  }

  register(values: any) {
    return this.http.post<any>(api_url + `register`, {
      name: values.name,
      mobile: values.mobile,
      email: values.email,
      device: values.device,
      user_type: values.user_type,
      social_auth: values.social_auth,
    });
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return user && user.token ? true : false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  initializeApp() {
    return new Promise((resolve) => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
      resolve(true);
    });
  }
}
