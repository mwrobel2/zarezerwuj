import { Injectable } from '@angular/core';
import { Sekretariat } from '../models/sekretariat.model';
import { Decoded } from '../models/decoded.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SekretariatService {
  private sekretariats: Sekretariat[] = [];
  private sekretariatsUpdated = new Subject<{
    sekretariats: Sekretariat[];
    sekretariatsCount: number;
    // decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL DOCS FROM SEKRETARIAT
  getSekretariats(
    sekretariatsPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${sekretariatsPerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.comments) {
      queryParams += `&comments=${searchValues.comments}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.sekretariats];

    // httpClient is generic type so we state that we will get aray of sekretariats
    this.http
      .get<{
        message: string;
        sekretariats: Sekretariat[];
        maxSekretariats: number;
        // decoded: Decoded;
      }>(environment.apiUrl + '/sekretariat' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(sekretariatsData => {
          return {
            sekretariats: sekretariatsData.sekretariats.map(sekretariat => {
              if (typeof sekretariat.addBy === 'undefined') {
                sekretariat.addBy = {};
              }
              if (typeof sekretariat.modBy === 'undefined') {
                sekretariat.modBy = {};
              }
              return {
                id: sekretariat._id,
                idDokumentu: sekretariat.idDokumentu,
                fullName: sekretariat.fullName,
                comments: sekretariat.comments,
                status: sekretariat.status,
                addDate: new Date(sekretariat.addDate),
                modDate: new Date(sekretariat.modDate),
                accountManager: sekretariat.accountManager,
                accountManagerLogin: sekretariat.accountManagerLogin,
                addBy: {
                  login: sekretariat.addBy.login,
                  name: sekretariat.addBy.name,
                  surname: sekretariat.addBy.surname,
                  email: sekretariat.addBy.email
                },
                modBy: {
                  login: sekretariat.modBy.login,
                  name: sekretariat.modBy.name,
                  surname: sekretariat.modBy.surname,
                  email: sekretariat.modBy.email
                },
                firms: sekretariat.firms,
                projects: sekretariat.projects,
                pliki: sekretariat.pliki,
                rodzajTowaru: sekretariat.rodzajTowaru,
                // towarOpis: sekretariat.towarOpis,
                gatunek: sekretariat.gatunek,
                atest: sekretariat.atest,
                odbior: sekretariat.odbior
              };
            }),
            maxSekretariats: sekretariatsData.maxSekretariats,
            // decoded: sekretariatsData.decoded
          };
        })
      )
      .subscribe(transformedSekretariatsData => {
        // this function gets data
        // positive case
        this.sekretariats = transformedSekretariatsData.sekretariats;
        this.sekretariatsUpdated.next({
          sekretariats: [...this.sekretariats],
          sekretariatsCount: transformedSekretariatsData.maxSekretariats,
          // decoded: transformedSekretariatsData.decoded
        });
      });
  }

  // GET SEKRETARIATS WITH SPECIFIC TYPE
  getSekretariatsType(sekrType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/sekretariats/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        sekretariats: any;
        sekrType: string;
        maxSekretariats: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/sekretariat/type/' + sekrType, {
        withCredentials: true
      })
      .pipe(
        map(sekretariatsData => {
          // console.log(sekretariatsData);
          return {
            sekretariats: sekretariatsData.sekretariats.map(sekretariat => {
              return {
                id: sekretariat._id,
                fullName: sekretariat.fullName,
                comments: sekretariat.comments,
                status: sekretariat.status,
                towarOpis: sekretariat.towarOpis,
                accountManager: sekretariat.accountManager,
                accountManagerLogin: sekretariat.accountManagerLogin,
                addBy: sekretariat.addBy,
                modBy: sekretariat.modBy,
                addDate: sekretariat.addDate,
                modDate: sekretariat.modDate,
                firms: sekretariat.firms,
                projects: sekretariat.projects,
                rodzajTowaru: sekretariat.rodzajTowaru,
                pliki: sekretariat.pliki,
                gatunek: sekretariat.gatunek,
                atest: sekretariat.atest,
                odbior: sekretariat.odbior
              };
            }),
            maxSekretariats: sekretariatsData.maxSekretariats,
            decoded: sekretariatsData.decoded
          };
        })
      )
      .subscribe(transformedSekretariatsData => {
        // this function gets data
        // positive case
        this.sekretariats = transformedSekretariatsData.sekretariats;
        this.sekretariatsUpdated.next({
          sekretariats: [...this.sekretariats],
          sekretariatsCount: transformedSekretariatsData.maxSekretariats,
          // decoded: transformedSekretariatsData.decoded
        });
      });
  }

  // GET SINGLE SEKRETARIAT
  getSekretariat(id: string) {
    return this.http.get<{ sekretariat: Sekretariat }>(
      environment.apiUrl + '/sekretariat/' + id,
      { withCredentials: true }
    );
  }

  // I am listening to subject of sekretariatsUpdated
  getSekretariatsUpdatedListener() {
    return this.sekretariatsUpdated.asObservable();
  }

  // ADDING A SEKRETARIAT
  addSekretariat(sekretariatData: Sekretariat) {
    const sekretariat: Sekretariat = {
      // _id: 'alamakota',
      // id: '123456789012345678901234',
      id: null,
      idDokumentu: sekretariatData.idDokumentu,
      fullName: sekretariatData.fullName,
      comments: sekretariatData.comments,
      status: sekretariatData.status,
      accountManager: sekretariatData.accountManager,
      accountManagerLogin: sekretariatData.accountManagerLogin,
      firms: sekretariatData.firms,
      projects: sekretariatData.projects,
      pliki: sekretariatData.pliki,
      rodzajTowaru: sekretariatData.rodzajTowaru,
      gatunek: sekretariatData.gatunek,
      atest: sekretariatData.atest,
      odbior: sekretariatData.odbior
    };

    // console.log(sekretariatData);

    // I'm sending data to node server
    this.http
      .post<{ message: string; sekretariatId: string; plikSciezka: string }>(
        environment.apiUrl + '/sekretariat',
        sekretariat,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Sekretariat exist') {
          alert(`Taki dokument już jest w bazie.`);
        } else {
        this.router.navigate(['/lazy/sekretariat']);
        }
      });
  }

  // UPDATE A SEKRETARIAT
  updateSekretariat(id: string, sekretariatData: Sekretariat) {
    const sekretariat: Sekretariat = sekretariatData;
    this.http
      .put<{ message: string;}>(environment.apiUrl + '/sekretariat/' + id, sekretariat, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Sekretariat exist') {
          alert(`Taki dokument już jest w bazie.`);
        } else {
        this.router.navigate(['/sekretariat']);
        }
      });
  }

  // DELETE A SEKRETARIAT
  deleteSekretariat(sekretariatId: string) {
    return this.http.delete(
      environment.apiUrl + '/sekretariat/' + sekretariatId,
      { withCredentials: true }
    );
  }
}

