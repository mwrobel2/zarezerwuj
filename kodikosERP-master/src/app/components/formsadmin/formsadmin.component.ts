import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';

@Component({
  selector: 'app-formsadmin',
  templateUrl: './formsadmin.component.html',
  styleUrls: ['./formsadmin.component.scss']
})
export class FormsadminComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
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

  showKontrahenci = false;
  showTowary = false;
  showAsortyment = false;
  showPracownicy = false;
  showOferty = false;
  showZamowienia = false;
  showListawydan = false;
  showFaktury = false;
  showAdministracja = false;


  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;

          // I'm checking permissions to modules
          this.showAdministracja = this.loggedInUser.moduly.includes('administracja');
          this.showKontrahenci = this.loggedInUser.moduly.includes('kontrahenci');
          this.showTowary = this.loggedInUser.moduly.includes('towary');
          this.showAsortyment = this.loggedInUser.moduly.includes('asortyment');
          this.showPracownicy = this.loggedInUser.moduly.includes('pracownicy');
          this.showOferty = this.loggedInUser.moduly.includes('oferty');
          this.showZamowienia = this.loggedInUser.moduly.includes('zamowienia');
          this.showListawydan = this.loggedInUser.moduly.includes('listawydan');
          this.showFaktury = this.loggedInUser.moduly.includes('faktury');

        }
      },
      error => {
        this.router.navigate(['/login']);
      });
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }

}
