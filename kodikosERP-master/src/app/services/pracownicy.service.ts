import { Injectable } from '@angular/core';
import { Pracownicy } from '../models/pracownicy.model';
import { Decoded } from '../models/decoded.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PracownicyService {

  private pracownicys: Pracownicy[] = [];
  private pracownicysUpdated = new Subject<{
    pracownicys: Pracownicy[];
    pracownicysCount: number;
    // decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL DOCS FROM PRACOWNICY
  getPracownicys(
    pracownicysPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${pracownicysPerPage}&page=${currentPage}`;
    // search
    if (searchValues.name) {
      queryParams += `&fname=${searchValues.name}`;
    }
    if (searchValues.surname) {
      queryParams += `&surname=${searchValues.surname}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }
    if (searchValues.username) {
      queryParams += `&username=${searchValues.username}`;
    }
    if (searchValues.departament) {
      queryParams += `&departament=${searchValues.departament}`;
    }
    if (searchValues.email) {
      queryParams += `&email=${searchValues.email}`;
    }

    // zwracam kopię tablicy tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.pracownicys];

    // httpClient is generic type so we state that we will get aray of pracownicys
    this.http
      .get<{
        message: string;
        pracownicys: Pracownicy[];
        maxPracownicys: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/pracownicy' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(pracownicysData => {
          return {
            pracownicys: pracownicysData.pracownicys.map(pracownicy => {
              if (typeof pracownicy.addBy === 'undefined') {
                pracownicy.addBy = {};
              }
              if (typeof pracownicy.modBy === 'undefined') {
                pracownicy.modBy = {};
              }
              return {
                id: pracownicy._id,
                addDate: new Date(pracownicy.addDate),
                modDate: new Date(pracownicy.modDate),
                accountManager: pracownicy.accountManager,
                accountManagerLogin: pracownicy.accountManagerLogin,
                addBy: {
                  login: pracownicy.addBy.login,
                  name: pracownicy.addBy.name,
                  surname: pracownicy.addBy.surname,
                  email: pracownicy.addBy.email
                },
                modBy: {
                  login: pracownicy.modBy.login,
                  name: pracownicy.modBy.name,
                  surname: pracownicy.modBy.surname,
                  email: pracownicy.modBy.email
                },
                login: pracownicy.login,
                username: pracownicy.username,
                name: pracownicy.name,
                drugieImie: pracownicy.drugieImie,
                surname: pracownicy.surname,
                displayName: pracownicy.displayName,
                plec: pracownicy.plec,
                nazwiskoRodowe: pracownicy.nazwiskoRodowe,
                nazwiskoMatki: pracownicy.nazwiskoMatki,
                imieMatki: pracownicy.imieMatki,
                imieOjca: pracownicy.imieOjca,
                dataUrodzenia: pracownicy.dataUrodzenia,
                miejsceUrodzenia: pracownicy.miejsceUrodzenia,
                obcokrajowiec: pracownicy.obcokrajowiec,
                kartaStalegoPobytu: pracownicy.kartaStalegoPobytu,
                narodowosc: pracownicy.narodowosc,
                obywatelstwo: pracownicy.obywatelstwo,
                dowodOsobisty: pracownicy.dowodOsobisty,
                dowodWydanyPrzez: pracownicy.dowodWydanyPrzez,
                paszport: pracownicy.paszport,
                paszportWydanyPrzez: pracownicy.paszportWydanyPrzez,

                email: pracownicy.email,
                phone: pracownicy.phone,
                department: pracownicy.department,

                pesel: pracownicy.pesel,
                nip: pracownicy.nip,
                urzadSkarbowy: pracownicy.urzadSkarbowy,
                wyksztalcenie: pracownicy.wyksztalcenie,
                zawodWyuczony: pracownicy.zawodWyuczony,

                pliki: pracownicy.pliki,
                uwagi: pracownicy.uwagi,
                aktualniePracujacy: pracownicy.aktualniePracujacy,
                status: pracownicy.status,

                nrKartyWejsciowej: pracownicy.nrKartyWejsciowej,
                nrKartyParkingowej: pracownicy.nrKartyParkingowej,
                klucze: pracownicy.klucze,

                rachunkiBankowe: pracownicy.rachunkiBankowe,
                stanowiska: pracownicy.stanowiska,
                umowyoPrace: pracownicy.umowyoPrace,
                adresyZamieszkania: pracownicy.adresyZamieszkania,
                przebiegZatrudnienia: pracownicy.przebiegZatrudnienia,
                dzieci: pracownicy.dzieci,
                oswiadczenia: pracownicy.oswiadczenia,
                zezwolenia: pracownicy.zezwolenia,
                kartyPobytu: pracownicy.kartyPobytu,
                paszporty: pracownicy.paszporty,
                badaniaOkresowe: pracownicy.badaniaOkresowe,
                szkoleniaBHP: pracownicy.szkoleniaBHP,
                dodatkoweKwalifikacje: pracownicy.dodatkoweKwalifikacje,
                wyroznieniaKary: pracownicy.wyroznieniaKary
              };
            }),
            maxPracownicys: pracownicysData.maxPracownicys,
            // decoded: pracownicysData.decoded
          };
        })
      )
      .subscribe(transformedPracownicysData => {
        // this function gets data
        // positive case
        this.pracownicys = transformedPracownicysData.pracownicys;
        this.pracownicysUpdated.next({
          pracownicys: [...this.pracownicys],
          pracownicysCount: transformedPracownicysData.maxPracownicys,
          // decoded: transformedPracownicysData.decoded
        });
      });
  }

  // GETS ALL CONTRACTORS WITHOUT PARAMS
  getPracownicySimple() {
    return this.http.get<{ message: string; pracownicy: Pracownicy[]; }>(environment.apiUrl + '/pracownicy', { withCredentials: true });
  }


  // GETS ALL DOCS FROM PRACOWNICY WITHOUT PARAMS - UPDATE OBSERVABLE
  getPracownicysAllObs(
  ) {
    this.http
      .get<{
        message: string;
        pracownicys: Pracownicy[];
        maxPracownicys: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/pracownicy', {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(pracownicysData => {
          return {
            pracownicys: pracownicysData.pracownicys.map(pracownicy => {
              if (typeof pracownicy.addBy === 'undefined') {
                pracownicy.addBy = {};
              }
              if (typeof pracownicy.modBy === 'undefined') {
                pracownicy.modBy = {};
              }
              return {
                id: pracownicy._id,
                addDate: new Date(pracownicy.addDate),
                modDate: new Date(pracownicy.modDate),
                accountManager: pracownicy.accountManager,
                accountManagerLogin: pracownicy.accountManagerLogin,
                addBy: {
                  login: pracownicy.addBy.login,
                  name: pracownicy.addBy.name,
                  surname: pracownicy.addBy.surname,
                  email: pracownicy.addBy.email
                },
                modBy: {
                  login: pracownicy.modBy.login,
                  name: pracownicy.modBy.name,
                  surname: pracownicy.modBy.surname,
                  email: pracownicy.modBy.email
                },
                login: pracownicy.login,
                username: pracownicy.username,
                name: pracownicy.name,
                drugieImie: pracownicy.drugieImie,
                surname: pracownicy.surname,
                displayName: pracownicy.displayName,
                plec: pracownicy.plec,
                nazwiskoRodowe: pracownicy.nazwiskoRodowe,
                nazwiskoMatki: pracownicy.nazwiskoMatki,
                imieMatki: pracownicy.imieMatki,
                imieOjca: pracownicy.imieOjca,
                dataUrodzenia: pracownicy.dataUrodzenia,
                miejsceUrodzenia: pracownicy.miejsceUrodzenia,
                obcokrajowiec: pracownicy.obcokrajowiec,
                kartaStalegoPobytu: pracownicy.kartaStalegoPobytu,
                narodowosc: pracownicy.narodowosc,
                obywatelstwo: pracownicy.obywatelstwo,
                dowodOsobisty: pracownicy.dowodOsobisty,
                dowodWydanyPrzez: pracownicy.dowodWydanyPrzez,
                paszport: pracownicy.paszport,
                paszportWydanyPrzez: pracownicy.paszportWydanyPrzez,

                email: pracownicy.email,
                phone: pracownicy.phone,
                department: pracownicy.department,

                pesel: pracownicy.pesel,
                nip: pracownicy.nip,
                urzadSkarbowy: pracownicy.urzadSkarbowy,
                wyksztalcenie: pracownicy.wyksztalcenie,
                zawodWyuczony: pracownicy.zawodWyuczony,

                pliki: pracownicy.pliki,
                uwagi: pracownicy.uwagi,
                aktualniePracujacy: pracownicy.aktualniePracujacy,
                status: pracownicy.status,

                nrKartyWejsciowej: pracownicy.nrKartyWejsciowej,
                nrKartyParkingowej: pracownicy.nrKartyParkingowej,
                klucze: pracownicy.klucze,

                rachunkiBankowe: pracownicy.rachunkiBankowe,
                stanowiska: pracownicy.stanowiska,
                umowyoPrace: pracownicy.umowyoPrace,
                adresyZamieszkania: pracownicy.adresyZamieszkania,
                przebiegZatrudnienia: pracownicy.przebiegZatrudnienia,
                dzieci: pracownicy.dzieci,
                oswiadczenia: pracownicy.oswiadczenia,
                zezwolenia: pracownicy.zezwolenia,
                kartyPobytu: pracownicy.kartyPobytu,
                paszporty: pracownicy.paszporty,
                badaniaOkresowe: pracownicy.badaniaOkresowe,
                szkoleniaBHP: pracownicy.szkoleniaBHP,
                dodatkoweKwalifikacje: pracownicy.dodatkoweKwalifikacje,
                wyroznieniaKary: pracownicy.wyroznieniaKary
              };
            }),
            maxPracownicys: pracownicysData.maxPracownicys,
            // decoded: pracownicysData.decoded
          };
        })
      )
      .subscribe(transformedPracownicysData => {
        // this function gets data
        // positive case
        this.pracownicys = transformedPracownicysData.pracownicys;
        this.pracownicysUpdated.next({
          pracownicys: [...this.pracownicys],
          pracownicysCount: transformedPracownicysData.maxPracownicys,
          // decoded: transformedPracownicysData.decoded
        });
      });
  }

  // GET PRACOWNICYS WITH SPECIFIC TYPE
  getPracownicysType(pracType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/pracownicys/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        pracownicys: any;
        pracType: string;
        maxPracownicys: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/pracownicy/type/' + pracType, {
        withCredentials: true
      })
      .pipe(
        map(pracownicysData => {
          // console.log(pracownicysData);
          return {
            pracownicys: pracownicysData.pracownicys.map(pracownicy => {
              return {
                id: pracownicy._id,
                accountManager: pracownicy.accountManager,
                accountManagerLogin: pracownicy.accountManagerLogin,
                addBy: pracownicy.addBy,
                modBy: pracownicy.modBy,
                addDate: pracownicy.addDate,
                modDate: pracownicy.modDate,
                login: pracownicy.login,
                username: pracownicy.username,
                name: pracownicy.name,
                drugieImie: pracownicy.drugieImie,
                surname: pracownicy.surname,
                displayName: pracownicy.displayName,
                plec: pracownicy.plec,
                nazwiskoRodowe: pracownicy.nazwiskoRodowe,
                nazwiskoMatki: pracownicy.nazwiskoMatki,
                imieMatki: pracownicy.imieMatki,
                imieOjca: pracownicy.imieOjca,
                dataUrodzenia: pracownicy.dataUrodzenia,
                miejsceUrodzenia: pracownicy.miejsceUrodzenia,
                obcokrajowiec: pracownicy.obcokrajowiec,
                kartaStalegoPobytu: pracownicy.kartaStalegoPobytu,
                narodowosc: pracownicy.narodowosc,
                obywatelstwo: pracownicy.obywatelstwo,
                dowodOsobisty: pracownicy.dowodOsobisty,
                dowodWydanyPrzez: pracownicy.dowodWydanyPrzez,
                paszport: pracownicy.paszport,
                paszportWydanyPrzez: pracownicy.paszportWydanyPrzez,

                email: pracownicy.email,
                phone: pracownicy.phone,
                department: pracownicy.department,

                pesel: pracownicy.pesel,
                nip: pracownicy.nip,
                urzadSkarbowy: pracownicy.urzadSkarbowy,
                wyksztalcenie: pracownicy.wyksztalcenie,
                zawodWyuczony: pracownicy.zawodWyuczony,

                pliki: pracownicy.pliki,
                uwagi: pracownicy.uwagi,
                aktualniePracujacy: pracownicy.aktualniePracujacy,
                status: pracownicy.status,

                nrKartyWejsciowej: pracownicy.nrKartyWejsciowej,
                nrKartyParkingowej: pracownicy.nrKartyParkingowej,
                klucze: pracownicy.klucze,

                rachunkiBankowe: pracownicy.rachunkiBankowe,
                stanowiska: pracownicy.stanowiska,
                umowyoPrace: pracownicy.umowyoPrace,
                adresyZamieszkania: pracownicy.adresyZamieszkania,
                przebiegZatrudnienia: pracownicy.przebiegZatrudnienia,
                dzieci: pracownicy.dzieci,
                oswiadczenia: pracownicy.oswiadczenia,
                zezwolenia: pracownicy.zezwolenia,
                kartyPobytu: pracownicy.kartyPobytu,
                paszporty: pracownicy.paszporty,
                badaniaOkresowe: pracownicy.badaniaOkresowe,
                szkoleniaBHP: pracownicy.szkoleniaBHP,
                dodatkoweKwalifikacje: pracownicy.dodatkoweKwalifikacje,
                wyroznieniaKary: pracownicy.wyroznieniaKary

              };
            }),
            maxPracownicys: pracownicysData.maxPracownicys,
            decoded: pracownicysData.decoded
          };
        })
      )
      .subscribe(transformedPracownicysData => {
        // this function gets data
        // positive case
        this.pracownicys = transformedPracownicysData.pracownicys;
        this.pracownicysUpdated.next({
          pracownicys: [...this.pracownicys],
          pracownicysCount: transformedPracownicysData.maxPracownicys,
          // decoded: transformedPracownicysData.decoded
        });
      });
  }

  // GET SINGLE PRACOWNICY
  getPracownicy(id: string) {
    return this.http.get<{ pracownicy: Pracownicy }>(
      environment.apiUrl + '/pracownicy/' + id,
      { withCredentials: true }
    );
  }

  // I am listening to subject of pracownicysUpdated
  getPracownicysUpdatedListener() {
    return this.pracownicysUpdated.asObservable();
  }

  // ADDING A PRACOWNICY
  addPracownicy(pracownicyData: Pracownicy) {
    const pracownicy: Pracownicy = {
      // _id: 'alamakota',
      // id: '123456789012345678901234',
      id: null,
      // accountManager: pracownicyData.accountManager,
      // accountManagerLogin: pracownicyData.accountManagerLogin,
      login: pracownicyData.login,
      username: pracownicyData.username,
      name: pracownicyData.name,
      drugieImie: pracownicyData.drugieImie,
      surname: pracownicyData.surname,
      displayName: pracownicyData.displayName,
      plec: pracownicyData.plec,
      nazwiskoRodowe: pracownicyData.nazwiskoRodowe,
      nazwiskoMatki: pracownicyData.nazwiskoMatki,
      imieMatki: pracownicyData.imieMatki,
      imieOjca: pracownicyData.imieOjca,
      dataUrodzenia: pracownicyData.dataUrodzenia,
      miejsceUrodzenia: pracownicyData.miejsceUrodzenia,
      obcokrajowiec: pracownicyData.obcokrajowiec,
      kartaStalegoPobytu: pracownicyData.kartaStalegoPobytu,
      narodowosc: pracownicyData.narodowosc,
      obywatelstwo: pracownicyData.obywatelstwo,
      dowodOsobisty: pracownicyData.dowodOsobisty,
      dowodWydanyPrzez: pracownicyData.dowodWydanyPrzez,
      paszport: pracownicyData.paszport,
      paszportWydanyPrzez: pracownicyData.paszportWydanyPrzez,

      email: pracownicyData.email,
      phone: pracownicyData.phone,
      department: pracownicyData.department,

      pesel: pracownicyData.pesel,
      nip: pracownicyData.nip,
      urzadSkarbowy: pracownicyData.urzadSkarbowy,
      wyksztalcenie: pracownicyData.wyksztalcenie,
      zawodWyuczony: pracownicyData.zawodWyuczony,

      pliki: pracownicyData.pliki,
      uwagi: pracownicyData.uwagi,
      aktualniePracujacy: pracownicyData.aktualniePracujacy,
      status: pracownicyData.status,

      nrKartyWejsciowej: pracownicyData.nrKartyWejsciowej,
      nrKartyParkingowej: pracownicyData.nrKartyParkingowej,
      klucze: pracownicyData.klucze,

      rachunkiBankowe: pracownicyData.rachunkiBankowe,
      stanowiska: pracownicyData.stanowiska,
      umowyoPrace: pracownicyData.umowyoPrace,
      adresyZamieszkania: pracownicyData.adresyZamieszkania,
      przebiegZatrudnienia: pracownicyData.przebiegZatrudnienia,
      dzieci: pracownicyData.dzieci,
      oswiadczenia: pracownicyData.oswiadczenia,
      zezwolenia: pracownicyData.zezwolenia,
      kartyPobytu: pracownicyData.kartyPobytu,
      paszporty: pracownicyData.paszporty,
      badaniaOkresowe: pracownicyData.badaniaOkresowe,
      szkoleniaBHP: pracownicyData.szkoleniaBHP,
      dodatkoweKwalifikacje: pracownicyData.dodatkoweKwalifikacje,
      wyroznieniaKary: pracownicyData.wyroznieniaKary
    };

    // console.log(pracownicy);

    // I'm sending data to node server
    this.http
      .post<{ message: string; pracownicyId: string; plikSciezka: string }>(
        environment.apiUrl + '/pracownicy',
        pracownicy,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Pracownicy exist') {
          alert(`Taki pracownik już jest w bazie.`);
        } else {
          this.router.navigate(['/lazy/pracownicy']);
        }
      });
  }

  // UPDATE A PRACOWNICY
  updatePracownicy(id: string, pracownicyData: Pracownicy) {
    const pracownicy: Pracownicy = pracownicyData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/pracownicy/' + id, pracownicy, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Pracownicy exist') {
          alert(`Taki pracownik już jest w bazie.`);
        } else {
          this.router.navigate(['/lazy/pracownicy']);
        }
      });
  }

  // DELETE A PRACOWNICY
  deletePracownicy(pracownicyId: string) {
    return this.http.delete(
      environment.apiUrl + '/pracownicy/' + pracownicyId,
      { withCredentials: true }
    );
  }
}

