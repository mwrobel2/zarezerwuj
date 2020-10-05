import { Injectable } from '@angular/core';
import { Klucze } from '../models/klucze.model';
import { KluczeRejestr } from '../models/kluczeRejestr.model';
import { KluczeWydania } from '../models/kluczeWydania.model';
// import { Decoded } from '../models/decoded.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KluczeService {
  private klucze: Klucze[] = [];
  private kluczeUpdated = new Subject<{
    klucze: Klucze[];
    kluczeCount: number;
    // decoded: Decoded;
  }>();

  private kluczeRejestr: KluczeRejestr[] = [];
  private kluczeRejestrUpdated = new Subject<{
    kluczeRejestr: KluczeRejestr[];
    kluczeRejestrCount: number;
  }>();

  private kluczeWydania: KluczeWydania[] = [];
  private kluczeWydaniaUpdated = new Subject<{
    kluczeWydania: KluczeWydania[];
    kluczeWydaniaCount: number;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL KLUCZE
  getKlucze(
    kluczePerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${kluczePerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.imie) {
      queryParams += `&imie=${searchValues.imie}`;
    }
    if (searchValues.nazwisko) {
      queryParams += `&nazwisko=${searchValues.nazwisko}`;
    }
    if (searchValues.zaklad) {
      queryParams += `&zaklad=${searchValues.zaklad}`;
    }
    if (searchValues.nrKarty) {
      queryParams += `&nrKarty=${searchValues.nrKarty}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'klucze' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.klucze];

    // httpClient is generic type so we state that we will get aray of klucze
    this.http
      .get<{
        message: string;
        klucze: Klucze[];
        maxKlucze: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/klucze' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(kluczeData => {
          return {
            klucze: kluczeData.klucze.map(klucz => {
              if (typeof klucz.addBy === 'undefined') {
                klucz.addBy = {};
              }
              if (typeof klucz.modBy === 'undefined') {
                klucz.modBy = {};
              }
              return {
                id: klucz._id,
                fullName: klucz.fullName,
                comments: klucz.comments,
                status: klucz.status,
                addDate: new Date(klucz.addDate),
                modDate: new Date(klucz.modDate),
                accountManager: klucz.accountManager,
                accountManagerLogin: klucz.accountManagerLogin,
                addBy: {
                  login: klucz.addBy.login,
                  name: klucz.addBy.name,
                  surname: klucz.addBy.surname,
                  email: klucz.addBy.email
                },
                modBy: {
                  login: klucz.modBy.login,
                  name: klucz.modBy.name,
                  surname: klucz.modBy.surname,
                  email: klucz.modBy.email
                },
                numerKlucza: klucz.numerKlucza,
                rfidKlucza: klucz.rfidKlucza,
                login: klucz.login,
                imie: klucz.imie,
                nazwisko: klucz.nazwisko,
                dniTygodnia: klucz.dniTygodnia,
                konkretneDaty: klucz.konkretneDaty,
                zaklad: klucz.zaklad,
                nrKarty: klucz.nrKarty
              };
            }),
            maxKlucze: kluczeData.maxKlucze
            // decoded: kluczeData.decoded
          };
        })
      )
      .subscribe(transformedKluczeData => {
        // this function gets data
        // positive case
        this.klucze = transformedKluczeData.klucze;
        this.kluczeUpdated.next({
          klucze: [...this.klucze],
          kluczeCount: transformedKluczeData.maxKlucze
          // decoded: transformedKluczeData.decoded
        });
      });
  }



  // GETS ALL KLUCZEREJESTR
  getKluczeRejestr(
    kluczeRejestrPerPage: number,
    currentRejestrPage: number,
    searchRejestrValues: any
  ) {
    // for pagination
    let queryRejestrParams = `?pagesize=${kluczeRejestrPerPage}&page=${currentRejestrPage}`;
    // search
    if (searchRejestrValues.numerKlucza) {
      queryRejestrParams += `&numerKlucza=${searchRejestrValues.numerKlucza}`;
    }
    if (searchRejestrValues.rfidKlucza) {
      queryRejestrParams += `&rfidKlucza=${searchRejestrValues.rfidKlucza}`;
    }
    if (searchRejestrValues.comments) {
      queryRejestrParams += `&comments=${searchRejestrValues.comments}`;
    }
    if (searchRejestrValues.accountManagerLogin) {
      queryRejestrParams += `&accountManagerLogin=${searchRejestrValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kluczeRejestr' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.kluczeRejestr];

    // httpClient is generic type so we state that we will get aray of klucze
    this.http
      .get<{
        message: string;
        kluczeRejestr: KluczeRejestr[];
        maxKluczeRejestr: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/kluczerejestr' + queryRejestrParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(kluczeRejestrData => {
          return {
            kluczeRejestr: kluczeRejestrData.kluczeRejestr.map(kluczRejestr => {
              if (typeof kluczRejestr.addBy === 'undefined') {
                kluczRejestr.addBy = {};
              }
              if (typeof kluczRejestr.modBy === 'undefined') {
                kluczRejestr.modBy = {};
              }
              return {
                id: kluczRejestr._id,
                comments: kluczRejestr.comments,
                addDate: new Date(kluczRejestr.addDate),
                modDate: new Date(kluczRejestr.modDate),
                accountManager: kluczRejestr.accountManager,
                accountManagerLogin: kluczRejestr.accountManagerLogin,
                addBy: {
                  login: kluczRejestr.addBy.login,
                  name: kluczRejestr.addBy.name,
                  surname: kluczRejestr.addBy.surname,
                  email: kluczRejestr.addBy.email
                },
                modBy: {
                  login: kluczRejestr.modBy.login,
                  name: kluczRejestr.modBy.name,
                  surname: kluczRejestr.modBy.surname,
                  email: kluczRejestr.modBy.email
                },
                numerKlucza: kluczRejestr.numerKlucza,
                rfidKlucza: kluczRejestr.rfidKlucza,
                liczbaWydan: kluczRejestr.liczbaWydan,
                aktywny: kluczRejestr.aktywny
              };
            }),
            maxKluczeRejestr: kluczeRejestrData.maxKluczeRejestr
            // decoded: kluczeRejestrData.decoded
          };
        })
      )
      .subscribe(transformedKluczeRejestrData => {
        // this function gets data
        // positive case
        this.kluczeRejestr = transformedKluczeRejestrData.kluczeRejestr;
        this.kluczeRejestrUpdated.next({
          kluczeRejestr: [...this.kluczeRejestr],
          kluczeRejestrCount: transformedKluczeRejestrData.maxKluczeRejestr
        });
      });
  }


  // GETS ALL KLUCZEWYDANIA
  getKluczeWydania(
    kluczeWydaniaPerPage: number,
    currentWydaniaPage: number,
    searchWydaniaValues: any
  ) {
    // for pagination
    let queryWydaniaParams = `?pagesize=${kluczeWydaniaPerPage}&page=${currentWydaniaPage}`;
    // search
    if (searchWydaniaValues.numerKlucza) {
      queryWydaniaParams += `&numerKlucza=${searchWydaniaValues.numerKlucza}`;
    }
    if (searchWydaniaValues.rfidKlucza) {
      queryWydaniaParams += `&rfidKlucza=${searchWydaniaValues.rfidKlucza}`;
    }
    if (searchWydaniaValues.nazwisko) {
      queryWydaniaParams += `&nazwisko=${searchWydaniaValues.nazwisko}`;
    }
    if (searchWydaniaValues.operacja) {
      queryWydaniaParams += `&operacja=${searchWydaniaValues.operacja}`;
    }
    if (searchWydaniaValues.dataWydania) {
      queryWydaniaParams += `&dataWydania=${searchWydaniaValues.dataWydania}`;
    }
    if (searchWydaniaValues.accountManagerLogin) {
      queryWydaniaParams += `&accountManagerLogin=${searchWydaniaValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kluczeWydania' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.kluczeWydania];

    // httpClient is generic type so we state that we will get aray of klucze
    this.http
      .get<{
        message: string;
        kluczeWydania: KluczeWydania[];
        maxKluczeWydania: number;
      }>(environment.apiUrl + '/kluczewydania' + queryWydaniaParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(kluczeWydaniaData => {
          return {
            kluczeWydania: kluczeWydaniaData.kluczeWydania.map(kluczWydania => {
              if (typeof kluczWydania.addBy === 'undefined') {
                kluczWydania.addBy = {};
              }
              if (typeof kluczWydania.modBy === 'undefined') {
                kluczWydania.modBy = {};
              }
              return {
                id: kluczWydania._id,
                addDate: new Date(kluczWydania.addDate),
                modDate: new Date(kluczWydania.modDate),
                accountManager: kluczWydania.accountManager,
                accountManagerLogin: kluczWydania.accountManagerLogin,
                addBy: {
                  login: kluczWydania.addBy.login,
                  name: kluczWydania.addBy.name,
                  surname: kluczWydania.addBy.surname,
                  email: kluczWydania.addBy.email
                },
                modBy: {
                  login: kluczWydania.modBy.login,
                  name: kluczWydania.modBy.name,
                  surname: kluczWydania.modBy.surname,
                  email: kluczWydania.modBy.email
                },
                numerKlucza: kluczWydania.numerKlucza,
                rfidKlucza: kluczWydania.rfidKlucza,
                rfidKarty: kluczWydania.rfidKarty,
                imie: kluczWydania.imie,
                nazwisko: kluczWydania.nazwisko,
                dzial: kluczWydania.dzial,
                dataWydania: kluczWydania.dataWydania,
                dataZwrotu: kluczWydania.dataZwrotu,
                operacja: kluczWydania.operacja,
                wpisAutomatyczny: kluczWydania.wpisAutomatyczny
              };
            }),
            maxKluczeWydania: kluczeWydaniaData.maxKluczeWydania
            // decoded: kluczeWydaniaData.decoded
          };
        })
      )
      .subscribe(transformedKluczeWydaniaData => {
        // this function gets data
        // positive case
        this.kluczeWydania = transformedKluczeWydaniaData.kluczeWydania;
        this.kluczeWydaniaUpdated.next({
          kluczeWydania: [...this.kluczeWydania],
          kluczeWydaniaCount: transformedKluczeWydaniaData.maxKluczeWydania
        });
      });
  }


  // GET KLUCZE WITH SPECIFIC TYPE
  getKluczeType(kluczType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/klucze/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        klucze: any;
        kluczType: string;
        maxKlucze: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/klucze/type/' + kluczType, {
        withCredentials: true
      })
      .pipe(
        map(kluczeData => {
          // console.log(kluczeData);
          return {
            klucze: kluczeData.klucze.map(klucz => {
              return {
                id: klucz._id,
                fullName: klucz.fullName,
                comments: klucz.comments,
                status: klucz.status,
                towarOpis: klucz.towarOpis,
                accountManager: klucz.accountManager,
                accountManagerLogin: klucz.accountManagerLogin,
                addBy: klucz.addBy,
                modBy: klucz.modBy,
                addDate: klucz.addDate,
                modDate: klucz.modDate,
                numerKlucza: klucz.numerKlucza,
                rfidKlucza: klucz.rfidKlucza,
                login: klucz.login,
                imie: klucz.imie,
                nazwisko: klucz.nazwisko,
                dniTygodnia: klucz.dniTygodnia,
                konkretneDaty: klucz.konkretneDaty,
                zaklad: klucz.zaklad,
                nrKarty: klucz.nrKarty
              };
            }),
            maxKlucze: kluczeData.maxKlucze
            // decoded: kluczeData.decoded
          };
        })
      )
      .subscribe(transformedKluczeData => {
        // this function gets data
        // positive case
        this.klucze = transformedKluczeData.klucze;
        this.kluczeUpdated.next({
          klucze: [...this.klucze],
          kluczeCount: transformedKluczeData.maxKlucze
          // decoded: transformedKluczeData.decoded
        });
      });
  }

  // GET SINGLE KLUCZ
  getKlucz(id: string) {
    return this.http.get<{ klucze: Klucze }>(
      environment.apiUrl + '/klucze/' + id,
      { withCredentials: true }
    );
  }

  // GET SINGLE KLUCZREJESTR
  getKluczRejestr(id: string) {
    console.log('SERVICE KR_ID:', id);
    return this.http.get<{ kluczeRejestr: KluczeRejestr }>(
      environment.apiUrl + '/kluczerejestr/' + id,
      { withCredentials: true }
    );
  }

  // GET SINGLE KLUCZWYDANIA
  getKluczWydania(id: string) {
    return this.http.get<{ kluczeWydania: KluczeWydania }>(
      environment.apiUrl + '/kluczewydania/' + id,
      { withCredentials: true }
    );
  }

  // I am listening to subject of kluczeUpdated
  getKluczeUpdatedListener() {
    return this.kluczeUpdated.asObservable();
  }

  // I am listening to subject of kluczeRejestrUpdated
  getKluczeRejestrUpdatedListener() {
    return this.kluczeRejestrUpdated.asObservable();
  }

  // I am listening to subject of kluczeWydaniaUpdated
  getKluczeWydaniaUpdatedListener() {
    return this.kluczeWydaniaUpdated.asObservable();
  }

  // ADDING KLUCZE
  addKlucz(kluczeData: Klucze) {
    const klucze: Klucze = {
      id: null,
      fullName: kluczeData.fullName,
      // comments: kluczeData.comments,
      // status: kluczeData.status,
      accountManager: kluczeData.accountManager,
      accountManagerLogin: kluczeData.accountManagerLogin,
      aktywny: kluczeData.aktywny,
      // addBy: kluczeData.addBy,
      // modBy: kluczeData.modBy,
      // addDate: kluczeData.addDate,
      // modDate: kluczeData.modDate,
      numerKlucza: kluczeData.numerKlucza,
      rfidKlucza: kluczeData.rfidKlucza,
      login: kluczeData.login,
      imie: kluczeData.imie,
      nazwisko: kluczeData.nazwisko,
      // dniTygodnia: kluczeData.dniTygodnia,
      // konkretneDaty: kluczeData.konkretneDaty,
      zaklad: kluczeData.zaklad,
      nrKarty: kluczeData.nrKarty
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; kluczId: string; plikSciezka: string }>(
        environment.apiUrl + '/klucze',
        klucze,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Klucz exist') {
          alert(`Taki klucz już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/klucze']);
        }
      });
  }


  // ADDING KLUCZREJESTR
  addKluczRejestr(kluczeRejestrData: KluczeRejestr) {
    const kluczeRejestr: KluczeRejestr = {
      id: null,
      accountManager: kluczeRejestrData.accountManager,
      accountManagerLogin: kluczeRejestrData.accountManagerLogin,
      numerKlucza: kluczeRejestrData.numerKlucza,
      rfidKlucza: kluczeRejestrData.rfidKlucza,
      liczbaWydan: kluczeRejestrData.liczbaWydan,
      comments: kluczeRejestrData.comments,
      aktywny: kluczeRejestrData.aktywny
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; kluczId: string; plikSciezka: string }>(
        environment.apiUrl + '/kluczerejestr',
        kluczeRejestr,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'KluczRejestr exist') {
          alert(`Taki kluczRejestr już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/kluczerejestr']);
        }
      });
  }


  // ADDING KLUCZWYDANIA
  addKluczWydania(kluczeWydaniaData: KluczeWydania) {
    const kluczeWydania: KluczeWydania = {
      id: null,
      accountManager: kluczeWydaniaData.accountManager,
      accountManagerLogin: kluczeWydaniaData.accountManagerLogin,
      numerKlucza: kluczeWydaniaData.numerKlucza,
      rfidKlucza: kluczeWydaniaData.rfidKlucza,
      rfidKarty: kluczeWydaniaData.rfidKarty,
      imie: kluczeWydaniaData.imie,
      nazwisko: kluczeWydaniaData.nazwisko,
      dzial: kluczeWydaniaData.dzial,
      dataWydania: kluczeWydaniaData.dataWydania,
      dataZwrotu: kluczeWydaniaData.dataZwrotu,
      operacja: kluczeWydaniaData.operacja,
      wpisAutomatyczny: kluczeWydaniaData.wpisAutomatyczny
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; kluczId: string; plikSciezka: string }>(
        environment.apiUrl + '/kluczewydania',
        kluczeWydania,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'KluczWydania exist') {
          alert(`Taki kluczWydania już jest w bazie.`);
        } else if (!kluczeWydaniaData.wpisAutomatyczny) {
          this.router.navigate(['/rrwmodule/kluczewydania']);
        }
      });
  }

  // UPDATE A KLUCZE
  updateKlucz(id: string, kluczeData: Klucze) {
    const klucze: Klucze = kluczeData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/klucze/' + id, klucze, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Klucze exist') {
          alert(`Taki klucz już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/klucze']);
        }
      });
  }

  // UPDATE A KLUCZREJESTR
  updateKluczRejestr(id: string, kluczeRejestrData: KluczeRejestr) {
    const kluczeRejestr: KluczeRejestr = kluczeRejestrData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/kluczerejestr/' + id, kluczeRejestr, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Klucze rejestr exist') {
          alert(`Taki kluczRejestr już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/kluczerejestr']);
        }
      });
  }


  // UPDATE A KLUCZWYDANIA
  updateKluczWydania(id: string, kluczeWydaniaData: KluczeWydania) {
    const kluczeWydania: KluczeWydania = kluczeWydaniaData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/kluczewydania/' + id, kluczeWydania, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Klucze wydania exist') {
          alert(`Taki kluczWydania już jest w bazie.`);
        } else if (!kluczeWydaniaData.wpisAutomatyczny) {
          this.router.navigate(['/rrwmodule/kluczewydania']);
        }
      });
  }

  // DELETE KLUCZ
  deleteKlucz(kluczId: string) {
    return this.http.delete(
      environment.apiUrl + '/klucze/' + kluczId,
      { withCredentials: true }
    );
  }

  // DELETE KLUCZ REJESTR
  deleteKluczRejestr(kluczId: string) {
    return this.http.delete(
      environment.apiUrl + '/kluczerejestr/' + kluczId,
      { withCredentials: true }
    );
  }

  // DELETE KLUCZ WYDANIA
  deleteKluczWydania(kluczId: string) {
    return this.http.delete(
      environment.apiUrl + '/kluczewydania/' + kluczId,
      { withCredentials: true }
    );
  }
}

