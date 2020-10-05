import { Component, OnInit, OnDestroy } from '@angular/core';
import { Assortment } from '../../models/assortment.model';
import { AssortmentService } from '../../services/assortment.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Assortmentform } from '../../models/formatki/assortmentform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { environment } from '../../../environments/environment';
import { PlikiService } from '../../services/pliki.service';

@Component({
  selector: 'app-assortment',
  templateUrl: './assortment.component.html',
  styleUrls: ['./assortment.component.scss']
})
export class AssortmentComponent implements OnInit, OnDestroy {

  assortments: Assortment[] = [];
  private assortmentsSub: Subscription;

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
    szkodliwaFields: null,
    assortmentFields: null
  };

  totalAssortments = 0;
  assortmentsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  plikiKolumny: string[];

  private searchValues = {
    fullName: '',
    comments: '',
    accountManagerLogin: ''
  };

  assortment = {
    fullName: '',
    comments: '',
    rodzajTowaru: '',
    towarOpis: ''
  };

  isLoading = false;

  // I declare displayed fields
  dispFields: Assortmentform = {
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
    public assortmentService: AssortmentService,
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
          this.dispFields = this.loggedInUser.assortmentFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram pliki z bazy
          this.assortmentService.getAssortments(
            this.assortmentsPerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.assortmentsSub = this.assortmentService
      .getAssortmentsUpdatedListener()
      .subscribe(
        (assortmentsData: {
          assortments: Assortment[];
          assortmentsCount: number;
        }) => {
          this.isLoading = false;
          this.totalAssortments = assortmentsData.assortmentsCount;
          this.assortments = assortmentsData.assortments;
        }
      );


    this.plikiKolumny = [
      'name',
      'rodzaj',
    ];
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(assortmentId: string, pliki: any) {
    if (confirm('Czy na pewno usunąć informację o tym asortymencie?')) {
      let liczbaPlikow = pliki.length;


      if (pliki.length > 0) {
        pliki.forEach((plik: { fileName: string, katalog: string }) => {
          // console.log('Usuwany plik', plik.fileName);
          this.plikiService.ksujPlik(plik.fileName, plik.katalog).subscribe((res: { usuniety: string }) => {
            liczbaPlikow--;
            //  nawet jeżeli z jakichś powodów pliku nie dało się usunąć
            // if (res.usuniety === 'ok' && liczbaPlikow <= 0) {
            if (liczbaPlikow <= 0) {
              this.isLoading = true;
              this.assortmentService.deleteAssortment(assortmentId).subscribe(() => {
                this.assortmentService.getAssortments(
                  this.assortmentsPerPage,
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
        this.assortmentService.deleteAssortment(assortmentId).subscribe(() => {
          this.assortmentService.getAssortments(
            this.assortmentsPerPage,
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
    this.assortmentsPerPage = pageData.pageSize;
    this.assortmentService.getAssortments(
      this.assortmentsPerPage,
      this.currentPage,
      this.searchValues
    );
  }

  onSearchAssortment(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      fullName: form.value.nazwaPelna,
      comments: form.value.comments,
      accountManagerLogin: null
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.assortmentService.getAssortments(
      this.assortmentsPerPage,
      this.currentPage,
      this.searchValues
    );
    this.assortmentsSub = this.assortmentService
      .getAssortmentsUpdatedListener()
      .subscribe(
        (assortmentsData: {
          assortments: Assortment[];
          assortmentsCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalAssortments = assortmentsData.assortmentsCount;
          this.assortments = assortmentsData.assortments;
          // console.log(this.assortments);
          this.assortmentsSub.unsubscribe();
        }
      );
  }

  clearForm(form: NgForm) {
    this.assortment.fullName = '';
    this.assortment.comments = '';
    this.assortment.rodzajTowaru = '';
    this.assortment.comments = '';
  }

  utworzNaWzor(id: string) {
    this.router.navigate(['/assortmentcreate', {assortmentId: id, nowy: 'tak'}]);
  }

  dodajDoMagazynu(id: string) {
    this.router.navigate(['/warehousecreate', {assortmentId: id}]);
  }

  ngOnDestroy(): void {
    this.assortmentsSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }
}


