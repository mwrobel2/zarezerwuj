import { Component, OnInit, OnDestroy } from '@angular/core';
import { Kluczeform } from '../../models/formatki/kluczeform.model';
import { Klucze } from '../../models/klucze.model';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { KluczeService } from '../../services/klucze.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-klucze',
  templateUrl: './klucze.component.html',
  styleUrls: ['./klucze.component.scss']
})
export class KluczeComponent implements OnInit, OnDestroy {

  dispFields: Kluczeform = {
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

  private kluczeSub: Subscription;
  klucze: Klucze[] = [];
  totalKlucze = 0;

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
    contractorFields: null
  };

  private searchValues = {
    fullName: '',
    nazwisko: '',
    imie: '',
    zaklad: '',
    nrKarty: '',
    accountManagerLogin: ''
  };

  klucz = {
    fullName: '',
    nazwisko: '',
    imie: '',
    zaklad: '',
    nrKarty: ''
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
          this.dispFields = this.loggedInUser.kluczeFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram dane
          this.kluczeService.getKlucze(
            this.kluczePerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.kluczeSub = this.kluczeService
      .getKluczeUpdatedListener()
      .subscribe(
        (kluczeData: {
          klucze: Klucze[];
          kluczeCount: number;
        }) => {
          this.isLoading = false;
          this.totalKlucze = kluczeData.kluczeCount;
          this.klucze = kluczeData.klucze;
        }
      );
  }

  onSearchKlucze(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      fullName: form.value.fullName,
      nazwisko: form.value.nazwisko,
      imie: form.value.imie,
      zaklad: form.value.zaklad,
      nrKarty: form.value.nrKarty,
      accountManagerLogin: null
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.kluczeService.getKlucze(
      this.kluczePerPage,
      this.currentPage,
      this.searchValues
    );
    this.kluczeSub = this.kluczeService
      .getKluczeUpdatedListener()
      .subscribe(
        (kluczeData: {
          klucze: Klucze[];
          kluczeCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalKlucze = kluczeData.kluczeCount;
          this.klucze = kluczeData.klucze;
          // console.log(this.klucze);
          this.kluczeSub.unsubscribe();
        }
      );
  }

  clearForm(form: NgForm) {
    this.klucz.fullName = '';
    this.klucz.imie = '';
    this.klucz.nazwisko = '';
    this.klucz.zaklad = '';
    this.klucz.nrKarty = '';
  }

  onDelete(kluczId: string) {
    if (confirm('Czy na pewno usunąć informację o tym kluczu?')) {
      this.isLoading = true;
      this.kluczeService.deleteKlucz(kluczId).subscribe(() => {
        this.kluczeService.getKlucze(
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
    this.kluczeService.getKlucze(
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
    this.kluczeSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }

}
