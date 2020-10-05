import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NbpService {

  constructor(
    private http: HttpClient
  ) { }

// https://api.nbp.pl/api/exchangerates/rates/a/usd/
// https://api.nbp.pl/api/exchangerates/rates/c/usd/today/
// https://jsonplaceholder.typicode.com/todos/1

  getUsd() {

    // const headerDict = {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Access-Control-Allow-Headers': 'Content-Type',
    //   'Access-Control-Allow-Origin': '*'
    // }

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Allow-Headers', 'application/json');
    // headers.append('Access-Control-Allow-Origin', 'any');

    // const  headers2 = new  HttpHeaders().set('Content-Type', 'application/json');

    // const requestOptions = {
      // headers: new Headers(headerDict),
    // };


    return this.http.get(environment.apiUrl + '/nbp/usdMid');
    // .subscribe((wynik) => {
    //     console.log('wyn', wynik)
    //   });
  }

  getEur() {
    return this.http.get(environment.apiUrl + '/nbp/eurMid');
  }

  getRub() {
    return this.http.get(environment.apiUrl + '/nbp/rubMid');
  }

  getUah() {
    return this.http.get(environment.apiUrl + '/nbp/uahMid');
  }

}
