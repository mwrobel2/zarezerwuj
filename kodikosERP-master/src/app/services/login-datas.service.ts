import { Injectable } from '@angular/core';
import { LoginDatas } from '../models/login-datas.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginDatasService {
  private loginDatas: LoginDatas[] = [];
  private loginDatasUpdated = new Subject<LoginDatas[]>();

  constructor(private router: Router, private http: HttpClient) {}

  // GET ALL LOGIN DATAS
  getLoginDatas() {
    // zwracam kopię tablicy 'logindatas' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.logindatas];

    // httpClient is generic type so we state that we will get aray of login datas
    this.http
      .get<{ message: string; loginDatas: any }>(
        environment.apiUrl + '/logindatas'
      )
      // I am using pipe to change id na _id
      .pipe(
        map(loginDatasData => {
          return loginDatasData.loginDatas.map(loginData => {
            return {
              id: loginData._id,
              date: loginData.date,
              login: loginData.login,
              message: loginData.message
            };
          });
        })
      )
      .subscribe(transformedLoginDatas => {
        // this function gets data
        // positive case
        this.loginDatas = transformedLoginDatas;
        this.loginDatasUpdated.next([...this.loginDatas]);
      });
  }

  // I am listening to subject of loginDatasUpdated
  getLoginDatasUpdatedListener() {
    return this.loginDatasUpdated.asObservable();
  }

  // GET SINGLE LOGIN DATA
  getLoginDataId(id: string) {
    // I'm getting an login data from local array of login datas
    // return {...this.loginDatas.find(c => c.id === id)};

    // I'm getting an login data from database
    return this.http.get<{ _id: string }>(
      environment.apiUrl + '/logindatas/' + id
    );
  }
}
