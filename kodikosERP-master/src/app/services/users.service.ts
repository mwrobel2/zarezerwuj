import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
// 'event emitter'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [];
  // I am creating an updated users subject
  // it is a generic type
  // I'm passing User table as payload
  // it is an observer
  private usersUpdated = new Subject<User[]>();

  constructor(private router: Router, private http: HttpClient) { }

  // GETS ALL users
  getUsers() {
    // zwracam kopię tablicy 'użytkownicy' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.users];

    // httpClient is generic type so we state that we will get aray of users
    this.http
      .get<{ message: string; users: any }>(environment.apiUrl + '/user', {withCredentials: true})
      // I am using pipe to change id na _id
      .pipe(
        map(usersData => {
          return usersData.users.map(user => {
            return {
              id: user._id,
              login: user.login,
              email: user.email,
              department: user.department,
              name: user.name,
              surname: user.surname,
              moduly: user.moduly
            };
          });
        })
      )
      .subscribe(transformedUsers => {
        // this function gets data
        // positive case
        this.users = transformedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  // GET SINGLE USER
  getUser(id: string) {
    // I'm getting a user from local array of users
    // return {...this.users.find(c => c.id === id)};

    // I'm getting a user from databas
    return this.http.get<{ _id: string }>(environment.apiUrl + '/user/' + id, {withCredentials: true});
  }

  // GET SINGLE USER by Login
  getUserByLogin(login: string) {
    return this.http.get<{ login: string }>(environment.apiUrl + '/user/lg/' + login, {withCredentials: true});
  }

  // I am listening to subject of usersUpdated
  getUsersUpdatedListener() {
    return this.usersUpdated.asObservable();
  }

  // ADDING A USER
  addUser(userData: User) {
    const user: User = {
      id: null,
      login: userData.login,
      email: userData.email,
      department: userData.department,
      name: userData.name,
      surname: userData.surname,
      moduly: userData.moduly,
      contractorFields: userData.contractorFields,
      szkodliwaFields: userData.szkodliwaFields,
      assortmentFields: userData.assortmentFields,
      sekretariatFields: userData.sekretariatFields,
      warehouseFields: userData.warehouseFields,
      kluczeFields: userData.kluczeFields,
      kluczeRejestrFields: userData.kluczeRejestrFields,
      kluczeWydaniaFields: userData.kluczeWydaniaFields
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; userId: string }>(
        environment.apiUrl + '/user',
        user, {withCredentials: true})
      .subscribe(responseData => {
        // console.log(responseData.message);
        const id = responseData.userId;
        user.id = id;
        this.users.push(user);
        // I'm emitting a new vlue to usersUpdated
        // as a copy of users table
        this.usersUpdated.next([...this.users]);
        this.router.navigate(['/userlist']);
      });
  }

  // UPDATE A USER
  updateUser(id: string, userData: User) {
    const user: User = userData;
    this.http
      .put(environment.apiUrl + '/user/' + id, user, {withCredentials: true})
      .subscribe(response => {
        this.router.navigate(['/userlist']);
      });
  }

  // DELETE A USER
  deleteUser(userId: string) {
    this.http.delete(environment.apiUrl + '/user/' + userId, {withCredentials: true}).subscribe(() => {
      const updatedUsers = this.users.filter(user => user.id !== userId);
      this.users = updatedUsers;
      this.usersUpdated.next([...this.users]);
    });
  }
}
