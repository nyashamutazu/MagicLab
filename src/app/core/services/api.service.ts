import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(config): Observable<any> {
    const target = Object.keys(config).map(k => {
      return `${k}=${config[k]}`;
    }).join('&');

    return this.http.get(`${environment.api_url}${target}`);
  }

  reset(): Observable<any> {
    return this.http.get(`${environment.api_url}/reset`);
  }

  private formatErrors(error: any) {
    console.log('Error,', error);
    return throwError(error.error);
  }
}


