import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
const api_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getCourses(
    page: number = 1,
    perPage: number = 8,
    search: string = '',
    category: string = '',
    sort: string = 'new'
  ): Observable<any> {
    let params = new HttpParams()
      .set('current_page', page.toString())
      .set('per_page', perPage.toString())
      .set('search', search)
      .set('category', category)
      .set('sort', sort);

    return this.http.get<any>(api_url + 'courses', { params });
  }
}
