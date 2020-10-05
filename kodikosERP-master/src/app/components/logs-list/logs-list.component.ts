import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LoginDatas } from '../../models/login-datas.model';
import { LoginDatasService } from '../../services/login-datas.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit {
  loginDatas: LoginDatas[] = [];
  private loginDatasSub: Subscription;
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
  public loggedInUserSub: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null
  };
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalLoginDatas = 10;
  loginDatasPerPage = 5;
  pageSizeOptions = [2, 5, 10, 50, 100];
  dataSource: any;
  displayedColumns: string[];

  constructor(
    public loginDataService: LoginDatasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // I'm checking if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();

    // I'm setting up an subscription to authStatusListener
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // console.log('authenticated www', isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });

    // Checking user name and surname
    this.loggedInUserSub = this.authService
      .getLoggedInUserListener()
      .subscribe(loggedUser => {
        this.loggedInUser = loggedUser;
        // console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');

    this.loginDataService.getLoginDatas();

    this.displayedColumns = ['date', 'login', 'message'];

    this.loginDatasSub = this.loginDataService
      .getLoginDatasUpdatedListener()
      .subscribe((loginDatas: LoginDatas[]) => {
        this.loginDatas = loginDatas;
        // console.log(this.loginDatas);
        this.dataSource = new MatTableDataSource(loginDatas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.loginDatasSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      console.log('wylogowany');
    }
  }

  onChangedPage(event: PageEvent) {
    console.log(event);
  }

  powrot() {
    window.history.go(-1);
  }
}
