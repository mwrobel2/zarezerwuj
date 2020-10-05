import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { NbpService } from '../../services/nbp.service';
import { Nbpmid } from '../../models/nbpmid.model';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null
  };
  usdMid: number;
  eurMid: number;
  rubMid: number;
  uahMid: number;
  usdMidTable: string;
  usdEffDate: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private nbpService: NbpService
  ) { }

  ngOnInit() {
    // I'm checking if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();
    // I'm setting up an subscription to authStatusListener
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // console.log('authenticated www', isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });

    this.loggedInUser = this.authService.getZalogowany();

    this.nbpService.getUsd()
      .subscribe((wyn: Nbpmid) => {
        // console.log(wyn)
        // console.log(wyn.code);
        // console.log(wyn.rates[0].mid);
        this.usdMid = wyn.rates[0].mid;
        // console.log(wyn.rates[0].no);
        this.usdMidTable = wyn.rates[0].no;
        this.usdEffDate = wyn.rates[0].effectiveDate;
      });

    this.nbpService.getEur()
      .subscribe((wyn2: Nbpmid) => {
        this.eurMid = wyn2.rates[0].mid;
        // this.eurMidTable = wyn.rates[0].no
      });

    this.nbpService.getRub()
      .subscribe((wyn3: Nbpmid) => {
        this.rubMid = wyn3.rates[0].mid;
      });

    this.nbpService.getUah()
      .subscribe((wyn4: Nbpmid) => {
        this.uahMid = wyn4.rates[0].mid;
      });
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

}
