import { Injectable } from '@angular/core';
import { Szkodliwa } from '../models/szkodliwa';
// decoded info about name, surname ... from JWT
import { Decoded } from '../models/decoded.model';
// 'event emitter'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SzkodliweService {
  private szkodliwe: Szkodliwa[] = [];
  private szkodliweUpdated = new Subject<{
    szkodliwe: Szkodliwa[];
    szkodliweCount: number;
    decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL SZKODLIWE
  getSzkodliwe(
    szkodliwePerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${szkodliwePerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.comments) {
      queryParams += `&comments=${searchValues.comments}`;
    }
    if (searchValues.zaklad) {
      queryParams += `&zaklad=${searchValues.zaklad}`;
    }
    if (searchValues.surname) {
      queryParams += `&sur=${searchValues.surname}`;
    }
    if (searchValues.zagrozenie) {
      queryParams += `&zagr=${searchValues.zagrozenie}`;
    }
    if (searchValues.rok) {
      queryParams += `&rok=${searchValues.rok}`;
    }
    // TO MUSI ZOSTAĆ BO SPRAWDZANE UPRAWNIENIA NA TYM POLU
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.szkodliwe];

    // httpClient is generic type so we state that we will get aray of szkodliwe
    this.http
      .get<{
        message: string;
        szkodliwe: Szkodliwa[];
        maxSzkodliwe: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/szkodliwe' + queryParams, { withCredentials: true })
      // I am using pipe to change id na _id
      .pipe(
        map(szkodliweData => {
          return {
            szkodliwe: szkodliweData.szkodliwe.map(szkodliwa => {
              if (typeof szkodliwa.addBy === 'undefined') {
                szkodliwa.addBy = {};
              }
              if (typeof szkodliwa.modBy === 'undefined') {
                szkodliwa.modBy = {};
              }
              if (szkodliwa.addDate) {
                szkodliwa.addDate = new Date(szkodliwa.addDate);
              } else {
                szkodliwa.addDate = null;
              }
              if (szkodliwa.modDate) {
                szkodliwa.modDate = new Date(szkodliwa.modDate);
              } else {
                szkodliwa.modDate = null;
              }
              return {
                id: szkodliwa._id,
                fullName: szkodliwa.fullName,
                addDate: szkodliwa.addDate,
                modDate: szkodliwa.modDate,
                projects: szkodliwa.projects,
                firms: szkodliwa.firms,
                addBy: {
                  login: szkodliwa.addBy.login,
                  name: szkodliwa.addBy.name,
                  surname: szkodliwa.addBy.surname,
                  email: szkodliwa.addBy.email
                },
                modBy: {
                  login: szkodliwa.modBy.login,
                  name: szkodliwa.modBy.name,
                  surname: szkodliwa.modBy.surname,
                  email: szkodliwa.modBy.email
                },
                status: szkodliwa.status,
                pliki: szkodliwa.pliki,
                comments: szkodliwa.comments,
                cas: szkodliwa.cas,
                ilosc: szkodliwa.ilosc,
                jednostka: szkodliwa.jednostka,
                miejscePrzech: szkodliwa.miejscePrzech,
                osobaOdpow: szkodliwa.osobaOdpow,
                zaklad: szkodliwa.zaklad,
                rodzajeZagrozen: szkodliwa.rodzajeZagrozen,
                producent: szkodliwa.producent,
                rok: szkodliwa.rok,
                piktogramy: szkodliwa.piktogramy,
                czasNarazeniaZmiana: szkodliwa.czasNarazeniaZmiana,
                czasNarazeniaRok: szkodliwa.czasNarazeniaRok,
                szkodType: szkodliwa.szkodType,


                contrType: szkodliwa.contrType,
                shortName: szkodliwa.shortName,
                country: szkodliwa.country,
                city: szkodliwa.city,
                street: szkodliwa.street,
                postcode: szkodliwa.postcode,
                paymentDeadline: szkodliwa.paymentDeadline,
                creditLimit: szkodliwa.creditLimit,
                creditLimitCurrency: szkodliwa.creditLimitCurrency,
                ceo: szkodliwa.ceo,
                krs: szkodliwa.krs,
                regon: szkodliwa.regon,
                balance: szkodliwa.balance,
                accountManager: szkodliwa.accountManager,
                accountManagerLogin: szkodliwa.accountManagerLogin,
                streetShipping: szkodliwa.streetShipping,
                cityShipping: szkodliwa.cityShipping,
                countryShipping: szkodliwa.countryShipping,
                postcodeShipping: szkodliwa.postcodeShipping,
                anotherContacts: szkodliwa.anotherContacts,
                bankAccounts: szkodliwa.bankAccounts,
              };
            }),
            maxSzkodliwe: szkodliweData.maxSzkodliwe,
            decoded: szkodliweData.decoded
          };
        })
      )
      .subscribe(transformedSzkodliweData => {
        // this function gets data
        // positive case
        this.szkodliwe = transformedSzkodliweData.szkodliwe;
        this.szkodliweUpdated.next({
          szkodliwe: [...this.szkodliwe],
          szkodliweCount: transformedSzkodliweData.maxSzkodliwe,
          decoded: transformedSzkodliweData.decoded
        });
      });
  }

  // GET SZKODLIWE WITH SPECIFIC TYPE
  getSzkodliweType(szkodType: string) {
    return this.http
      .get<{
        message: string;
        szkodliwe: any;
        szkodType: string;
        maxSzkodliwe: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/szkodliwe/type/' + szkodType, { withCredentials: true })
      .pipe(
        map(szkodliweData => {
          return {
            szkodliwe: szkodliweData.szkodliwe.map(szkodliwa => {
              return {
                id: szkodliwa._id,
                szkodType: szkodliwa.szkodType,
                fullName: szkodliwa.fullName,
                status: szkodliwa.status,
                comments: szkodliwa.comments,
                cas: szkodliwa.cas,
                ilosc: szkodliwa.ilosc,
                jednostka: szkodliwa.jednostka,
                miejscePrzech: szkodliwa.miejscePrzech,
                osobaOdpow: szkodliwa.osobaOdpow,
                zaklad: szkodliwa.zaklad,
                rodzajeZagrozen: szkodliwa.rodzajeZagrozen,
                producent: szkodliwa.producent,
                rok: szkodliwa.rok,
                piktogramy: szkodliwa.piktogramy,
                czasNarazeniaZmiana: szkodliwa.czasNarazeniaZmiana,
                czasNarazeniaRok: szkodliwa.czasNarazeniaRok,



                contrType: szkodliwa.contrType,
                shortName: szkodliwa.shortName,
                nip: szkodliwa.nip,
                country: szkodliwa.country,
                city: szkodliwa.city,
                street: szkodliwa.street,
                postcode: szkodliwa.postcode,
                paymentDeadline: szkodliwa.paymentDeadline,
                creditLimit: szkodliwa.creditLimit,
                creditLimitCurrency: szkodliwa.creditLimitCurrency,
                ceo: szkodliwa.ceo,
                krs: szkodliwa.krs,
                regon: szkodliwa.regon,
              };
            }),
            maxSzkodliwe: szkodliweData.maxSzkodliwe,
            decoded: szkodliweData.decoded
          };
        })
      )
      .subscribe(transformedSzkodliweData => {
        this.szkodliwe = transformedSzkodliweData.szkodliwe;
        this.szkodliweUpdated.next({
          szkodliwe: [...this.szkodliwe],
          szkodliweCount: transformedSzkodliweData.maxSzkodliwe,
          decoded: transformedSzkodliweData.decoded
        });
      });
  }

  // GET SINGLE SZKODLIWA
  getSzkodliwa(id: string) {
    return this.http.get<{ szkodliwa: Szkodliwa; decoded: Decoded }>(
      environment.apiUrl + '/szkodliwe/' + id, { withCredentials: true }
    );
  }

  // I am listening to subject of szkodliweUpdated
  getSzkodliweUpdatedListener() {
    return this.szkodliweUpdated.asObservable();
  }

  // ADDING SZKODLIWA
  addSzkodliwa(szkodliwaData: Szkodliwa) {
    const szkodliwa: Szkodliwa = {
      id: null,
      fullName: szkodliwaData.fullName,
      projects: szkodliwaData.projects,
      firms: szkodliwaData.firms,
      status: szkodliwaData.status,
      pliki: szkodliwaData.pliki,
      comments: szkodliwaData.comments,
      cas: szkodliwaData.cas,
      ilosc: szkodliwaData.ilosc,
      jednostka: szkodliwaData.jednostka,
      miejscePrzech: szkodliwaData.miejscePrzech,
      osobaOdpow: szkodliwaData.osobaOdpow,
      zaklad: szkodliwaData.zaklad,
      rodzajeZagrozen: szkodliwaData.rodzajeZagrozen,
      producent: szkodliwaData.producent,
      rok: szkodliwaData.rok,
      piktogramy: szkodliwaData.piktogramy,
      czasNarazeniaZmiana: szkodliwaData.czasNarazeniaZmiana,
      czasNarazeniaRok: szkodliwaData.czasNarazeniaRok,
      szkodType: szkodliwaData.szkodType,




      contrType: szkodliwaData.contrType,
      shortName: szkodliwaData.shortName,
      nip: szkodliwaData.nip,
      country: szkodliwaData.country,
      city: szkodliwaData.city,
      street: szkodliwaData.street,
      postcode: szkodliwaData.postcode,
      paymentDeadline: szkodliwaData.paymentDeadline,
      creditLimit: szkodliwaData.creditLimit,
      creditLimitCurrency: szkodliwaData.creditLimitCurrency,
      ceo: szkodliwaData.ceo,
      krs: szkodliwaData.krs,
      regon: szkodliwaData.regon,
      accountManager: szkodliwaData.accountManager,
      accountManagerLogin: szkodliwaData.accountManagerLogin,
      balance: szkodliwaData.balance,
      streetShipping: szkodliwaData.streetShipping,
      cityShipping: szkodliwaData.cityShipping,
      countryShipping: szkodliwaData.countryShipping,
      postcodeShipping: szkodliwaData.postcodeShipping,
      anotherContacts: szkodliwaData.anotherContacts,
      bankAccounts: szkodliwaData.bankAccounts,
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; szkodliwaId: string; plikSciezka: string }>(
        environment.apiUrl + '/szkodliwe',
        szkodliwa, { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Szkodliwa exist') {
          alert(`Szkodliwa już istnieje w bazie`);
        } else {
          this.router.navigate(['/lazy/szkodliwe']);
        }
      });
  }

  // UPDATE SZKODLIWA
  updateSzkodliwa(id: string, szkodliwaData: Szkodliwa) {
    const szkodliwa: Szkodliwa = szkodliwaData;
    this.http
      .put(environment.apiUrl + '/szkodliwe/' + id, szkodliwa, { withCredentials: true })
      .subscribe(response => {
        this.router.navigate(['/lazy/szkodliwe']);
      });
  }

  // DELETE SZKODLIWA
  deleteSzkodliwa(szkodliwaId: string) {
    return this.http.delete(
      environment.apiUrl + '/szkodliwe/' + szkodliwaId, { withCredentials: true }
    );
  }
}
