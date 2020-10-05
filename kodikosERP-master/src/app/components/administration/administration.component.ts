import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  userIsAuthenticated = false;
  // private authListenerSub: Subscription;
  // private loggedInUserSub: Subscription;
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
  public zalogowanyUser: Subscription;
  isLoading = false;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    private router: Router
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
    // I'm checking if user is authenticated
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // I'm setting up an subscription to authStatusListener
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
    //     // console.log(this.loggedInUser);
    //   });
    // this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    // this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');
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
}
