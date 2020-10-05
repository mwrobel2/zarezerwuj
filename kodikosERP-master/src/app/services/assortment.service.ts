import { Injectable } from '@angular/core';
import { Assortment } from '../models/assortment.model';
import { Decoded } from '../models/decoded.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssortmentService {
  private assortments: Assortment[] = [];
  private assortmentsUpdated = new Subject<{
    assortments: Assortment[];
    assortmentsCount: number;
    decoded: Decoded;
  }>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL ASSORTMENT
  getAssortments(
    assortmentsPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${assortmentsPerPage}&page=${currentPage}`;
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

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.assortments];

    // httpClient is generic type so we state that we will get aray of assortments
    this.http
      .get<{
        message: string;
        assortments: Assortment[];
        maxAssortments: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/assortments' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(assortmentsData => {
          return {
            assortments: assortmentsData.assortments.map(assortment => {
              if (typeof assortment.addBy === 'undefined') {
                assortment.addBy = {};
              }
              if (typeof assortment.modBy === 'undefined') {
                assortment.modBy = {};
              }
              return {
                id: assortment._id,
                fullName: assortment.fullName,
                comments: assortment.comments,
                status: assortment.status,
                addDate: new Date(assortment.addDate),
                modDate: new Date(assortment.modDate),
                accountManager: assortment.accountManager,
                accountManagerLogin: assortment.accountManagerLogin,
                addBy: {
                  login: assortment.addBy.login,
                  name: assortment.addBy.name,
                  surname: assortment.addBy.surname,
                  email: assortment.addBy.email
                },
                modBy: {
                  login: assortment.modBy.login,
                  name: assortment.modBy.name,
                  surname: assortment.modBy.surname,
                  email: assortment.modBy.email
                },
                firms: assortment.firms,
                projects: assortment.projects,
                pliki: assortment.pliki,
                rodzajTowaru: assortment.rodzajTowaru,
                towarOpis: assortment.towarOpis,
                gatunek: assortment.gatunek,
                atest: assortment.atest,
                odbior: assortment.odbior
              };
            }),
            maxAssortments: assortmentsData.maxAssortments,
            decoded: assortmentsData.decoded
          };
        })
      )
      .subscribe(transformedAssortmentsData => {
        // this function gets data
        // positive case
        this.assortments = transformedAssortmentsData.assortments;
        this.assortmentsUpdated.next({
          assortments: [...this.assortments],
          assortmentsCount: transformedAssortmentsData.maxAssortments,
          decoded: transformedAssortmentsData.decoded
        });
      });
  }

  // GET ASSORTMENTS WITH SPECIFIC TYPE
  getAssortmentsType(assortType: string) {
    // return this.http.get<{ type: string }>(
    //   environment.apiUrl + '/assortments/type/' + type
    // );

    return this.http
      .get<{
        message: string;
        assortments: any;
        assortType: string;
        maxAssortments: number;
        decoded: Decoded;
      }>(environment.apiUrl + '/assortments/type/' + assortType, {
        withCredentials: true
      })
      .pipe(
        map(assortmentsData => {
          // console.log(assortmentsData);
          return {
            assortments: assortmentsData.assortments.map(assortment => {
              return {
                id: assortment._id,
                fullName: assortment.fullName,
                comments: assortment.comments,
                status: assortment.status,
                towarOpis: assortment.towarOpis,
                accountManager: assortment.accountManager,
                accountManagerLogin: assortment.accountManagerLogin,
                addBy: assortment.addBy,
                modBy: assortment.modBy,
                addDate: assortment.addDate,
                modDate: assortment.modDate,
                firms: assortment.firms,
                projects: assortment.projects,
                rodzajTowaru: assortment.rodzajTowaru,
                pliki: assortment.pliki,
                gatunek: assortment.gatunek,
                atest: assortment.atest,
                odbior: assortment.odbior
              };
            }),
            maxAssortments: assortmentsData.maxAssortments,
            decoded: assortmentsData.decoded
          };
        })
      )
      .subscribe(transformedAssortmentsData => {
        // this function gets data
        // positive case
        this.assortments = transformedAssortmentsData.assortments;
        this.assortmentsUpdated.next({
          assortments: [...this.assortments],
          assortmentsCount: transformedAssortmentsData.maxAssortments,
          decoded: transformedAssortmentsData.decoded
        });
      });
  }

  // GET SINGLE ASSORTMENT
  getAssortment(id: string) {
    return this.http.get<{ assortment: Assortment; decoded: Decoded }>(
      environment.apiUrl + '/assortments/' + id,
      { withCredentials: true }
    );
  }

  // I am listening to subject of assortmentsUpdated
  getAssortmentsUpdatedListener() {
    return this.assortmentsUpdated.asObservable();
  }

  // ADDING A ASSORTMENT
  addAssortment(assortmentData: Assortment) {
    const assortment: Assortment = {
      id: null,
      fullName: assortmentData.fullName,
      comments: assortmentData.comments,
      status: assortmentData.status,
      accountManager: assortmentData.accountManager,
      accountManagerLogin: assortmentData.accountManagerLogin,
      firms: assortmentData.firms,
      projects: assortmentData.projects,
      pliki: assortmentData.pliki,
      rodzajTowaru: assortmentData.rodzajTowaru,
      gatunek: assortmentData.gatunek,
      atest: assortmentData.atest,
      odbior: assortmentData.odbior
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; assortmentId: string; plikSciezka: string }>(
        environment.apiUrl + '/assortments',
        assortment,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Assortment exist') {
          alert(`Taki asortyment już jest w bazie.`);
        } else {
        this.router.navigate(['/assortmentslist']);
        }
      });
  }

  // UPDATE A ASSORTMENT
  updateAssortment(id: string, assortmentData: Assortment) {
    const assortment: Assortment = assortmentData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/assortments/' + id, assortment, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Assortment exist') {
          alert(`Taki asortyment już jest w bazie.`);
        } else {
        this.router.navigate(['/assortmentslist']);
        }
      });
  }

  // DELETE AN ASSORTMENT
  deleteAssortment(assortmentId: string) {
    return this.http.delete(
      environment.apiUrl + '/assortments/' + assortmentId,
      { withCredentials: true }
    );
  }
}
