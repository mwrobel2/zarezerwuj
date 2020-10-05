import { Injectable } from '@angular/core';
import { Przesylki } from '../models/przesylki.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrzesylkiService {

  private przesylki: Przesylki[] = [];
  private przesylkiUpdated = new Subject<{
    przesylki: Przesylki[];
    przesylkiCount: number;
  }>();

  constructor(
    private router: Router,
    private http: HttpClient) { }


  // GETS ALL PRZESYLKI
  getPrzesylki(
    przesylkiPerPage: number,
    currentPage: number,
    searchValues: any
  ) {
    // for pagination
    let queryParams = `?pagesize=${przesylkiPerPage}&page=${currentPage}`;
    // search
    if (searchValues.fullName) {
      queryParams += `&fname=${searchValues.fullName}`;
    }
    if (searchValues.nrZapotrzebowania) {
      queryParams += `&nrZapotrzebowania=${searchValues.nrZapotrzebowania}`;
    }
    if (searchValues.status) {
      queryParams += `&status=${searchValues.status}`;
    }
    if (searchValues.doKogo) {
      queryParams += `&doKogo=${searchValues.doKogo}`;
    }
    if (searchValues.comments) {
      queryParams += `&comments=${searchValues.comments}`;
    }
    if (searchValues.accountManagerLogin) {
      queryParams += `&accountManagerLogin=${searchValues.accountManagerLogin}`;
    }

    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.przesylki];

    // httpClient is generic type so we state that we will get aray of przesylki
    this.http
      .get<{
        message: string;
        przesylki: Przesylki[];
        maxPrzesylki: number;
      }>(environment.apiUrl + '/przesylki' + queryParams, {
        withCredentials: true
      })
      // I am using pipe to change id na _id
      .pipe(
        map(przesylkiData => {
          return {
            przesylki: przesylkiData.przesylki.map(przesylka => {
              if (typeof przesylka.addBy === 'undefined') {
                przesylka.addBy = {};
              }
              if (typeof przesylka.modBy === 'undefined') {
                przesylka.modBy = {};
              }
              return {
                id: przesylka._id,
                fullName: przesylka.fullName,
                comments: przesylka.comments,
                status: przesylka.status,
                addDate: new Date(przesylka.addDate),
                modDate: new Date(przesylka.modDate),
                accountManager: przesylka.accountManager,
                accountManagerLogin: przesylka.accountManagerLogin,
                addBy: {
                  login: przesylka.addBy.login,
                  name: przesylka.addBy.name,
                  surname: przesylka.addBy.surname,
                  email: przesylka.addBy.email
                },
                modBy: {
                  login: przesylka.modBy.login,
                  name: przesylka.modBy.name,
                  surname: przesylka.modBy.surname,
                  email: przesylka.modBy.email
                },
                firms: przesylka.firms,
                projects: przesylka.projects,
                pliki: przesylka.pliki,
                nrZapotrzebowania: przesylka.nrZapotrzebowania,
                doKogo: przesylka.doKogo,
                doKogoEmails: przesylka.doKogoEmails,
                terminDostawy: przesylka.terminDostawy,
                rodzajPlatnosci: przesylka.rodzajPlatnosci,
                kwota: przesylka.kwota
              };
            }),
            maxPrzesylki: przesylkiData.maxPrzesylki
          };
        })
      )
      .subscribe(transformedPrzesylkiData => {
        // this function gets data
        // positive case
        this.przesylki = transformedPrzesylkiData.przesylki;
        this.przesylkiUpdated.next({
          przesylki: [...this.przesylki],
          przesylkiCount: transformedPrzesylkiData.maxPrzesylki,
        });
      });
  }

  // GET SINGLE PRZESYLKA
  getPrzesylka(id: string) {
    return this.http.get<{ przesylki: Przesylki }>(
      environment.apiUrl + '/przesylki/' + id,
      { withCredentials: true }
    );
  }

  // I am listening to subject of przesylkiUpdated
  getPrzesylkiUpdatedListener() {
    return this.przesylkiUpdated.asObservable();
  }

  // ADDING A PRZESYLKI
  addPrzesylka(przesylkiData: Przesylki) {
    const przesylki: Przesylki = {
      id: null,
      fullName: przesylkiData.fullName,
      comments: przesylkiData.comments,
      status: przesylkiData.status,
      accountManager: przesylkiData.accountManager,
      accountManagerLogin: przesylkiData.accountManagerLogin,
      firms: przesylkiData.firms,
      projects: przesylkiData.projects,
      pliki: przesylkiData.pliki,
      nrZapotrzebowania: przesylkiData.nrZapotrzebowania,
      doKogo: przesylkiData.doKogo,
      doKogoEmails: przesylkiData.doKogoEmails,
      terminDostawy: przesylkiData.terminDostawy,
      rodzajPlatnosci: przesylkiData.rodzajPlatnosci,
      kwota: przesylkiData.kwota
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; przesylkiId: string; plikSciezka: string }>(
        environment.apiUrl + '/przesylki',
        przesylki,
        { withCredentials: true }
      )
      .subscribe(responseData => {
        if (responseData.message === 'Przesylki exist') {
          alert(`Taka przesyłka już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/przesylki']);
        }
      });
  }

  // UPDATE A PRZESYLKI
  updatePrzesylki(id: string, przesylkiData: Przesylki, wyslijMaila: boolean) {
    const przesylki: Przesylki = przesylkiData;
    this.http
      .put<{ message: string; }>(environment.apiUrl + '/przesylki/' + id + '/' + wyslijMaila, przesylki, {
        withCredentials: true
      })
      .subscribe(response => {
        if (response.message === 'Przesylki exist') {
          alert(`Taka przesyłka już jest w bazie.`);
        } else {
          this.router.navigate(['/rrwmodule/przesylki']);
        }
      });
  }

  // DELETE AN PRZESYLKA
  deletePrzesylki(przesylkaId: string) {
    return this.http.delete(
      environment.apiUrl + '/przesylki/' + przesylkaId,
      { withCredentials: true }
    );
  }

}

