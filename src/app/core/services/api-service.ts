import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.base}/${path}`);
  }
  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.base}/${path}`, body);
  }
  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.base}/${path}`, body);
  }
  delete<T>(path: string) {
    return this.http.delete<T>(`${this.base}/${path}`);
  }
}
