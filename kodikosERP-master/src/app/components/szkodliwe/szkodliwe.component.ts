import { Component, OnInit, OnDestroy } from '@angular/core';
import { Szkodliwa } from '../../models/szkodliwa';
import { SzkodliweService } from '../../services/szkodliwe.service';
import { Subscription, from } from 'rxjs';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Szkodliwaform } from '../../models/formatki/szkodliwaform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { environment } from '../../../environments/environment';
import { PlikiService } from '../../services/pliki.service';

@Component({
  selector: 'app-szkodliwe',
  templateUrl: './szkodliwe.component.html',
  styleUrls: ['./szkodliwe.component.scss']
})
export class SzkodliweComponent implements OnInit, OnDestroy {

  szkodliwe: Szkodliwa[] = [];
  private szkodliweSub: Subscription;

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
    contractorFields: null,
    szkodliwaFields: null
  };

  totalSzkodliwe = 0;
  szkodliwePerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  acKolumny: string[];
  dkKolumny: string[];
  plikiKolumny: string[];
  zagrozeniaKolumny: string[];

  private searchValues = {
    fullName: '',
    shortName: '',
    nip: '',
    zaklad: '',
    rok: '',
    surname: '',
    zagrozenie: '',
    comments: '',
    accountManagerLogin: ''
  };

  szkodliwa = {
    nip: '',
    shortName: '',
    fullName: '',
    zaklad: '',
    rok: '',
    surname: '',
    zagrozenie: '',
    comments: '',
    anotherContacts: [{}],
    bankAccounts: [{}]
  };

  isLoading = false;

  // I declare displayed fields
  dispFields: Szkodliwaform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false,
    firmy: false,
    projekty: false,
    pliki: false,
    buttonPliki: false
  };
  backendUrl = environment.backendUrl;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public szkodliweService: SzkodliweService,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.szkodliwaFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram pliki z bazy
          this.szkodliweService.getSzkodliwe(
            this.szkodliwePerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.szkodliweSub = this.szkodliweService
      .getSzkodliweUpdatedListener()
      .subscribe(
        (szkodliweData: {
          szkodliwe: Szkodliwa[];
          szkodliweCount: number;
        }) => {
          this.isLoading = false;
          this.totalSzkodliwe = szkodliweData.szkodliweCount;
          this.szkodliwe = szkodliweData.szkodliwe;
          // console.log(this.szkodliwe);
        }
      );

    this.acKolumny = [
      'acName',
      'acSurname',
      'acEmail',
      'acPhone',
      'acComment',
    ];

    this.dkKolumny = [
      'dkNazwa',
      'dkNrKonta',
      'dkDomyslne',
    ];

    this.plikiKolumny = [
      'name',
      'rodzaj',
    ];

    this.zagrozeniaKolumny = [
      'zagrozenie',
      'osobyPracujace'
    ];
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(szkodliwaId: string, pliki: any) {
    if (confirm('Czy na pewno usunąć informację o tej substancji?')) {
      let liczbaPlikow = pliki.length;


      if (pliki.length > 0) {
        pliki.forEach((plik: { fileName: string, katalog: string }) => {
          // console.log('Usuwany plik', plik.fileName);
          this.plikiService.ksujPlik(plik.fileName, plik.katalog).subscribe((res: { usuniety: string }) => {
            liczbaPlikow--;
            // puszczam nawet jeżeli z jakichś powodów pliku nie dało się usunąć
            // if (res.usuniety === 'ok' && liczbaPlikow <= 0) {
            if (liczbaPlikow <= 0) {
              // console.log('wszystkie pliki usuniete');
              this.isLoading = true;
              this.szkodliweService.deleteSzkodliwa(szkodliwaId).subscribe(() => {
                this.szkodliweService.getSzkodliwe(
                  this.szkodliwePerPage,
                  this.currentPage,
                  this.searchValues
                );
              });
            }
          });
        });
      } else {
        // nie było plików do usunięcia więc usuwam wpis z bazy
        this.isLoading = true;
        this.szkodliweService.deleteSzkodliwa(szkodliwaId).subscribe(() => {
          this.szkodliweService.getSzkodliwe(
            this.szkodliwePerPage,
            this.currentPage,
            this.searchValues
          );
        });
      }
    }
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.szkodliwePerPage = pageData.pageSize;
    this.szkodliweService.getSzkodliwe(
      this.szkodliwePerPage,
      this.currentPage,
      this.searchValues
    );
  }

  onSearchSzkodliwa(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      fullName: form.value.nazwaPelna,
      shortName: form.value.nazwaKrotka,
      nip: form.value.nip,
      zaklad: form.value.zaklad,
      rok: form.value.rok,
      surname: form.value.surname,
      zagrozenie: form.value.zagrozenie,
      comments: form.value.comments,
      accountManagerLogin: null
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.szkodliweService.getSzkodliwe(
      this.szkodliwePerPage,
      this.currentPage,
      this.searchValues
    );
    this.szkodliweSub = this.szkodliweService
      .getSzkodliweUpdatedListener()
      .subscribe(
        (szkodliweData: {
          szkodliwe: Szkodliwa[];
          szkodliweCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalSzkodliwe = szkodliweData.szkodliweCount;
          this.szkodliwe = szkodliweData.szkodliwe;
        }
      );
  }

  clearForm(form: NgForm) {
    this.szkodliwa.nip = '';
    this.szkodliwa.shortName = '';
    this.szkodliwa.fullName = '';
    this.szkodliwa.comments = '';
    this.szkodliwa.zaklad = '';
    this.szkodliwa.surname = '';
    this.szkodliwa.zagrozenie = '';
    this.szkodliwa.rok = '';
  }

  ngOnDestroy(): void {
    this.szkodliweSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }
}

