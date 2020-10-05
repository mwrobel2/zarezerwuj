import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlikiService {

  constructor(
    private http: HttpClient
  ) { }


  // SZKODLIWE
  // wysyłanie plikiów - contractors
  wysylaniePlikow(formData: any) {

    // console.log(formData);
    // this.http.post<any>(environment.apiUrl + '/filesSend', formData).subscribe(
    //   (res) => console.log(res),
    //   (err) => console.log(err)
    // );

    return this.http.post(environment.apiUrl + '/filesSend/szkodliwe', formData, { withCredentials: true });
  }

  ksujPlik(nazwaPliku: string, katalog: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/' + katalog + '/' + nazwaPliku);
  }

  kasujPlikSync(nazwaPliku2: string) {
    console.log('NP', nazwaPliku2);
    console.log(environment.apiUrl);
    this.http.delete(environment.apiUrl + '/filesSend/' + nazwaPliku2);
  }

  // KONTAKTY
  wysylaniePlikowKontakty(formData: any) {
    return this.http.post(environment.apiUrl + '/filesSend', formData, { withCredentials: true });
  }

  kasujPlikKontakty(nazwaPliku: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/' + nazwaPliku);
  }


  // ASORTYMENT
  wysylaniePlikowAsortyment(formData: any) {
    return this.http.post(environment.apiUrl + '/filesSend/asortyment', formData, { withCredentials: true });
  }

  kasujPlikAsortyment(nazwaPliku: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/asortyment/' + nazwaPliku);
  }

  // PRZESYLKI
  wysylaniePlikowPrzesylki(formData: any) {
    return this.http.post(environment.apiUrl + '/filesSend/przesylki', formData, { withCredentials: true });
  }

  kasujPlikPrzesylki(nazwaPliku: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/przesylki/' + nazwaPliku);
  }

  // MAGAZYN
  wysylaniePlikowMagazyn(formData: any) {
    return this.http.post(environment.apiUrl + '/filesSend/magazyn', formData, { withCredentials: true });
  }

  kasujPlikMagazyn(nazwaPliku: string, katalog: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/' + katalog + '/' + nazwaPliku);
  }

  wysylaniePlikowPracownicy(formData: any) {
    return this.http.post(environment.apiUrl + '/filesSend/pracownicy', formData, { withCredentials: true });
  }

  kasujPlikPracownicy(nazwaPliku: string, katalog: string) {
    return this.http.delete(environment.apiUrl + '/filesSend/' + katalog + '/' + nazwaPliku);
  }
}
