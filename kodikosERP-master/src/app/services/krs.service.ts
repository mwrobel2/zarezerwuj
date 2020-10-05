import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Krs } from '../models/krs.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class KrsService {

  constructor(
    private http: HttpClient
  ) { }

  getDataNip(nip: string): Observable<Krs> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: '260618e8-c355-48f7-a582-4a82e58e1701'
      })
    };

    const nipKrsUrl = 'https://rejestr.io/api/v1/krs?nip=' + nip;
    return this.http.get<Krs>(nipKrsUrl, httpOptions);
  }

  getLocalNip(nip: string): Observable<Krs> {
    const localNipUrl = environment.apiUrl + '/krs/nip/' + nip;
    return this.http.get<Krs>(localNipUrl, {withCredentials: true});
  }
}
