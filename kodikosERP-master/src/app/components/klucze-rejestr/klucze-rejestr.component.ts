import { Component, OnInit, OnDestroy } from '@angular/core';
import { KluczeRejestrform } from '../../models/formatki/kluczerejestrform.model';
import { KluczeRejestr } from '../../models/kluczeRejestr.model';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { KluczeService } from '../../services/klucze.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-klucze-rejestr',
  templateUrl: './klucze-rejestr.component.html',
  styleUrls: ['./klucze-rejestr.component.scss']
})
export class KluczeRejestrComponent implements OnInit, OnDestroy {

  dispFields: KluczeRejestrform = {
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

  private kluczeRejestrSub: Subscription;
  kluczeRejestr: KluczeRejestr[] = [];
  totalKluczeRejestr = 0;

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
    kluczeRejestrFields: null
  };

  private searchValues = {
    numerKlucza: '',
    rfidKlucza: '',
    comments: '',
    accountManagerLogin: ''
  };

  kluczRejestr: KluczeRejestr = {
    comments: '',
    numerKlucza: '',
    rfidKlucza: '',
    aktywny: null
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
          this.dispFields = this.loggedInUser.kluczeRejestrFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram dane
          this.kluczeService.getKluczeRejestr(
            this.kluczePerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.kluczeRejestrSub = this.kluczeService
      .getKluczeRejestrUpdatedListener()
      .subscribe(
        (kluczeRejestrData: {
          kluczeRejestr: KluczeRejestr[];
          kluczeRejestrCount: number;
        }) => {
          this.isLoading = false;
          this.totalKluczeRejestr = kluczeRejestrData.kluczeRejestrCount;
          this.kluczeRejestr = kluczeRejestrData.kluczeRejestr;
        }
      );
  }

  onSearchKluczeRejestr(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      accountManagerLogin: null,
      numerKlucza: form.value.numerKlucza,
      rfidKlucza: form.value.rfidKlucza,
      comments: form.value.comments
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.kluczeService.getKluczeRejestr(
      this.kluczePerPage,
      this.currentPage,
      this.searchValues
    );
    this.kluczeRejestrSub = this.kluczeService
      .getKluczeRejestrUpdatedListener()
      .subscribe(
        (kluczeRejestrData: {
          kluczeRejestr: KluczeRejestr[];
          kluczeRejestrCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalKluczeRejestr = kluczeRejestrData.kluczeRejestrCount;
          this.kluczeRejestr = kluczeRejestrData.kluczeRejestr;
          this.kluczeRejestrSub.unsubscribe();
        }
      );
  }

  clearForm(form: NgForm) {
    this.kluczRejestr.comments = '';
    this.kluczRejestr.numerKlucza = '';
    this.kluczRejestr.rfidKlucza = '';
    this.kluczRejestr.aktywny = null;
  }

  onDelete(kluczId: string) {
    if (confirm('Czy na pewno usunąć informację o tym kluczu?')) {
      this.isLoading = true;
      this.kluczeService.deleteKluczRejestr(kluczId).subscribe(() => {
        this.kluczeService.getKluczeRejestr(
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
    this.kluczeService.getKluczeRejestr(
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
    this.kluczeRejestrSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }

}
