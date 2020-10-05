import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogowanierejestracjaService {

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  createUser(login: string, password: string, email: string, department: string,
             name: string, surname: string, contractorFields: any, phone: string, status: string) {
    // tworze obiekt User
    // nie przekazuje modułów - bo te nadawane potem
    // ustalam jakie są domyślne cotractorFields i dołączam je do obiektu user

    const user: User = {
      login,
      password,
      email,
      department,
      name,
      surname,
      phone,
      contractorFields,
      status
    };
    this.http.post<{ message: string, userLogin: string }>(environment.apiUrl + '/logowanierejestracja/register', user,
      { withCredentials: true })
      .subscribe(response => {
        if (response.message === 'User exists') {
          alert(`Użytkownik "${response.userLogin}" już istnieje w systemie.`);
        } else {
          this.router.navigate(['/userlist']);
        }
      });
  }


  // logowanie użytkownika
  loginUser(login: string, password: string, logowanieDomenowe: boolean) {

    // console.log('LD', logowanieDomenowe);
    // jeżeli logowanie nie jest do domenty
    if (!logowanieDomenowe) {
      const user: User = {
        login,
        password,
      };
      this.http.post<{ message: string }>(environment.apiUrl + '/logowanierejestracja/login', user, { withCredentials: true })
        .subscribe(response => {
          if (response.message !== 'Zalogowany.') {
            alert(`Nieudane logowanie.`);
          } else {
            this.router.navigate(['/glownemenu']);
          }
        },
          error => {
            alert('Błędny login lub hasło.');
          });
    }

    if (logowanieDomenowe) {
      const user: User = {
        username: login,
        login,
        password
      };
      this.http.post<{ message: string }>(environment.apiUrl + '/logowanierejestracja/login2', user, { withCredentials: true })
        .subscribe(response => {
          if (response.message !== 'Zalogowany.') {
            alert(`Nieudane logowanie.`);
          } else {
            this.router.navigate(['/glownemenu']);
          }
        },
          error => {
            alert('Błędny login lub hasło.');
          });
    }

  }

  // pobranie informacji o użytkowniku
  getUser() {
    // return this.http.get<User>(environment.apiUrl + '/logowanierejestracja/login', { withCredentials: true });
    return this.http.get<any>(environment.apiUrl + '/logowanierejestracja/login', { withCredentials: true });
    // .subscribe(response => {
    //   console.log('response', response);
    //   return response;
    // });
  }

  // wylogowanie usera
  logout() {
    return this.http.get(environment.apiUrl + '/logowanierejestracja/logout', { withCredentials: true });
  }
}
