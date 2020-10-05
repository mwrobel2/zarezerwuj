import { Component, OnInit, OnDestroy } from '@angular/core';
import { Szkodliwa } from '../../models/szkodliwa';
import { Szkodliwaform } from '../../models/formatki/szkodliwaform.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SzkodliweService } from '../../services/szkodliwe.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { MatTableDataSource } from '@angular/material/table';
import { PlikiService } from '../../services/pliki.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-szkodliwe-add',
  templateUrl: './szkodliwe-add.component.html',
  styleUrls: ['./szkodliwe-add.component.scss']
})
export class SzkodliweAddComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private szkodliwaId: string;
  sprawdzacNIP = true;
  szkodliwa: Szkodliwa = {
    contrType: 'klient',
    miejscePrzech: null,
    creditLimitCurrency: 'PLN',
    balance: 0,
    creditLimit: 0,
    paymentDeadline: 0,
    rok: new Date().getFullYear(),
    anotherContact: { id: null, acName: null, acSurname: null, acPhone: null, acEmail: null, acComment: null },
    bankAccount: { id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false }
  };


  dodatkowyKontakt = false;
  dodatkoweKonto = false;
  public contactsDataSource: any;
  public kontaDataSource: any;
  public firmyDataSource: any;
  public projektyDataSource: any;
  public plikiDataSource: any;
  public zagrozeniaDataSource: any;
  public ososbyZagrDataSource: any;
  acKolumny: string[];
  dkKolumny: string[];
  plikiKolumny: string[];
  firmyKolumny: string[];
  wybraneFirmy: [{}];
  projektyKolumny: string[];
  zagrozeniaKolumny: string[];
  osZagrKolumny: string[];
  wybraneProjekty: [{}];
  liczbaFirm: number;
  liczbaProjektow: number;
  rodzajPliku: string;
  // reactive forms
  form: FormGroup;
  formPliki: FormGroup;
  // plikiLocal: [{name?: string, lastModified?: number, size?: number, type?: string, rodzaj?: string, url?: string}];
  plikiLocal = [];
  plikiLocalData = [];
  aktualnyTypPliku: string;
  backendUrl = environment.backendUrl;
  mozliwoscAnulowania = true;
  // dodatkowe pola z informacją o szczegółach zagrożenia
  zagrozeniaInfo = false;

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

  // private dictionaryId: string;
  dictionaries: Dictionary[] = [
    {
      name: null
    }
  ];

  public osobyZagrozenie: any = [];

  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    szkodliwaFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  // plikAdres: string;
  pliki = [{}];

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public szkodliweService: SzkodliweService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {

    // console.log(this.szkodliwa);
    // inicjuję values dictionaries
    const valStart = { values: [''] };
    this.dictionaries[6] = valStart;
    this.dictionaries[5] = valStart;
    // this.dictionaries[4] = valStart;
    this.dictionaries[3] = valStart;
    this.dictionaries[2] = valStart;
    this.dictionaries[1] = valStart;
    this.dictionaries[0] = valStart;

    this.getDictionary('kontrahentTypy', 0);
    this.getDictionary('kontrahentWaluty', 1);
    this.getDictionary('firmy', 2);
    this.getDictionary('projekty', 3);
    // this.getDictionary('kontrPliki', 4);
    this.getDictionary('szkodliweMiejsca', 5);
    this.getDictionary('rodzajeZagrozen', 6);

    // console.log(this.dictionaries);

    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null)
    });

    this.form = new FormGroup({
      nazwaPelna: new FormControl(null, { validators: [Validators.required] }),
      cas: new FormControl(null),
      producent: new FormControl(null),
      miejscePrzech: new FormControl(null),
      ilosc: new FormControl(null),
      rok: new FormControl(this.szkodliwa.rok),
      jednostka: new FormControl(null),
      zagrozenie: new FormControl(null),
      zgImie: new FormControl(null),
      zgNazwisko: new FormControl(null),
      zgLogin: new FormControl(null),
      zgEmail: new FormControl(null),
      zgStanowisko: new FormControl(null),
      zgCzasZmiana: new FormControl(null),
      zgCzasRok: new FormControl(null),



      nazwaSkrocona: new FormControl(null),
      nip: new FormControl(null),
      typ: new FormControl(null),
      ulica: new FormControl(null),
      miasto: new FormControl(null),
      kod: new FormControl(null),
      panstwo: new FormControl(null),
      ceo: new FormControl(null),
      krs: new FormControl(null),
      regon: new FormControl(null),
      ulicaShipping: new FormControl(null),
      miastoShipping: new FormControl(null),
      kodShipping: new FormControl(null),
      panstwoShipping: new FormControl(null),
      acName: new FormControl(null),
      acSurname: new FormControl(null),
      acPhone: new FormControl(null),
      acEmail: new FormControl(null),
      acComment: new FormControl(null),
      dkNazwa: new FormControl(null),
      dkNrKonta: new FormControl(null),
      firma: new FormControl(null),
      projekt: new FormControl(null),
      terminPlatnosci: new FormControl(null),
      limitKredytowy: new FormControl(null),
      saldo: new FormControl(null),
      limitKredytowyWaluta: new FormControl(null),
      uwagi: new FormControl(null),
    });


    // sprawdzam usera
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.szkodliwaFields;
        }

      },
      error => {
        this.router.navigate(['/login']);
      });

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('szkodliwaId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.szkodliwaId = paramMap.get('szkodliwaId');
        // I'm getting data about szkodliwa
        this.szkodliweService
          .getSzkodliwa(this.szkodliwaId)
          .subscribe(
            (szkodliwaData: { szkodliwa: Szkodliwa }) => {
              this.szkodliwa = szkodliwaData.szkodliwa;
              delete this.szkodliwa._id;
              this.szkodliwa.id = szkodliwaData.szkodliwa._id;
              this.contactsDataSource = new MatTableDataSource(szkodliwaData.szkodliwa.anotherContacts);
              this.kontaDataSource = new MatTableDataSource(szkodliwaData.szkodliwa.bankAccounts);
              this.plikiDataSource = new MatTableDataSource(szkodliwaData.szkodliwa.pliki);
              this.zagrozeniaDataSource = new MatTableDataSource(szkodliwaData.szkodliwa.rodzajeZagrozen);
              // pliki
              if (typeof szkodliwaData.szkodliwa.pliki !== 'undefined') {
                for (const plik of szkodliwaData.szkodliwa.pliki) {
                  this.plikiLocal.push(plik);
                }
              }
              // firmy
              if (typeof szkodliwaData.szkodliwa.firms !== 'undefined') {
                for (const firma of szkodliwaData.szkodliwa.firms) {
                  if (typeof this.wybraneFirmy === 'undefined') {
                    this.wybraneFirmy = [{ name: firma }];
                  } else {
                    this.wybraneFirmy.push({ name: firma });
                  }
                }
                this.firmyDataSource = new MatTableDataSource
                  (this.wybraneFirmy);
              }
              // projekty
              if (typeof szkodliwaData.szkodliwa.projects !== 'undefined') {
                for (const projekt of szkodliwaData.szkodliwa.projects) {
                  if (typeof this.wybraneProjekty === 'undefined') {
                    this.wybraneProjekty = [{ name: projekt }];
                  } else {
                    this.wybraneProjekty.push({ name: projekt });
                  }
                }
                this.projektyDataSource = new MatTableDataSource
                  (this.wybraneProjekty);
              }
              // ustawiam wartości formatki
              // this.form.setValue({
              this.form.patchValue({
                nazwaPelna: this.szkodliwa.fullName,
                cas: this.szkodliwa.cas,
                producent: this.szkodliwa.producent,
                miejscePrzech: this.szkodliwa.miejscePrzech,
                ilosc: this.szkodliwa.ilosc,
                rok: this.szkodliwa.rok,
                jednostka: this.szkodliwa.jednostka,
                zaklad: this.loggedInUser.department,
                zagrozenie: null,


                nazwaSkrocona: this.szkodliwa.shortName,
                nip: this.szkodliwa.nip,
                typ: this.szkodliwa.contrType,
                ulica: this.szkodliwa.street,
                miasto: this.szkodliwa.city,
                kod: this.szkodliwa.postcode,
                panstwo: this.szkodliwa.country,
                ceo: this.szkodliwa.ceo,
                krs: this.szkodliwa.krs,
                regon: this.szkodliwa.regon,
                ulicaShipping: this.szkodliwa.streetShipping,
                miastoShipping: this.szkodliwa.cityShipping,
                kodShipping: this.szkodliwa.postcodeShipping,
                panstwoShipping: this.szkodliwa.countryShipping,
                acName: null,
                acSurname: null,
                acPhone: null,
                acEmail: null,
                acComment: null,
                dkNazwa: null,
                dkNrKonta: null,
                firma: null,
                projekt: null,
                terminPlatnosci: this.szkodliwa.paymentDeadline,
                limitKredytowy: this.szkodliwa.creditLimit,
                saldo: this.szkodliwa.balance,
                limitKredytowyWaluta: this.szkodliwa.creditLimitCurrency,
                uwagi: this.szkodliwa.comments
              });
            }
          );
      } else {
        this.mode = 'create';
        this.szkodliwaId = null;
      }
    });

    this.acKolumny = [
      'acName',
      'acSurname',
      'acEmail',
      'acPhone',
      'acComment',
      'action'
    ];

    this.zagrozeniaKolumny = [
      'zagrozenie',
      'osobyPracujace',
      'action'
    ];

    this.dkKolumny = [
      'dkNazwa',
      'dkNrKonta',
      'dkDomyslne',
      'action'
    ];

    this.firmyKolumny = [
      'name',
      'action'
    ];

    this.projektyKolumny = [
      'name',
      'action'
    ];

    this.plikiKolumny = [
      'name',
      'rodzaj',
      'action'
    ];

    this.osZagrKolumny = [
      'imie',
      'nazwisko',
      'stanowisko',
      'czasZmiana',
      'czasRok',
      'action'
    ];
  }


  onSaveSzkodliwa() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
    });

    const szkodliwa: Szkodliwa = {
      fullName: this.form.value.nazwaPelna,
      cas: this.form.value.cas,
      producent: this.form.value.producent,
      miejscePrzech: this.form.value.miejscePrzech,
      ilosc: this.form.value.ilosc,
      rok: this.form.value.rok,
      jednostka: this.form.value.jednostka,
      zaklad: this.loggedInUser.department,
      rodzajeZagrozen: this.szkodliwa.rodzajeZagrozen,




      shortName: this.form.value.nazwaSkrocona,
      comments: this.form.value.uwagi,
      nip: this.form.value.nip,
      contrType: this.form.value.typ,
      street: this.form.value.ulica,
      city: this.form.value.miasto,
      postcode: this.form.value.kod,
      country: this.form.value.panstwo,
      paymentDeadline: this.form.value.terminPlatnosci,
      creditLimit: this.form.value.limitKredytowy,
      creditLimitCurrency: this.form.value.limitKredytowyWaluta,
      ceo: this.form.value.ceo,
      regon: this.form.value.regon,
      krs: this.form.value.krs,
      status: this.form.value.status,
      balance: this.form.value.saldo,
      firms: this.szkodliwa.firms,
      projects: this.szkodliwa.projects,
      countryShipping: this.form.value.panstwoShipping,
      cityShipping: this.form.value.miastoShipping,
      streetShipping: this.form.value.ulicaShipping,
      postcodeShipping: this.form.value.kodShipping,
      anotherContacts: this.szkodliwa.anotherContacts,
      bankAccounts: this.szkodliwa.bankAccounts,
      pliki: this.plikiLocal
    };
    // check nip format
    if (szkodliwa.nip && this.sprawdzacNIP) {
      szkodliwa.nip = szkodliwa.nip.replace(/-/g, '');
      szkodliwa.nip = szkodliwa.nip.replace(/ /g, '');
      if (szkodliwa.nip.length !== 10) {
        alert('Niepoprawny NIP');
        return;
      }
    }

    if (this.mode === 'create') {
      this.szkodliweService.addSzkodliwa(szkodliwa);
    } else {
      this.szkodliweService.updateSzkodliwa(this.szkodliwaId, szkodliwa);
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

  powrot() {
    // console.log(this.plikiLocal);
    let dlTab = this.plikiLocal.length;
    if (dlTab <= 0) {
      // window.history.go(-1);
      this.router.navigate(['/lazy/szkodliwe']);
    }

    // sprawdzam czy są jakieś niezatwierdzone
    let liczbaNiezatwierdzonych = 0;
    this.plikiLocal.forEach(pl => {
      if (!pl.zatwierdzony) {
        liczbaNiezatwierdzonych++;
      }
    });

    if (liczbaNiezatwierdzonych <= 0) {
      // window.history.go(-1);
      this.router.navigate(['/lazy/szkodliwe']);
    }

    // console.log(dlTab);
    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach(plik => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          // console.log(plik.fileName);
          this.plikiService.ksujPlik(plik.fileName, plik.katalog).subscribe((res: { usuniety: string }) => {
            // console.log(res);
            dlTab--;
            liczbaNiezatwierdzonych--;
            if (res.usuniety === 'ok' && liczbaNiezatwierdzonych <= 0) {
              // console.log('wszystkie usuniete');
              // window.history.go(-1);
              this.router.navigate(['/lazy/szkodliwe']);
            }
          });
        }
      });
    }

  }

  getDictionary(name: string, index: number) {
    return (
      this.dictionaryService
        .getDictionaryName(name)
        .subscribe(dictionaryData => {
          // console.log(dictionaryData.values.length);
          // console.log(dictionaryData);
          this.dictionaries[index] = dictionaryData;
          this.dictionaries[index].liczba = dictionaryData.values.length;
          delete this.dictionaries[index]._id;
          this.dictionaries[index].id = dictionaryData._id;
          // console.log(this.dictionaries[index].liczba);
          // sprawdzam ile jest firm
          if (name === 'firmy') {
            // console.log(this.dictionaries[2].liczba);
            this.liczbaFirm = this.dictionaries[2].liczba;
            // jeżeli tylko jedna firma to ustawiam ją jako domyślną
            // if (this.liczbaFirm === 1) {
            //   if (typeof this.szkodliwa.firms === 'undefined') {
            //     this.szkodliwa.firms = [this.dictionaries[2].values[0]];
            //     this.wybraneFirmy = [{ name: this.dictionaries[2].values[0] }];
            //     this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            //   } else if (this.szkodliwa.firms.length <= 0) {
            //     this.szkodliwa.firms = [this.dictionaries[2].values[0]];
            //     this.wybraneFirmy = [{ name: this.dictionaries[2].values[0] }];
            //     this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            //   }
            // }
          }
          // sprawdzam ile jest projektów
          if (name === 'projekty') {
            this.liczbaProjektow = this.dictionaries[3].liczba;
            // jeżeli tylko jeden to ustawiam projekt jako domyślny
            // if (this.liczbaProjektow === 1) {
            //   if (typeof this.szkodliwa.projects === 'undefined') {
            //     this.szkodliwa.projects = [this.dictionaries[3].values[0]];
            //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
            //     this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
            //   } else if (this.szkodliwa.projects.length <= 0) {
            //     this.szkodliwa.projects = [this.dictionaries[3].values[0]];
            //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
            //     this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
            //   }
            // }
          }
        })
    );
  }

  nextContact() {
    this.dodatkowyKontakt = !this.dodatkowyKontakt;
    this.szkodliwa.anotherContact = {
      acName: null,
      acSurname: null,
      acPhone: null,
      acEmail: null,
      acComment: null
    };
  }

  nextKonto() {
    this.dodatkoweKonto = !this.dodatkoweKonto;
    this.szkodliwa.bankAccount = {
      id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false
    };
  }

  // dodaję kolejną osobę do kontaktu
  addContact() {
    if (typeof this.szkodliwa.anotherContacts === 'undefined') {
      this.szkodliwa.anotherContacts = [{
        id: Date.now(),
        acName: this.form.value.acName,
        acSurname: this.form.value.acSurname,
        acEmail: this.form.value.acEmail,
        acPhone: this.form.value.acPhone,
        acComment: this.form.value.acComment
      }];
    } else {
      this.szkodliwa.anotherContacts.push({
        id: Date.now(),
        acName: this.form.value.acName,
        acSurname: this.form.value.acSurname,
        acEmail: this.form.value.acEmail,
        acPhone: this.form.value.acPhone,
        acComment: this.form.value.acComment
      }
      );
    }
    // }
    this.form.patchValue({
      id: null,
      acName: null,
      acSurname: null,
      acEmail: null,
      acPhone: null,
      acComment: null
    });
    this.contactsDataSource = new MatTableDataSource(this.szkodliwa.anotherContacts);
  }

  // dodaję kolejne konto bankowe
  addKonto() {
    if (typeof this.szkodliwa.bankAccounts === 'undefined') {
      this.szkodliwa.bankAccounts = [{
        id: Date.now(),
        dkNazwa: this.form.value.dkNazwa,
        dkNrKonta: this.form.value.dkNrKonta,
        dkDomyslne: this.szkodliwa.bankAccount.dkDomyslne
      }];
    } else {
      this.szkodliwa.bankAccounts.push({
        id: Date.now(),
        dkNazwa: this.form.value.dkNazwa,
        dkNrKonta: this.form.value.dkNrKonta,
        dkDomyslne: this.szkodliwa.bankAccount.dkDomyslne
      });
    }
    // }
    this.form.patchValue({
      id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false
    });
    this.kontaDataSource = new MatTableDataSource(this.szkodliwa.bankAccounts);
  }

  pokazZagrInfo() {
    if (this.form.value.zagrozenie === 'H340' || this.form.value.zagrozenie === 'H350' ||
      this.form.value.zagrozenie === 'H350i' || this.form.value.zagrozenie === 'H341' || this.form.value.zagrozenie === 'H351') {
      this.zagrozeniaInfo = true;
    } else {
      this.zagrozeniaInfo = false;
    }
  }

  dodajZagrozenie() {
    if (typeof this.szkodliwa.rodzajeZagrozen === 'undefined') {
      this.szkodliwa.rodzajeZagrozen = [{
        id: Date.now(),
        zagrozenie: this.form.value.zagrozenie,
        osobyPracujace: this.osobyZagrozenie
      }];
      this.osobyZagrozenie = [];
    } else {
      if (this.szkodliwa.rodzajeZagrozen.map(x => x.zagrozenie).indexOf(this.form.value.zagrozenie) < 0) {
        this.szkodliwa.rodzajeZagrozen.push({
          id: Date.now(),
          zagrozenie: this.form.value.zagrozenie,
          osobyPracujace: this.osobyZagrozenie
        });
        this.osobyZagrozenie = [];
      } else {
        // to zagrożenie jest już w liście
        alert(`Zagrożenie ${this.form.value.zagrozenie} jest już dodane do listy.`);
      }
    }
    this.zagrozeniaDataSource = new MatTableDataSource(this.szkodliwa.rodzajeZagrozen);
  }

  dodajOsobaZagr() {
    if (this.osobyZagrozenie.map(x => x.nazwisko).indexOf(this.form.value.zgNazwisko) < 0) {
      this.osobyZagrozenie.push({
        id: Date.now(),
        imie: this.form.value.zgImie,
        nazwisko: this.form.value.zgNazwisko,
        stanowisko: this.form.value.zgStanowisko,
        czasZmiana: this.form.value.zgCzasZmiana,
        czasRok: this.form.value.zgCzasRok
      });
      this.ososbyZagrDataSource = new MatTableDataSource(this.osobyZagrozenie);
    } else {
      alert(`${this.form.value.zgImie} ${this.form.value.zgNazwisko} jest już na liście.`);
    }
    this.form.patchValue({
      zgImie: null, zgNazwisko: null, zgStanowisko: null, zgCzasRok: null, zgCzasZmiana: null
    });
  }

  deleteZagrozenie(element) {
    this.szkodliwa.rodzajeZagrozen.splice(this.szkodliwa.rodzajeZagrozen.indexOf(element), 1);
    this.zagrozeniaDataSource = new MatTableDataSource(this.szkodliwa.rodzajeZagrozen);
  }

  editContact(element) {
    this.dodatkowyKontakt = true;
    this.szkodliwa.anotherContact = { id: null, acName: null, acSurname: null, acPhone: null, acEmail: null, acComment: null };
    if (
      typeof element.acName !== 'undefined'
    ) {
      this.form.patchValue({
        acName: element.acName
      });
    }
    if (
      typeof element.acSurname !== 'undefined'
    ) {
      this.form.patchValue({
        acSurname: element.acSurname
      });
    }
    if (
      typeof element.acEmail !== 'undefined'
    ) {
      this.form.patchValue({
        acEmail: element.acEmail
      });
    }
    if (
      typeof element.acPhone !== 'undefined'
    ) {
      this.form.patchValue({
        acPhone: element.acPhone
      });
    }
    if (
      typeof element.acComment !== 'undefined'
    ) {
      this.form.patchValue({
        acComment: element.acComment
      });
    }
    this.deleteContact(element);
  }


  editKonto(element) {
    this.dodatkoweKonto = true;
    this.szkodliwa.bankAccount = { id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: null };
    if (
      typeof element.dkNazwa !== 'undefined'
    ) {
      this.form.patchValue({
        dkNazwa: element.dkNazwa
      });
    }
    if (
      typeof element.dkNrKonta !== 'undefined'
    ) {
      this.form.patchValue({
        dkNrKonta: element.dkNrKonta
      });
    }
    if (
      typeof element.dkDomyslne !== 'undefined'
    ) {
      this.form.patchValue({
        dkDomyslne: element.dkDomyslne
      });
    }
    this.deleteKonto(element);
  }

  deletePlik(element) {
    if (confirm('Czy na pewno usunąć plik?')) {
      if (element.zatwierdzony) {
        this.mozliwoscAnulowania = false;
        alert('Pamiętaj aby zapisać nowe dane!');
      }
      this.plikiService.ksujPlik(element.fileName, element.katalog).subscribe((res: { usuniety: string }) => {
        if (res.usuniety === 'ok') {
          this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
          this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
        } else {
          alert(`Plik został już usunięty wcześniej.`);
          this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
          this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
        }
      });
    }
  }

  deleteContact(element) {
    this.szkodliwa.anotherContacts.splice(this.szkodliwa.anotherContacts.indexOf(element), 1);
    this.contactsDataSource = new MatTableDataSource(this.szkodliwa.anotherContacts);
  }

  deleteKonto(element) {
    this.szkodliwa.bankAccounts.splice(this.szkodliwa.bankAccounts.indexOf(element), 1);
    this.kontaDataSource = new MatTableDataSource(this.szkodliwa.bankAccounts);
  }

  wyborFirmy(firma: string) {
    if (typeof this.szkodliwa.firms === 'undefined' || this.szkodliwa.firms.length <= 0) {
      this.szkodliwa.firms = [firma];
      this.wybraneFirmy = [{ name: firma }];
    } else {
      if (!this.szkodliwa.firms.includes(firma)) {
        this.szkodliwa.firms.push(firma);
        this.wybraneFirmy.push({ name: firma });
      }
    }
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborPliku(plik: string) {
    console.log(plik);
  }

  deleteFirma(element) {
    this.szkodliwa.firms.splice(this.szkodliwa.firms.indexOf(element.name), 1);
    this.wybraneFirmy.splice(this.wybraneFirmy.indexOf(element), 1);
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborProjektu(projekt: string) {
    if (typeof this.szkodliwa.projects === 'undefined' || this.szkodliwa.projects.length <= 0) {
      this.szkodliwa.projects = [projekt];
      this.wybraneProjekty = [{ name: projekt }];
    } else {
      if (!this.szkodliwa.projects.includes(projekt)) {
        this.szkodliwa.projects.push(projekt);
        this.wybraneProjekty.push({ name: projekt });
      }
    }
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  deleteProjekt(element) {
    this.szkodliwa.projects.splice(this.szkodliwa.projects.indexOf(element.name), 1);
    this.wybraneProjekty.splice(this.wybraneProjekty.indexOf(element), 1);
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  changeNIPcheck() {
    this.sprawdzacNIP = !this.sprawdzacNIP;
  }

  kontoDomyslne() {
    this.szkodliwa.bankAccount.dkDomyslne = !this.szkodliwa.bankAccount.dkDomyslne;
    if (typeof this.szkodliwa.bankAccounts !== 'undefined') {
      if (this.szkodliwa.bankAccount.dkDomyslne) {
        for (const bkAccount of this.szkodliwa.bankAccounts) {
          bkAccount.dkDomyslne = false;
        }
        this.kontaDataSource = new MatTableDataSource(this.szkodliwa.bankAccounts);
      }
    }
  }

  onFilesPicked(event: any) {
    const plikiTmp = (event.target as HTMLInputElement).files;
    if (plikiTmp.length > 0) {
      this.plikiLocalData = event.target.files;
      this.onAddPliki();
    }
  }

  onAddPliki() {
    const plikiData = new FormData();
    for (const plik of this.plikiLocalData) {
      plik.newNazwa = plik.name;
      plikiData.append('pliki', plik);
      plikiData.append('katalog', 'szkodliwe');
    }
    this.plikiService.wysylaniePlikow(plikiData).subscribe(
      (res: { status: string, plikiZapisane: any }) => {
        if (res.status === 'ok') {
          res.plikiZapisane.forEach(plik => {
            this.plikiLocal.push({
              name: plik.originalname,
              fileName: plik.filename,
              size: plik.size,
              type: plik.mimetype,
              rodzaj: this.aktualnyTypPliku,
              url: plik.path,
              zatwierdzony: false
            });
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
        }
      },
      (err) => console.log(err)
    );
  }

  ustawAktualnyTypPliku(typPliku: string) {
    this.aktualnyTypPliku = typPliku;
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }
}

