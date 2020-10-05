import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pracownicy } from '../../models/pracownicy.model';
import { PracownicyService } from '../../services/pracownicy.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service'
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import { Pracownicyform } from '../../models/formatki/pracownicyform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { environment } from '../../../environments/environment';
import { PlikiService } from '../../services/pliki.service';

@Component({
  selector: 'app-pracownicy',
  templateUrl: './pracownicy.component.html',
  styleUrls: ['./pracownicy.component.scss']
})
export class PracownicyComponent implements OnInit, OnDestroy {


  pracownicys: Pracownicy[] = [];
  private pracownicySub: Subscription;

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
    warehouseFields: null
    // pracownicyFields: null
  };

  totalPracownicys = 0;
  pracownicyPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // kolumny dodatkowych obiektów
  rachunkiBankoweKolumny: string[];
  stanowiskaKolumny: string[];
  umowyoPraceKolumny: string[];
  adresyZamieszkaniaKolumny: string[];
  przebiegZatrudnieniaKolumny: string[];
  dzieciKolumny: string[];
  oswiadczeniaKolumny: string[];
  zezwoleniaKolumny: string[];
  kartyPobytuKolumny: string[];
  paszportyKolumny: string[];
  badaniaOkresoweKolumny: string[];
  szkoleniaBHPKolumny: string[];
  dodatkoweKwalifikacjeKolumny: string[];
  wyroznieniaKaryKolumny: string[];
  kluczeKolumny: string[];
  wybraneFirmy: [{}];
  projektyKolumny: string[];
  firmyKolumny: string[];
  plikiKolumny: string[];
  wybraneProjekty: [{}];
  liczbaFirm: number;
  liczbaProjektow: number;
  rodzajPliku: string;

  private searchValues = {
    name: '',
    surname: '',
    accountManagerLogin: '',
    username: '',
    departament: '',
    email: ''
  };

  pracownicy = {
    name: '',
    surname: '',
    username: '',
    departament: '',
    email: ''
  };

  isLoading = false;

  // I declare displayed fields
  // dispFields: Pracownicyform = {
  //   surname: false,
  //   status: false,
  //   buttonDodajKontr: false,
  //   buttonEdytujKontr: false,
  //   buttonUsunKontr: false,
  //   widziWszystkie: false,
  //   firmy: false,
  //   projekty: false,
  //   pliki: false,
  //   buttonPliki: false
  // };
  backendUrl = environment.backendUrl;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public pracownicyService: PracownicyService,
    public usersService: UsersService,
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
          // this.dispFields = this.loggedInUser.pracownicyFields;

          // if (!this.dispFields.widziWszystkie) {
          //   this.searchValues.accountManagerLogin = this.loggedInUser.login;
          // }
          // po zweryfikowaniu usera pobieram pliki z bazy
          this.pracownicyService.getPracownicys(
            this.pracownicyPerPage,
            this.currentPage,
            this.searchValues
          );
        }
      },
      error => {
        this.router.navigate(['/login']);
      });

    this.pracownicySub = this.pracownicyService
      .getPracownicysUpdatedListener()
      .subscribe(
        (pracownicyData: {
          pracownicys: Pracownicy[];
          pracownicysCount: number;
        }) => {
          this.isLoading = false;
          this.totalPracownicys = pracownicyData.pracownicysCount;
          this.pracownicys = pracownicyData.pracownicys;
        }
      );

    this.rachunkiBankoweKolumny = ["nr", "glowny", "nazwaBanku"];
    this.stanowiskaKolumny = [
      "stanowisko",
      "od",
      "do",
      "uwagi",
      "aktualne",
      "firmaNazwa",
      "department",
      "dataZatrudnienia",
      "rodzajUmowy",
      "dataZwolnienia",
      "zajmowaneStanowisko",
      "zawodWykonywany",
      "stanowiskaUwagi",
      "plikiStanowiska"
    ];
    this.umowyoPraceKolumny = [
      "numer",
      "od",
      "do",
      "typUmowy",
      "dataPodpisu",
      "przedstawicielZakladu",
      "umowyoPraceuwagi",
      "firmaNazwa",
      "aktualna",
      "plikiUmowyPraca"
    ];
    this.adresyZamieszkaniaKolumny = [
      "kraj",
      "wojewodztwo",
      "powiat",
      "gmina",
      "miejscowosc",
      "ulica",
      "numerDomu",
      "numerMieszkania",
      "kod",
      "tel",
      "aktualny",
      "od",
      "do",
      "adrZamUwagi"
    ];
    this.przebiegZatrudnieniaKolumny = [
      "od",
      "do",
      "rodzajZmiany",
      "stanowisko",
      "dzial",
      "wymiarZatrudnienia",
      "wymiarZatrudnieniaUlamek",
      "placaZasadnicza",
      "placZasWaluta",
      "dodatekFunkcyjny",
      "dodFunkcWaluta",
      "dodatek",
      "dodatekWaluta",
      "firmaNazwa",
      "podstawaPrawnaZatrudnienia",
      "rodzajUmowy",
      "plikiPrzebZatr"
    ];
    this.dzieciKolumny = [
      "imieDziecka",
      "nazwiskoDziecka",
      "dataUrodzeniaDziecka",
      "peselDziecka",
      "zasilekPielegnOd",
      "zasilekPielegnDo",
      "zasilekRodzinnyOd",
      "zasilekRodzinnyDo",
      "plikiDzieci"
    ];
    this.oswiadczeniaKolumny = [
      "nazwaOswiadczenia",
      "typOswiadczenia",
      "kodZawoduOsw",
      "pracodawcaUzytkownikOsw",
      "OswOd",
      "OswDo",
      "plikiOswiadczenia"
    ];
    this.zezwoleniaKolumny = [
      "nazwaZezwolenia",
      "typZezwolenia",
      "kodZawoduZezw",
      "pracodawcaUzytkownikZezw",
      "ZezwOd",
      "ZezwDo",
      "plikiZezwolenia"
    ];
    this.kartyPobytuKolumny = [
      "kartaOd",
      "kartaDo",
      "nazwaKarty",
      "numerKarty",
      "plikiKP"
    ];
    this.paszportyKolumny = [
      "paszportOd",
      "paszportDo",
      "nrPaszportu",
      "plikiKP"
    ];
    this.badaniaOkresoweKolumny = [
      "od",
      "do",
      "badOkrUwagi",
      "aktualne",
      "plikiBadOkr"
    ];
    this.szkoleniaBHPKolumny = [
      "od",
      "do",
      "szkoleniaBhpUwagi",
      "aktualne",
      "plikiBHP"
    ];
    this.dodatkoweKwalifikacjeKolumny = [
      "od",
      "do",
      "dodKwalifUwagi",
      "plikiKwalifikacje"
    ];
    this.wyroznieniaKaryKolumny = ["od", "do", "wyrKarUwagi", "plikiWyrKar"];
    this.kluczeKolumny = ["name"];
    this.plikiKolumny = ["name", "rodzaj"];

  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(pracownicyId: string, pliki: any) {
    if (confirm('Czy na pewno usunąć informację o pracowniku?')) {
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
              this.pracownicyService.deletePracownicy(pracownicyId).subscribe(() => {
                this.pracownicyService.getPracownicys(
                  this.pracownicyPerPage,
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
        this.pracownicyService.deletePracownicy(pracownicyId).subscribe(() => {
          this.pracownicyService.getPracownicys(
            this.pracownicyPerPage,
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
    this.pracownicyPerPage = pageData.pageSize;
    this.pracownicyService.getPracownicys(
      this.pracownicyPerPage,
      this.currentPage,
      this.searchValues
    );
  }

  onSearchPracownicy(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.searchValues = {
      name: form.value.name,
      surname: form.value.surname,
      accountManagerLogin: null,
      username: form.value.username,
      departament: form.value.departament,
      email: form.value.email
    };
    // if (!this.dispFields.widziWszystkie) {
    //   this.searchValues.accountManagerLogin = this.loggedInUser.login;
    // }
    this.currentPage = 1;
    this.pracownicyService.getPracownicys(
      this.pracownicyPerPage,
      this.currentPage,
      this.searchValues
    );
    this.pracownicySub = this.pracownicyService
      .getPracownicysUpdatedListener()
      .subscribe(
        (pracownicyData: {
          pracownicys: Pracownicy[];
          pracownicysCount: number;
        }) => {
          // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
          this.isLoading = false;
          this.totalPracownicys = pracownicyData.pracownicysCount;
          this.pracownicys = pracownicyData.pracownicys;
        }
      );
  }

  clearForm(form: NgForm) {
    this.pracownicy.name = '';
    this.pracownicy.surname = '';
    this.pracownicy.username = '';
    this.pracownicy.departament = '';
    this.pracownicy.email = '';
  }

  utworzNaWzor(id: string) {
    this.router.navigate(['/lazy/pracownikadd', { pracownikId: id, nowy: 'tak' }]);
  }

  ngOnDestroy(): void {
    this.pracownicySub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }

  kopiujUserowDoPracownicow() {
    console.log(this.usersService.getUsers());
    //dorobić metodę
  }
}


