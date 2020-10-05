import { Component, OnInit, OnDestroy } from '@angular/core';
import { Assortment } from '../../models/assortment.model';
import { Assortmentform } from '../../models/formatki/assortmentform.model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { AssortmentService } from '../../services/assortment.service';
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
  selector: 'app-assortment-add',
  templateUrl: './assortment-add.component.html',
  styleUrls: ['./assortment-add.component.scss']
})
export class AssortmentAddComponent implements OnInit, OnDestroy {
  // domyślny typ asortymentu
  private mode = 'create';
  private assortmentId: string;
  private nowy: string;
  assortment: Assortment = {
    fullName: null,
    towarOpis: null,
    comments: null,
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
    status: null,
    // firms: [],
    // projects: [],
    rodzajTowaru: null
  };

  wybraneFirmy: [{}];
  projektyKolumny: string[];
  firmyKolumny: string[];
  plikiKolumny: string[];
  wybraneProjekty: [{}];
  liczbaFirm: number;
  liczbaProjektow: number;
  rodzajPliku: string;
  // reactive forms
  form: FormGroup;
  formPliki: FormGroup;
  plikiLocal = [];
  plikiLocalData = [];
  aktualnyTypPliku: string;
  backendUrl = environment.backendUrl;
  public firmyDataSource: any;
  public projektyDataSource: any;
  public plikiDataSource: any;
  mozliwoscAnulowania = true;

  // I declare displayed fields
  dispFields: Assortmentform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
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

  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    assortmentFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  // plikAdres: string;
  pliki = [{}];

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public assortmentService: AssortmentService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private plikiService: PlikiService
  ) { }

  ngOnInit() {
    const valStart = { values: [''] };
    this.dictionaries[7] = valStart;
    this.dictionaries[6] = valStart;
    this.dictionaries[5] = valStart;
    this.dictionaries[4] = valStart;
    this.dictionaries[3] = valStart;
    this.dictionaries[2] = valStart;
    this.dictionaries[1] = valStart;

    this.getDictionary('kontrahentWaluty', 1);
    this.getDictionary('firmy', 2);
    this.getDictionary('projekty', 3);
    this.getDictionary('asortymentRodzaje', 4);
    this.getDictionary('gatunek', 5);
    this.getDictionary('atest', 6);
    this.getDictionary('odbior', 7);

    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null)
    });

    this.form = new FormGroup({
      nazwaPelna: new FormControl(null, { validators: [Validators.required] }),
      towarOpis: new FormControl(null),
      comments: new FormControl(null),
      rodzajTowaru: new FormControl(null),
      firma: new FormControl(null),
      projekt: new FormControl(null),
      gatunek: new FormControl(null),
      atest: new FormControl(null),
      odbior: new FormControl(null)
    });

    // sprawdzam usera
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (
          typeof this.loggedInUser !== 'undefined' &&
          this.loggedInUser.moduly !== null &&
          typeof this.loggedInUser.moduly !== 'undefined'
        ) {
          this.userIsAuthenticated = true;
          if (this.loggedInUser.assortmentFields) {
            this.dispFields = this.loggedInUser.assortmentFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('assortmentId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.assortmentId = paramMap.get('assortmentId');
        // I'm getting data about assortment
        this.assortmentService
          .getAssortment(this.assortmentId)
          .subscribe((assortmentData: { assortment: Assortment }) => {
            this.assortment = assortmentData.assortment;
            delete this.assortment._id;
            this.assortment.id = assortmentData.assortment._id;
            this.plikiDataSource = new MatTableDataSource(
              assortmentData.assortment.pliki
            );
            // pliki
            if (typeof assortmentData.assortment.pliki !== 'undefined') {
              for (const plik of assortmentData.assortment.pliki) {
                this.plikiLocal.push(plik);
              }
            }
            // firmy
            if (typeof assortmentData.assortment.firms !== 'undefined') {
              for (const firma of assortmentData.assortment.firms) {
                if (typeof this.wybraneFirmy === 'undefined') {
                  this.wybraneFirmy = [{ name: firma }];
                } else if (this.assortment.firms.length <= 0) {
                  this.wybraneFirmy.push({ name: firma });
                }
              }
              this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            }
            // projekty
            if (typeof assortmentData.assortment.projects !== 'undefined') {
              for (const projekt of assortmentData.assortment.projects) {
                if (typeof this.wybraneProjekty === 'undefined') {
                  this.wybraneProjekty = [{ name: projekt }];
                } else if (this.assortment.projects.length <= 0) {
                  this.wybraneProjekty.push({ name: projekt });
                }
              }
              this.projektyDataSource = new MatTableDataSource(
                this.wybraneProjekty
              );
            }
            // ustawiam wartości formatki
            // this.form.setValue({
            this.form.patchValue({
              nazwaPelna: this.assortment.fullName,
              firma: null,
              projekt: null,
              comments: this.assortment.comments,
              towarOpis: this.assortment.towarOpis,
              rodzajTowaru: this.assortment.rodzajTowaru,
              gatunek: this.assortment.gatunek,
              atest: this.assortment.atest,
              odbior: this.assortment.odbior
            });
          });
        if (paramMap.has('nowy')) {
          this.mode = 'create';
        }
      } else {
        this.mode = 'create';
        this.assortmentId = null;
      }
    });

    this.firmyKolumny = ['name', 'action'];

    this.projektyKolumny = ['name', 'action'];

    this.plikiKolumny = ['name', 'rodzaj', 'action'];
  }

  onSaveAssortment() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
      plik.katalog = 'asortyment';
    });

    const assortment: Assortment = {
      fullName: this.form.value.nazwaPelna,
      comments: this.form.value.comments,
      status: this.form.value.status,
      firms: this.assortment.firms,
      projects: this.assortment.projects,
      towarOpis: this.form.value.towarOpis,
      rodzajTowaru: this.form.value.rodzajTowaru,
      pliki: this.plikiLocal,
      gatunek: this.form.value.gatunek,
      atest: this.form.value.atest,
      odbior: this.form.value.odbior
    };

    if (this.mode === 'create') {
      this.assortmentService.addAssortment(assortment);
    } else {
      this.assortmentService.updateAssortment(this.assortmentId, assortment);
    }
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => console.error(error)
      );
    }
  }

  powrot() {
    // console.log(this.plikiLocal);
    let dlTab = this.plikiLocal.length;
    if (dlTab <= 0) {
      // window.history.go(-1);
      this.router.navigate(['/assortmentslist']);
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
      this.router.navigate(['/assortmentslist']);
    }

    // console.log(dlTab);
    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach(plik => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          // console.log(plik.fileName);
          this.plikiService
            .kasujPlikAsortyment(plik.fileName)
            .subscribe((res: { usuniety: string }) => {
              // console.log(res);
              dlTab--;
              liczbaNiezatwierdzonych--;
              if (res.usuniety === 'ok' && liczbaNiezatwierdzonych <= 0) {
                // console.log('wszystkie usuniete');
                // window.history.go(-1);
                this.router.navigate(['/assortmentslist']);
              }
            });
        }
      });
    }
  }

  getDictionary(name: string, index: number) {
    return this.dictionaryService
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
          //   if (typeof this.assortment.firms === 'undefined') {
          //     this.assortment.firms = [this.dictionaries[2].values[0]];
          //     this.wybraneFirmy = [{ name: this.dictionaries[2].values[0] }];
          //     this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
          //   } else if (this.assortment.firms.length <= 0) {
          //     this.assortment.firms = [this.dictionaries[2].values[0]];
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
          //   if (typeof this.assortment.projects === 'undefined') {
          //     this.assortment.projects = [this.dictionaries[3].values[0]];
          //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
          //     this.projektyDataSource = new MatTableDataSource(
          //       this.wybraneProjekty
          //     );
          //   } else if (this.assortment.projects.length <= 0) {
          //     this.assortment.projects = [this.dictionaries[3].values[0]];
          //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
          //     this.projektyDataSource = new MatTableDataSource(
          //       this.wybraneProjekty
          //     );
          //   }
          // }
        }
      });
  }

  deletePlik(element) {
    if (confirm('Czy na pewno usunąć plik?')) {
      if (element.zatwierdzony) {
        this.mozliwoscAnulowania = false;
        alert('Pamiętaj aby zapisać asortyment!');
      }
      this.plikiService
        .kasujPlikAsortyment(element.fileName)
        .subscribe((res: { usuniety: string }) => {
          // console.log(res);
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

  wyborFirmy(firma: string) {
    if (
      typeof this.assortment.firms === 'undefined' ||
      this.assortment.firms.length <= 0
    ) {
      this.assortment.firms = [firma];
      this.wybraneFirmy = [{ name: firma }];
    } else {
      if (!this.assortment.firms.includes(firma)) {
        this.assortment.firms.push(firma);
        this.wybraneFirmy.push({ name: firma });
      }
    }
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborPliku(plik: string) {
    // console.log(plik);
  }

  deleteFirma(element) {
    this.assortment.firms.splice(
      this.assortment.firms.indexOf(element.name),
      1
    );
    this.wybraneFirmy.splice(this.wybraneFirmy.indexOf(element), 1);
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborProjektu(projekt: string) {
    if (
      typeof this.assortment.projects === 'undefined' ||
      this.assortment.projects.length <= 0
    ) {
      this.assortment.projects = [projekt];
      this.wybraneProjekty = [{ name: projekt }];
    } else {
      if (!this.assortment.projects.includes(projekt)) {
        this.assortment.projects.push(projekt);
        this.wybraneProjekty.push({ name: projekt });
      }
    }
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  deleteProjekt(element) {
    this.assortment.projects.splice(
      this.assortment.projects.indexOf(element.name),
      1
    );
    this.wybraneProjekty.splice(this.wybraneProjekty.indexOf(element), 1);
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
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
      plik.katalog = 'asortyment';
      plikiData.append('pliki', plik);
      plikiData.append('katalog', 'asortyment');
    }
    this.plikiService.wysylaniePlikowAsortyment(plikiData).subscribe(
      (res: { status: string; plikiZapisane: any }) => {
        if (res.status === 'ok') {
          res.plikiZapisane.forEach(plik => {
            this.plikiLocal.push({
              name: plik.originalname,
              fileName: plik.filename,
              size: plik.size,
              type: plik.mimetype,
              rodzaj: this.aktualnyTypPliku,
              url: plik.path,
              zatwierdzony: false,
              katalog: 'asortyment'
            });
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
        }
      },
      err => console.log(err)
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
