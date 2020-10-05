import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contractor } from '../../models/kontrahent.model';
import { Contractorform } from '../../models/formatki/contractorform.model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractorsService } from '../../services/kontrahenci.service';
import { FormsService } from '../../services/forms.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { KrsService } from '../../services/krs.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { MatTableDataSource } from '@angular/material/table';
import { PlikiService } from '../../services/pliki.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-kontrahent-create',
  templateUrl: './kontrahent-create.component.html',
  styleUrls: ['./kontrahent-create.component.scss']
})
export class KontrahentCreateComponent implements OnInit, OnDestroy {
  // domyślny typ kontrahenta
  private mode = 'create';
  private contractorId: string;
  sprawdzacNIP = true;
  contractor: Contractor = {
    shortName: null,
    contrType: 'klient',
    creditLimitCurrency: 'PLN',
    balance: 0,
    creditLimit: 0,
    paymentDeadline: 0,
    anotherContact: { id: null, acName: null, acSurname: null, acPhone: null, acEmail: null, acComment: null },
    bankAccount: { id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false }
  };

  // czy wyświetlać formatkę dodawania dodatkowego
  // kontaktu
  dodatkowyKontakt = false;
  dodatkoweKonto = false;
  // do matTablec anotehrContacts
  public contactsDataSource: any;
  // do matTable kont bankowych
  public kontaDataSource: any;
  public firmyDataSource: any;
  public projektyDataSource: any;
  public plikiDataSource: any;
  acKolumny: string[];
  dkKolumny: string[];
  plikiKolumny: string[];
  firmyKolumny: string[];
  wybraneFirmy: [{}];
  projektyKolumny: string[];
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

  // private dictionaryId: string;
  dictionaries: Dictionary[] = [
    {
      name: null
    }
  ];

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

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  // plikAdres: string;
  pliki = [{}];

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public contractorsService: ContractorsService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private krsService: KrsService,
    private formsService: FormsService,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {
    const valStart = { values: [''] };
    this.dictionaries[4] = valStart;
    this.dictionaries[3] = valStart;
    this.dictionaries[2] = valStart;
    this.dictionaries[1] = valStart;
    this.dictionaries[0] = valStart;

    this.getDictionary('kontrahentTypy', 0);
    this.getDictionary('kontrahentWaluty', 1);
    this.getDictionary('firmy', 2);
    this.getDictionary('projekty', 3);
    this.getDictionary('kontrPliki', 4);

    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null)
    });

    this.form = new FormGroup({
      nazwaSkrocona: new FormControl(null, { validators: [Validators.required] }),
      nazwaPelna: new FormControl(null),
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
      widziCeneEuro: new FormControl(null),
      uwagi: new FormControl(null),
    });


    // sprawdzam usera
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;

        // jeżeli jest displayName to znaczy że logowaliśmy się przez domenę
        // if (this.loggedInUser.displayName) {
        //   this.userIsAuthenticated = true;
        //   this.usersService.getUserByLogin(user._json.sAMAccountName).subscribe(
        //     userByLogin => {
        //       this.loggedInUser = userByLogin;
        //       this.dispFields = this.loggedInUser.contractorFields;
        //     });
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
          this.dispFields = this.loggedInUser.contractorFields;
        }

      },
      error => {
        this.router.navigate(['/login']);
      });

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('contractorId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.contractorId = paramMap.get('contractorId');
        // I'm getting data about contractor
        this.contractorsService
          .getContractor(this.contractorId)
          .subscribe(
            (contractorData: { contractor: Contractor }) => {
              this.contractor = contractorData.contractor;
              delete this.contractor._id;
              this.contractor.id = contractorData.contractor._id;
              this.contactsDataSource = new MatTableDataSource(contractorData.contractor.anotherContacts);
              this.kontaDataSource = new MatTableDataSource(contractorData.contractor.bankAccounts);
              this.plikiDataSource = new MatTableDataSource(contractorData.contractor.pliki);
              // pliki
              if (typeof contractorData.contractor.pliki !== 'undefined') {
                for (const plik of contractorData.contractor.pliki) {
                  this.plikiLocal.push(plik);
                }
              }
              // firmy
              if (typeof contractorData.contractor.firms !== 'undefined') {
                for (const firma of contractorData.contractor.firms) {
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
              if (typeof contractorData.contractor.projects !== 'undefined') {
                for (const projekt of contractorData.contractor.projects) {
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
                nazwaSkrocona: this.contractor.shortName,
                nazwaPelna: this.contractor.fullName,
                nip: this.contractor.nip,
                typ: this.contractor.contrType,
                ulica: this.contractor.street,
                miasto: this.contractor.city,
                kod: this.contractor.postcode,
                panstwo: this.contractor.country,
                ceo: this.contractor.ceo,
                krs: this.contractor.krs,
                regon: this.contractor.regon,
                ulicaShipping: this.contractor.streetShipping,
                miastoShipping: this.contractor.cityShipping,
                kodShipping: this.contractor.postcodeShipping,
                panstwoShipping: this.contractor.countryShipping,
                acName: null,
                acSurname: null,
                acPhone: null,
                acEmail: null,
                acComment: null,
                dkNazwa: null,
                dkNrKonta: null,
                firma: null,
                projekt: null,
                terminPlatnosci: this.contractor.paymentDeadline,
                limitKredytowy: this.contractor.creditLimit,
                saldo: this.contractor.balance,
                limitKredytowyWaluta: this.contractor.creditLimitCurrency,
                widziCeneEuro: this.contractor.widziCeneEuro,
                uwagi: this.contractor.comments
              });
            }
          );
      } else {
        this.mode = 'create';
        this.contractorId = null;
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

  }



  onSaveKontrahent() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
      plik.katalog = 'kontakty';
    });

    const contractor: Contractor = {
      shortName: this.form.value.nazwaSkrocona,
      fullName: this.form.value.nazwaPelna,
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
      firms: this.contractor.firms,
      projects: this.contractor.projects,
      countryShipping: this.form.value.panstwoShipping,
      cityShipping: this.form.value.miastoShipping,
      streetShipping: this.form.value.ulicaShipping,
      postcodeShipping: this.form.value.kodShipping,
      anotherContacts: this.contractor.anotherContacts,
      bankAccounts: this.contractor.bankAccounts,
      widziCeneEuro: this.form.value.widziCeneEuro,
      pliki: this.plikiLocal
    };
    // check nip format
    if (contractor.nip && this.sprawdzacNIP) {
      contractor.nip = contractor.nip.replace(/-/g, '');
      contractor.nip = contractor.nip.replace(/ /g, '');
      if (contractor.nip.length !== 10) {
        alert('Niepoprawny NIP');
        return;
      }
    }

    if (this.mode === 'create') {
      // this.contractorsService.addContractor(contractor, this.form.value.plik);
      this.contractorsService.addContractor(contractor);
    } else {
      this.contractorsService.updateContractor(this.contractorId, contractor);
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
      this.router.navigate(['/contractorslist']);
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
      this.router.navigate(['/contractorslist']);
    }

    // console.log(dlTab);
    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach(plik => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          // console.log(plik.fileName);
          this.plikiService.kasujPlikKontakty(plik.fileName).subscribe((res: { usuniety: string }) => {
            // console.log(res);
            dlTab--;
            liczbaNiezatwierdzonych--;
            if (res.usuniety === 'ok' && liczbaNiezatwierdzonych <= 0) {
              // console.log('wszystkie usuniete');
              // window.history.go(-1);
              this.router.navigate(['/contractorslist']);
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
            //   if (typeof this.contractor.firms === 'undefined') {
            //     this.contractor.firms = [this.dictionaries[2].values[0]];
            //     this.wybraneFirmy = [{ name: this.dictionaries[2].values[0] }];
            //     this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            //   } else if (this.contractor.firms.length <= 0) {
            //     this.contractor.firms = [this.dictionaries[2].values[0]];
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
            //   if (typeof this.contractor.projects === 'undefined') {
            //     this.contractor.projects = [this.dictionaries[3].values[0]];
            //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
            //     this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
            //   } else if (this.contractor.projects.length <= 0) {
            //     this.contractor.projects = [this.dictionaries[3].values[0]];
            //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
            //     this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
            //   }
            // }
          }
        })
    );
  }

  sprawdzNip() {
    let nip = this.form.value.nip;
    if (nip && nip.length >= 10) {
      if (nip.length > 10) {
        nip = nip.replace(/-/g, '');
        nip = nip.replace(/ /g, '');
      }
      if (nip.length !== 10) {
        alert('Niepoprawny NIP');
        return;
      }
      this.krsService.getLocalNip(nip).subscribe(daneFirmy => {
        if (daneFirmy.total === 1) {
          let ceoLocal: string;
          if (daneFirmy.items[0].ceo) {
            ceoLocal = daneFirmy.items[0].ceo.name;
          } else {
            ceoLocal = '';
          }
          this.form.patchValue({
            nazwaSkrocona: daneFirmy.items[0].name_short,
            nazwaPelna: daneFirmy.items[0].name,
            ulica: daneFirmy.items[0].address.street + ' ' + daneFirmy.items[0].address.house_no,
            miasto: daneFirmy.items[0].address.city,
            kod: daneFirmy.items[0].address.code,
            panstwo: daneFirmy.items[0].address.country,
            ceo: ceoLocal,
            regon: daneFirmy.items[0].regon,
            krs: daneFirmy.items[0].krs,

          });
          // do uzupełnienia później
          // if (!daneFirmy.items[0].is_removed) {
          //   this.contractor.status = 'Aktywny w KRS';
          // } else {
          //   this.contractor.status = 'Usunięty z KRS';
          // }
        }
      });
    }
  }

  nextContact() {
    this.dodatkowyKontakt = !this.dodatkowyKontakt;
    this.contractor.anotherContact = {
      acName: null,
      acSurname: null,
      acPhone: null,
      acEmail: null,
      acComment: null
    };
  }

  nextKonto() {
    this.dodatkoweKonto = !this.dodatkoweKonto;
    this.contractor.bankAccount = {
      id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false
    };
  }

  // dodaję kolejną osobę do kontaktu
  addContact() {
    if (typeof this.contractor.anotherContacts === 'undefined') {
      this.contractor.anotherContacts = [{
        id: Date.now(),
        acName: this.form.value.acName,
        acSurname: this.form.value.acSurname,
        acEmail: this.form.value.acEmail,
        acPhone: this.form.value.acPhone,
        acComment: this.form.value.acComment
      }];
    } else {
      this.contractor.anotherContacts.push({
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
    this.contactsDataSource = new MatTableDataSource(this.contractor.anotherContacts);
  }

  // dodaję kolejne konto bankowe
  addKonto() {
    if (typeof this.contractor.bankAccounts === 'undefined') {
      this.contractor.bankAccounts = [{
        id: Date.now(),
        dkNazwa: this.form.value.dkNazwa,
        dkNrKonta: this.form.value.dkNrKonta,
        dkDomyslne: this.contractor.bankAccount.dkDomyslne
      }];
    } else {
      this.contractor.bankAccounts.push({
        id: Date.now(),
        dkNazwa: this.form.value.dkNazwa,
        dkNrKonta: this.form.value.dkNrKonta,
        dkDomyslne: this.contractor.bankAccount.dkDomyslne
      });
    }
    // }
    this.form.patchValue({
      id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: false
    });
    this.kontaDataSource = new MatTableDataSource(this.contractor.bankAccounts);
  }

  editContact(element) {
    this.dodatkowyKontakt = true;
    this.contractor.anotherContact = { id: null, acName: null, acSurname: null, acPhone: null, acEmail: null, acComment: null };
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
    this.contractor.bankAccount = { id: null, dkNazwa: null, dkNrKonta: null, dkDomyslne: null };
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
        alert('Pamiętaj aby zapisać kontrahenta!');
      }
      // console.log(element);
      this.plikiService.kasujPlikKontakty(element.fileName).subscribe((res: { usuniety: string }) => {
        // console.log(res);
        if (res.usuniety === 'ok') {
          this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
          this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          // this.onSaveKontrahent();
        } else {
          alert(`Plik został już usunięty wcześniej.`);
          // console.log(this.plikiLocal);
          this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
          this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
        }
      });
    }
  }

  deleteContact(element) {
    this.contractor.anotherContacts.splice(this.contractor.anotherContacts.indexOf(element), 1);
    this.contactsDataSource = new MatTableDataSource(this.contractor.anotherContacts);
  }

  deleteKonto(element) {
    this.contractor.bankAccounts.splice(this.contractor.bankAccounts.indexOf(element), 1);
    this.kontaDataSource = new MatTableDataSource(this.contractor.bankAccounts);
  }

  wyborFirmy(firma: string) {
    if (typeof this.contractor.firms === 'undefined' || this.contractor.firms.length <= 0) {
      this.contractor.firms = [firma];
      this.wybraneFirmy = [{ name: firma }];
    } else {
      if (!this.contractor.firms.includes(firma)) {
        this.contractor.firms.push(firma);
        this.wybraneFirmy.push({ name: firma });
      }
    }
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborPliku(plik: string) {
    console.log(plik);
  }

  deleteFirma(element) {
    this.contractor.firms.splice(this.contractor.firms.indexOf(element.name), 1);
    this.wybraneFirmy.splice(this.wybraneFirmy.indexOf(element), 1);
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborProjektu(projekt: string) {
    if (typeof this.contractor.projects === 'undefined' || this.contractor.projects.length <= 0) {
      this.contractor.projects = [projekt];
      this.wybraneProjekty = [{ name: projekt }];
    } else {
      if (!this.contractor.projects.includes(projekt)) {
        this.contractor.projects.push(projekt);
        this.wybraneProjekty.push({ name: projekt });
      }
    }
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  deleteProjekt(element) {
    this.contractor.projects.splice(this.contractor.projects.indexOf(element.name), 1);
    this.wybraneProjekty.splice(this.wybraneProjekty.indexOf(element), 1);
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  changeNIPcheck() {
    this.sprawdzacNIP = !this.sprawdzacNIP;
  }

  kontoDomyslne() {
    this.contractor.bankAccount.dkDomyslne = !this.contractor.bankAccount.dkDomyslne;
    if (typeof this.contractor.bankAccounts !== 'undefined') {
      if (this.contractor.bankAccount.dkDomyslne) {
        for (const bkAccount of this.contractor.bankAccounts) {
          bkAccount.dkDomyslne = false;
        }
        this.kontaDataSource = new MatTableDataSource(this.contractor.bankAccounts);
      }
    }
  }

  onFilesPicked(event: any) {
    // console.log(this.formPliki.value.typPliku);
    // const file = (event.target as HTMLInputElement).files[0];
    const plikiTmp = (event.target as HTMLInputElement).files;
    // this.form.patchValue({
    //   plik: file
    // });
    // this.form.get('plik').updateValueAndValidity();
    // console.log(file.name);
    // console.log(event);
    // console.log(event.target.files[0].name);
    if (plikiTmp.length > 0) {
      // plikiLocalData będą wysyłane do backendu
      this.plikiLocalData = event.target.files;
      // console.log(plikiTmp);
      // console.log(event.target.files);

      // Array.from(event.target.files).forEach((elem: {
      //   name?: string,
      //   lastModified?: number,
      //   size?: number,
      //   type?: string,
      //   rodzaj?: string,
      //   url?: string
      // }) => {
      //   // console.log(elem);
      //   this.plikiLocal.push({
      //     name: elem.name,
      //     fileName: 'nazwaPliku',
      //     lastModified: elem.lastModified,
      //     size: elem.size,
      //     type: elem.type,
      //     rodzaj: this.formPliki.value.typPliku,
      //     url: 'jakisUrl'
      //   });
      // });

      // event.target.files.forEach(element => {
      // console.log('elem ', element);
      // });
      // console.log(this.plikiLocal);
      // this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
      this.onAddPliki();
    }
  }

  onAddPliki() {
    // console.log('TYPPLIKU', this.formPliki.value.typPliku);

    const plikiData = new FormData();
    for (const plik of this.plikiLocalData) {
      // console.log('PLIK', plik);
      // console.log('PLIKNAME', plik.name);
      plik.newNazwa = plik.name;
      // const newPlikName = Date.now() + plik.name.toLowerCase().split(' ').join('_');

      plikiData.append('pliki', plik);
      // plikiData.append('nazwy', newPlikName);
      plikiData.append('katalog', 'contractors');
    }
    this.plikiService.wysylaniePlikowKontakty(plikiData).subscribe(
      (res: { status: string, plikiZapisane: any }) => {
        if (res.status === 'ok') {
          // console.log('Pliki przesłane poprawnie');
          // console.log(res.plikiZapisane);
          res.plikiZapisane.forEach(plik => {
            // console.log(plik);
            // console.log(plik.originalname);
            // console.log(plik.filename);
            // console.log(plik.path);
            // console.log(this.aktualnyTypPliku);
            this.plikiLocal.push({
              name: plik.originalname,
              fileName: plik.filename,
              size: plik.size,
              type: plik.mimetype,
              rodzaj: this.aktualnyTypPliku,
              url: plik.path,
              zatwierdzony: false,
              katalog: 'kontakty'
            });
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
        }
      },
      (err) => console.log(err)
    );
  }

  ustawAktualnyTypPliku(typPliku: string) {
    // console.log('USTAWIAM TYP', typPliku);
    this.aktualnyTypPliku = typPliku;
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }
}
