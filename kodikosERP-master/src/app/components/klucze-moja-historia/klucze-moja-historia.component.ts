import { Component, OnInit, OnDestroy } from '@angular/core';
import { KluczeWydaniaform } from '../../models/formatki/kluczewydaniaform.model';
import { KluczeWydania } from '../../models/kluczeWydania.model';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { KluczeService } from '../../services/klucze.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-klucze-moja-historia',
  templateUrl: './klucze-moja-historia.component.html',
  styleUrls: ['./klucze-moja-historia.component.scss']
})
export class KluczeMojaHistoriaComponent implements OnInit, OnDestroy {

  dispFields: KluczeWydaniaform = {
    menuKluczeUprawnienia: false,
    menuDodajUprawnienia: false,
    dodajUprSaAktywne: false,
    menuSpis: false,
    menuDodajSpis: false,
    menuWydania: false,
    menuDodajWydanie: false,
    rejestracja: false,
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false
  };

  isLoading = false;
  kluczePerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  private kluczeWydaniaSub: Subscription;
  kluczeWydania: KluczeWydania[] = [];
  totalKluczeWydania = 0;

  public zalogowanyUser: Subscription;
  userIsAuthenticated = false;

  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    kluczeWydaniaFields: null
  };

  private searchValues = {
    accountManagerLogin: '',
    numerKlucza: '',
    rfidKlucza: '',
    nazwisko: '',
    operacja: '',
    dataWydania: '',
    dataZwrotu: ''
  };

  kluczWydania: KluczeWydania = {
    numerKlucza: '',
    rfidKlucza: '',
    rfidKarty: '',
    imie: '',
    nazwisko: '',
    dzial: '',
    dataWydania: null,
    dataZwrotu: null,
    operacja: '',
    wpisAutomatyczny: false
  };

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    private kluczeService: KluczeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;

        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.kluczeWydaniaFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }

          // widzi tylko wpisy dla swojego nazwiska
          this.searchValues.nazwisko = this.loggedInUser.surname;

          // po zweryfikowaniu usera pobieram dane
          this.kluczeService.getKluczeWydania(
            this.kluczePerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });
    this.kluczeWydaniaSub = this.kluczeService
      .getKluczeWydaniaUpdatedListener()
      .subscribe(
        (kluczeWydaniaData: {
          kluczeWydania: KluczeWydania[];
          kluczeWydaniaCount: number;
        }) => {
          this.isLoading = false;
          this.totalKluczeWydania = kluczeWydaniaData.kluczeWydaniaCount;
          this.kluczeWydania = kluczeWydaniaData.kluczeWydania;
        }
      );
  }

  onSearchKluczeWydania(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      accountManagerLogin: null,
      numerKlucza: form.value.numerKlucza,
      rfidKlucza: form.value.rfidKlucza,
      nazwisko: form.value.nazwisko,
      operacja: form.value.operacja,
      dataWydania: form.value.dataWydania,
      dataZwrotu: form.value.dataZwrotu
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.kluczeService.getKluczeWydania(
      this.kluczePerPage,
      this.currentPage,
      this.searchValues
    );
    this.kluczeWydaniaSub = this.kluczeService
      .getKluczeWydaniaUpdatedListener()
      .subscribe(
        (kluczeWydaniaData: {
          kluczeWydania: KluczeWydania[];
          kluczeWydaniaCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalKluczeWydania = kluczeWydaniaData.kluczeWydaniaCount;
          this.kluczeWydania = kluczeWydaniaData.kluczeWydania;
          this.kluczeWydaniaSub.unsubscribe();
        }
      );
  }

  clearForm(form: NgForm) {
    this.kluczWydania.numerKlucza = '';
    this.kluczWydania.rfidKlucza = '';
    this.kluczWydania.rfidKarty = '';
    this.kluczWydania.imie = '';
    this.kluczWydania.nazwisko = '';
    this.kluczWydania.dzial = '';
    this.kluczWydania.dataWydania = null;
    this.kluczWydania.dataZwrotu = null;
    this.kluczWydania.operacja = '';
    this.kluczWydania.wpisAutomatyczny = false;
  }

  onDelete(kluczId: string) {
    if (confirm('Czy na pewno usunąć informację o tym zdarzeniu?')) {
      this.isLoading = true;
      this.kluczeService.deleteKluczWydania(kluczId).subscribe(() => {
        this.kluczeService.getKluczeWydania(
          this.kluczePerPage,
          this.currentPage,
          this.searchValues
        );
      });
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.kluczePerPage = pageData.pageSize;
    this.kluczeService.getKluczeWydania(
      this.kluczePerPage,
      this.currentPage,
      this.searchValues
    );
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
    this.kluczeWydaniaSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }

}




