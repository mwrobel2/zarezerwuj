import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contractor } from '../../models/kontrahent.model';
import { ContractorsService } from '../../services/kontrahenci.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Contractorform } from '../../models/formatki/contractorform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { environment } from '../../../environments/environment';
import { PlikiService } from '../../services/pliki.service';

@Component({
  selector: 'app-kontrahent-list',
  templateUrl: './kontrahent-list.component.html',
  styleUrls: ['./kontrahent-list.component.scss']
})
export class KontrahentListComponent implements OnInit, OnDestroy {

  contractors: Contractor[] = [];
  private contractorsSub: Subscription;

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

  totalContractors = 0;
  contractorsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  acKolumny: string[];
  dkKolumny: string[];
  plikiKolumny: string[];

  private searchValues = {
    fullName: '',
    shortName: '',
    nip: '',
    comments: '',
    accountManagerLogin: ''
  };

  contractor = {
    nip: '',
    shortName: '',
    fullName: '',
    comments: '',
    anotherContacts: [{}],
    bankAccounts: [{}]
  };

  isLoading = false;

  // I declare displayed fields
  dispFields: Contractorform = {
    balance: false,
    comments: false,
    creditLimit: false,
    paymentDeadline: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false,
    adres: false,
    kontakty: false,
    firmy: false,
    projekty: false,
    kontBankowe: false,
    pliki: false,
    buttonPliki: false
  };
  backendUrl = environment.backendUrl;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public contractorsService: ContractorsService,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;

        // // jeżeli jest displayName to znaczy że logowaliśmy się przez domenę
        // if (this.loggedInUser.displayName) {
        //   this.userIsAuthenticated = true;
        //   this.usersService.getUserByLogin(user._json.sAMAccountName).subscribe(
        //     userByLogin => {
        //       this.loggedInUser = userByLogin;
        //       this.dispFields = this.loggedInUser.contractorFields;

        //       if (!this.dispFields.widziWszystkie) {
        //         this.searchValues.accountManagerLogin = this.loggedInUser.login;
        //       }

        //       // po zweryfikowaniu usera pobieram kontrahentów
        //       this.contractorsService.getContactors(
        //         this.contractorsPerPage,
        //         this.currentPage,
        //         this.searchValues
        //       );
        //     });
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.contractorFields;

          if (!this.dispFields.widziWszystkie) {
            this.searchValues.accountManagerLogin = this.loggedInUser.login;
          }
          // po zweryfikowaniu usera pobieram kontrahentów
          this.contractorsService.getContactors(
            this.contractorsPerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.contractorsSub = this.contractorsService
      .getContractorsUpdatedListener()
      .subscribe(
        (contractorsData: {
          contractors: Contractor[];
          contractorsCount: number;
        }) => {
          this.isLoading = false;
          this.totalContractors = contractorsData.contractorsCount;
          this.contractors = contractorsData.contractors;
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
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(contractorId: string, pliki: any) {
    if (confirm('Czy na pewno usunąć tego kontrahenta?')) {
      // console.log(contractorId);
      // console.log(pliki);
      // console.log(pliki.length);

      let liczbaPlikow = pliki.length;


      if (pliki.length > 0) {
        pliki.forEach((plik: { fileName: string, katalog: string }) => {
          // console.log('Usuwany plik', plik.fileName);
          this.plikiService.ksujPlik(plik.fileName, plik.katalog).subscribe((res: { usuniety: string }) => {
            // console.log('RES', res);
            liczbaPlikow--;
            // puszczam nawet jeżeli z jakichś powodów pliku nie dało się usunąć
            // if (res.usuniety === 'ok' && liczbaPlikow <= 0) {
            if (liczbaPlikow <= 0) {
              // console.log('wszystkie pliki usuniete');
              this.isLoading = true;
              this.contractorsService.deleteContractor(contractorId).subscribe(() => {
                this.contractorsService.getContactors(
                  this.contractorsPerPage,
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
        this.contractorsService.deleteContractor(contractorId).subscribe(() => {
          this.contractorsService.getContactors(
            this.contractorsPerPage,
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
    this.contractorsPerPage = pageData.pageSize;
    this.contractorsService.getContactors(
      this.contractorsPerPage,
      this.currentPage,
      this.searchValues
    );
  }

  onSearchKontrahent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      fullName: form.value.nazwaPelna,
      shortName: form.value.nazwaKrotka,
      nip: form.value.nip,
      comments: form.value.comments,
      accountManagerLogin: null
    };
    if (!this.dispFields.widziWszystkie) {
      this.searchValues.accountManagerLogin = this.loggedInUser.login;
    }
    this.currentPage = 1;
    this.contractorsService.getContactors(
      this.contractorsPerPage,
      this.currentPage,
      this.searchValues
    );
    this.contractorsSub = this.contractorsService
      .getContractorsUpdatedListener()
      .subscribe(
        (contractorsData: {
          contractors: Contractor[];
          contractorsCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalContractors = contractorsData.contractorsCount;
          this.contractors = contractorsData.contractors;
        }
      );
  }

  clearForm(form: NgForm) {
    this.contractor.nip = '';
    this.contractor.shortName = '';
    this.contractor.fullName = '';
    this.contractor.comments = '';
  }

  ngOnDestroy(): void {
    this.contractorsSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }
}
