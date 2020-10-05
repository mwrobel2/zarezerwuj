import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NbpService } from '../../services/nbp.service';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { User } from '../../models/user.model';
import { Nbpmid } from '../../models/nbpmid.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-glowne-menu',
  templateUrl: './glowne-menu.component.html',
  styleUrls: ['./glowne-menu.component.scss']
})
export class GlowneMenuComponent implements OnInit, OnDestroy {
  private zalogowanyUser: Subscription;
  userIsAuthenticated = false;

  napisyPL = {
    kontakty: 'KONTAKTY',
    sekretariat: 'SEKRETARIAT',
    obsSekr: 'Obsługa sekretariatu'
  }

  napisyENG = {
    kontakty: 'CONTACTS',
    sekretariat: 'OFFICE',
    obsSekr: 'Office management'
  }

  napisyUKR = {
    kontakty: 'KONTAKTY',
    sekretariat: 'SEKRETARIAT',
    obsSekr: 'Obsługa sekretariatu'
  }

  napisyRUS = {
    kontakty: 'KONTAKTY',
    sekretariat: 'SEKRETARIAT',
    obsSekr: 'Obsługa sekretariatu'
  }

  napisy = this.napisyPL;

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
  showSekretariat = false;
  showZamowienia = false;
  showListawydan = false;
  showFaktury = false;
  showAdministracja = false;
  showProjekty = false;
  showSzkodliwe = false;
  showPrzesylki = false;
  showSprzet = false;
  showUmowy = false;
  showDokumenty = false;
  showRCP = false;
  showKlucze = false;
  showWaluty = false;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        // // jeżeli jest displayName to znaczy że logowaliśmy się przez domenę
        // if (this.loggedInUser.displayName) {
        //   this.userIsAuthenticated = true;
        //   // this.loggedInUser.name = user._json.givenName;
        //   // this.loggedInUser.surname = user._json.sn;
        //   this.usersService.getUserByLogin(user._json.sAMAccountName).subscribe(
        //     userByLogin => {
        //       this.loggedInUser = userByLogin;
        //       this.showAdministracja = this.loggedInUser.moduly.includes('administracja');
        //       this.showKontrahenci = this.loggedInUser.moduly.includes('kontakty');
        //       this.showTowary = this.loggedInUser.moduly.includes('towary');
        //       this.showAsortyment = this.loggedInUser.moduly.includes('asortyment');
        //       this.showPracownicy = this.loggedInUser.moduly.includes('pracownicy');
        //       this.showOferty = this.loggedInUser.moduly.includes('oferty');
        //       this.showZamowienia = this.loggedInUser.moduly.includes('zamowienia');
        //       this.showListawydan = this.loggedInUser.moduly.includes('listawydan');
        //       this.showFaktury = this.loggedInUser.moduly.includes('faktury');
        //       this.showProjekty = this.loggedInUser.moduly.includes('projekty');
        //       this.showSzkodliwe = this.loggedInUser.moduly.includes('szkodliwe');
        //       this.showSprzet = this.loggedInUser.moduly.includes('sprzet');
        //       this.showUmowy = this.loggedInUser.moduly.includes('umowy');
        //       this.showDokumenty = this.loggedInUser.moduly.includes('dokumenty');
        //       this.showRCP = this.loggedInUser.moduly.includes('rcp');
        //       this.showWaluty = this.loggedInUser.moduly.includes('waluty');
        //     }
        //   );
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.showAdministracja = this.loggedInUser.moduly.includes('administracja');
          this.showKontrahenci = this.loggedInUser.moduly.includes('kontakty');
          this.showTowary = this.loggedInUser.moduly.includes('towary');
          this.showAsortyment = this.loggedInUser.moduly.includes('asortyment');
          this.showPracownicy = this.loggedInUser.moduly.includes('pracownicy');
          this.showOferty = this.loggedInUser.moduly.includes('oferty');
          this.showSekretariat = this.loggedInUser.moduly.includes('sekretariat');
          this.showZamowienia = this.loggedInUser.moduly.includes('zamowienia');
          this.showListawydan = this.loggedInUser.moduly.includes('listawydan');
          this.showFaktury = this.loggedInUser.moduly.includes('faktury');
          this.showProjekty = this.loggedInUser.moduly.includes('projekty');
          this.showSzkodliwe = this.loggedInUser.moduly.includes('szkodliwe');
          this.showPrzesylki = this.loggedInUser.moduly.includes('przesylki');
          this.showSprzet = this.loggedInUser.moduly.includes('sprzet');
          this.showUmowy = this.loggedInUser.moduly.includes('umowy');
          this.showDokumenty = this.loggedInUser.moduly.includes('dokumenty');
          this.showRCP = this.loggedInUser.moduly.includes('rcp');
          this.showKlucze = this.loggedInUser.moduly.includes('klucze');
          this.showWaluty = this.loggedInUser.moduly.includes('waluty');
        }

      },
      error => {
        this.router.navigate(['/login']);
      });

    //POBIERAM WERSJE JĘZYKOWĄ
    switch (localStorage.getItem('kodiJezyk')) {
      case null:
        this.napisy = this.napisyPL;
        break;
      case 'PL':
        this.napisy = this.napisyPL;
        break;
      case 'ENG':
        this.napisy = this.napisyENG;
        break;
      case 'RUS':
        this.napisy = this.napisyRUS;
        break;
      case 'UKR':
        this.napisy = this.napisyUKR;
        break;
      default:
        this.napisy = this.napisyPL;
    }

  }

  zapiszJezyk(jezyk: string) {
    switch (jezyk) {
      case 'PL':
        this.napisy = this.napisyPL;
        localStorage.setItem('kodiJezyk', 'PL');
        break;
      case 'ENG':
        this.napisy = this.napisyENG;
        localStorage.setItem('kodiJezyk', 'ENG');
        break;
      case 'RUS':
        this.napisy = this.napisyRUS;
        localStorage.setItem('kodiJezyk', 'RUS');
        break;
      case 'UKR':
        this.napisy = this.napisyUKR;
        localStorage.setItem('kodiJezyk', 'UKR');
        break;
      default:
        this.napisy = this.napisyPL;
        localStorage.setItem('kodiJezyk', 'PL');
    }
  }

  logoutPassport() {
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
