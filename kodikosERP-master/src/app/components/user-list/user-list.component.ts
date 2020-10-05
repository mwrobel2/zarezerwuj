import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
// import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private usersSub: Subscription;
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
  public loggedInUserSub: Subscription;

  totalUsers = 10;
  usersPerPage = 5;
  pageSizeOptions = [2, 5, 10, 50, 100];

  public zalogowanyUser: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    contractorFields: null
  };
  isLoading = false;

  constructor(
    public usersService: UsersService,
    private logowanierejestracjaService: LogowanierejestracjaService,
    private router: Router
    // private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
        }
      },
      error => {
        this.router.navigate(['/login']);
      });
    // // I'm checking if user is authenticated
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // // I'm setting up an subscription to authStatusListener
    // this.authListenerSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(isAuthenticated => {
    //     // console.log('authenticated www', isAuthenticated);
    //     this.userIsAuthenticated = isAuthenticated;
    //   });

    // Checking user name and surname
    // this.loggedInUserSub = this.authService
    //   .getLoggedInUserListener()
    //   .subscribe(loggedUser => {
    //     this.loggedInUser = loggedUser;
    //   });
    // this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    // this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');

    this.usersService.getUsers();
    this.usersSub = this.usersService
      .getUsersUpdatedListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(userId: string) {
    if (confirm('Czy na pewno usunąć tego użytkownika?')) {
      this.usersService.deleteUser(userId);
    }
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    // this.authListenerSub.unsubscribe();
  }

  // logout() {
  //   if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
  //     console.log('wylogowany');
  //   }
  // }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }
}
