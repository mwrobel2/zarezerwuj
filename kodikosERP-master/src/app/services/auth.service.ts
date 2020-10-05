import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private user: User;
  // Im storing auth status in a Subject
  // I'll use this Subject to push authentication information
  // to the components which are interested
  private authStatusListener = new Subject<boolean>();
  private loggedInUser = new Subject<User>();
  public zalogowanyUser: User;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  // GET TOKEN
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  // GET STATUS OF AUTH
  getAuthStatusListener() {
    // console.log('getAuthStatusListener');
    return this.authStatusListener.asObservable();
  }

  // CREATE USER
  createUser(login: string, password: string, email: string, department: string, name: string, surname: string, contractorFields: any) {
    const authData: AuthData = {login, password, email, department,
     name, surname, contractorFields};
    this.http.post<{ message: string, userLogin: string }>(environment.apiUrl + '/user/signup', authData)
      .subscribe(response => {
        if (response.message === 'User exists') {
          alert(`Użytkownik "${ response.userLogin }" już istnieje w systemie.`);
        } else {
          this.router.navigate(['/userlist']);
        }
      });
  }

  // LOGIN USER
  loginUser(login: string, password: string) {
    const authData: AuthData = {login, password};
    this.http.post<{token: string, expiresIn: number, user: User}>(environment.apiUrl + '/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        const user = response.user;
        // response is my token
        // console.log(response.user);
        this.token = token;
        this.user = user;
        this.zalogowanyUser = user;
        // this user got full information

        // I want to use this token in other parts of app
        // for example in kontrahenci.service
        // thats why I'm usig subject from rxjs
        // I can use interceptors on http - they run on every otgoing http request

        // I set authStatusListener to true
        if (token) {
        const expiresInDuration = response.expiresIn;
        // console.log('Zalogowany true');
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.loggedInUser.next(this.user);
        // console.log('user:', this.user);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        // console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.user.name, this.user.surname);
        this.router.navigate(['/glownemenu']);
        }
      },
      err => {
        console.log('err3', err);
        this.router.navigate(['/']);
      });
  }


    // LOGIN USER
    loginUserActiveDirectory(login: string, password: string) {
      const authData: AuthData = {login, password};
      this.http.post<{token: string, expiresIn: number, user: User}>(environment.apiUrl + '/user/login', authData)
        .subscribe(response => {
          const token = response.token;
          const user = response.user;
          // response is my token
          // console.log(response.user);
          this.token = token;
          this.user = user;
          this.zalogowanyUser = user;
          // this user got full information

          // I want to use this token in other parts of app
          // for example in kontrahenci.service
          // thats why I'm usig subject from rxjs
          // I can use interceptors on http - they run on every otgoing http request

          // I set authStatusListener to true
          if (token) {
          const expiresInDuration = response.expiresIn;
          // console.log('Zalogowany true');
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.loggedInUser.next(this.user);
          // console.log('user:', this.user);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          // console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.user.name, this.user.surname);
          this.router.navigate(['/glownemenu']);
          }
        },
        err => {
          console.log('err3', err);
          this.router.navigate(['/']);
        });
    }

  // Automatyczna autentykacja
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    // sprawdzam czy jeszcze ważny
    const now = new Date();
    const isInFuture = authInformation.expirationDate > now;
    if (isInFuture) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userName: string, userSurname) {
    localStorage.setItem('KODtoken', token);
    localStorage.setItem('KODexpiration', expirationDate.toISOString());
    sessionStorage.setItem('KODuserName', userName);
    sessionStorage.setItem('KODuserSurname', userSurname);
  }

  private clearAuthData() {
    localStorage.removeItem('KODtoken');
    localStorage.removeItem('KODexpiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('KODtoken');
    const expirationDate = localStorage.getItem('KODexpiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

  // Get name and surname from session storage - available after login
  // public getUserNameSurname() {
  //   const usName = sessionStorage.getItem('KODuserName');
  //   const usSurname = sessionStorage.getItem('KODuserSurname');
  //   return {
  //     usName,
  //     usSurname
  //   };
  // }

    // I am listening to subject of loggedInUser
    getLoggedInUserListener() {
      return this.loggedInUser.asObservable();
    }

    getZalogowany() {
      return this.zalogowanyUser;
    }

}
