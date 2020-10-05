import { Component, OnInit, NgModule, OnDestroy } from '@angular/core';
import { Warehouse } from '../../models/magazyn.model';
import { Warehouseform } from '../../models/formatki/warehouseform.model';
import { Form, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { WarehouseService } from '../../services/magazyn.service';
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
import { Contractor } from '../../models/kontrahent.model';
import { Plik } from '../../models/plik.model';
import { Assortment } from '../../models/assortment.model';
import { ContractorsService } from 'src/app/services/kontrahenci.service';
import { AssortmentService } from 'src/app/services/assortment.service';

@Component({
  selector: 'app-magazyn-create',
  templateUrl: './magazyn-create.component.html',
  styleUrls: ['./magazyn-create.component.scss']
})
export class MagazynCreateComponent implements OnInit {
  // domyślny typ magazynu
  private mode = 'create';
  private warehouseId: string;
  private nowy: string;
  warehouse: Warehouse = {
    fullName: null,
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

  assortment: Assortment;

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
  assortmentId: string;
  katalogPlikow = 'magazyn';

  // I declare displayed fields
  dispFields: Warehouseform = {
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
    warehouseFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  // plikAdres: string;
  pliki = [{}];

  // lista kontrahentów
  contractors: Contractor[] = [];
  term: string;
  p = 1;

  // nazwa istniejącego już towaru
  // w celu wybrania plików już zapisanych w bazie
  towary: Warehouse[] = [];
  nazwaIstTowaru: string;
  q = 1;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public warehouseService: WarehouseService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private plikiService: PlikiService,
    private contractorsService: ContractorsService,
    private assortmentService: AssortmentService
  ) { }

  ngOnInit() {
    const valStart = { values: [''] };
    this.dictionaries[10] = valStart;
    this.dictionaries[9] = valStart;
    this.dictionaries[8] = valStart;
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
    this.getDictionary('magazynJednostki', 5);
    this.getDictionary('magazynLokalizacje', 6);
    this.getDictionary('magazynPliki', 7);
    this.getDictionary('gatunek', 8);
    this.getDictionary('atest', 9);
    this.getDictionary('odbior', 10);


    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null)
    });

    this.form = new FormGroup({
      kodIndeks: new FormControl(null),
      nazwaPelna: new FormControl(null, { validators: [Validators.required] }),
      towarOpis: new FormControl(null),
      dzialSlownik: new FormControl(null),
      vat: new FormControl(null),
      jednostka: new FormControl(null),
      wysokosc: new FormControl(null),
      dlugosc: new FormControl(null),
      szerokosc: new FormControl(null),
      liczba: new FormControl(null),
      cenaZakupuNetto: new FormControl(null),
      cenaHurtowaSprzedazyNetto: new FormControl(null),
      cenaDetalicznaBrutto: new FormControl(null),
      cenaDetalicznaWaluta: new FormControl(null),
      cenaExportEuro: new FormControl(null),
      dostawcaKod: new FormControl(null),
      comments: new FormControl(null),
      warehouseLocation: new FormControl(null),
      gatunek: new FormControl(null),
      atest: new FormControl(null),
      odbior: new FormControl(null),
      regal: new FormControl(null),
      polka: new FormControl(null),
      karton: new FormControl(null),
      barcode: new FormControl(null),
      widocznyWSklepie: new FormControl(null),
      firma: new FormControl(null),
      projekt: new FormControl(null),
      cenaZakupuBrutto: new FormControl(null),
      cenaHurtowaSprzedazyBrutto: new FormControl(null),
      cenaDetalicznaNetto: new FormControl(null),
      kodIndeksDostawcy: new FormControl(null)
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
          if (this.loggedInUser.warehouseFields) {
            this.dispFields = this.loggedInUser.warehouseFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('warehouseId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.warehouseId = paramMap.get('warehouseId');
        // I'm getting data about warehouse
        this.warehouseService
          .getWarehouse(this.warehouseId)
          .subscribe((warehouseData: { warehouse: Warehouse }) => {
            this.warehouse = warehouseData.warehouse;
            delete this.warehouse._id;
            this.warehouse.id = warehouseData.warehouse._id;
            this.plikiDataSource = new MatTableDataSource(
              warehouseData.warehouse.pliki
            );
            // pliki
            if (typeof warehouseData.warehouse.pliki !== 'undefined') {
              for (const plik of warehouseData.warehouse.pliki) {
                this.plikiLocal.push(plik);
              }
            }
            // firmy
            if (typeof warehouseData.warehouse.firms !== 'undefined') {
              for (const firma of warehouseData.warehouse.firms) {
                if (typeof this.wybraneFirmy === 'undefined') {
                  this.wybraneFirmy = [{ name: firma }];
                } else if (this.warehouse.firms.length <= 0) {
                  this.wybraneFirmy.push({ name: firma });
                }
              }
              this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            }
            // projekty
            if (typeof warehouseData.warehouse.projects !== 'undefined') {
              for (const projekt of warehouseData.warehouse.projects) {
                if (typeof this.wybraneProjekty === 'undefined') {
                  this.wybraneProjekty = [{ name: projekt }];
                } else if (this.warehouse.projects.length <= 0) {
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
              kodIndeks: this.warehouse.itemNumber,
              nazwaPelna: this.warehouse.fullName,
              towarOpis: this.warehouse.towarOpis,
              dzialSlownik: this.warehouse.rodzajTowaru,
              vat: this.warehouse.vat,
              jednostka: this.warehouse.jednostka,
              wysokosc: this.warehouse.wysokosc,
              dlugosc: this.warehouse.dlugosc,
              szerokosc: this.warehouse.szerokosc,
              liczba: this.warehouse.liczba,
              cenaZakupuNetto: this.warehouse.cenaZakupuNetto,
              cenaHurtowaSprzedazyNetto: this.warehouse.cenaHurtowaSprzedazyNetto,
              cenaDetalicznaBrutto: this.warehouse.cenaDetalicznaBrutto,
              cenaDetalicznaWaluta: this.warehouse.cenaDetalicznaWaluta,
              cenaExportEuro: this.warehouse.cenaExportEuro,
              dostawcaKod: this.warehouse.supplier,
              comments: this.warehouse.comments,
              warehouseLocation: this.warehouse.warehouseLocation,
              gatunek: this.warehouse.gatunek,
              atest: this.warehouse.atest,
              odbior: this.warehouse.odbior,
              regal: this.warehouse.regal,
              polka: this.warehouse.polka,
              karton: this.warehouse.karton,
              barcode: this.warehouse.barcode,
              widocznyWSklepie: this.warehouse.widocznyWSklepie,
              cenaZakupuBrutto: this.warehouse.cenaZakupuBrutto,
              cenaHurtowaSprzedazyBrutto: this.warehouse.cenaHurtowaSprzedazyBrutto,
              cenaDetalicznaNetto: this.warehouse.cenaDetalicznaNetto,
              kodIndeksDostawcy: this.warehouse.kodIndexDostawcy
            });
          });
        if (paramMap.has('nowy')) {
          this.mode = 'create';
        }
      } else if (paramMap.has('assortmentId')) {
        // dodaję towar z asortymentu
        this.mode = 'create';
        this.assortmentId = paramMap.get('assortmentId');
        this.assortmentService.getAssortment(this.assortmentId)
          .subscribe(assortmentLocal => {
            this.form.patchValue({
              nazwaPelna: assortmentLocal.assortment.fullName,
              towarOpis: assortmentLocal.assortment.towarOpis,
              dzialSlownik: assortmentLocal.assortment.rodzajTowaru,
              gatunek: assortmentLocal.assortment.gatunek,
              atest: assortmentLocal.assortment.atest,
              odbior: assortmentLocal.assortment.odbior,
              comments: assortmentLocal.assortment.comments
            });
            this.warehouse.firms = assortmentLocal.assortment.firms;
            this.warehouse.projects = assortmentLocal.assortment.projects;
            // this.plikiLocal = assortmentLocal.assortment.pliki;
            assortmentLocal.assortment.pliki.forEach(plikObj => {
              plikObj.zInnego = true;
              this.plikiLocal.push(plikObj);
            });
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
      } else {
        this.mode = 'create';
        this.warehouseId = null;
      }
    });

    this.firmyKolumny = ['name', 'action'];

    this.projektyKolumny = ['name', 'action'];

    this.plikiKolumny = ['name', 'rodzaj', 'action'];

    // pobieram kontrahentów
    this.contractorsService.getContactorsSimple()
      .subscribe((contractorsData) => {
        this.contractors = contractorsData.contractors;
      });

  }

  onSaveWarehouse() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
      if (!plik.katalog) {
        plik.katalog = 'magazyn';
      }
    });

    const warehouse: Warehouse = {
      fullName: this.form.value.nazwaPelna,
      towarOpis: this.form.value.towarOpis,
      comments: this.form.value.comments,
      rodzajTowaru: this.form.value.dzialSlownik,
      vat: this.form.value.vat,
      jednostka: this.form.value.jednostka,
      dlugosc: this.form.value.dlugosc,
      wysokosc: this.form.value.wysokosc,
      szerokosc: this.form.value.szerokosc,
      liczba: this.form.value.liczba,
      cenaZakupuNetto: this.form.value.cenaZakupuNetto,
      cenaHurtowaSprzedazyNetto: this.form.value.cenaHurtowaSprzedazyNetto,
      itemNumber: this.form.value.kodIndeks,
      cenaDetalicznaBrutto: this.form.value.cenaDetalicznaBrutto,
      cenaDetalicznaWaluta: this.form.value.cenaDetalicznaWaluta,
      cenaExportEuro: this.form.value.cenaExportEuro,
      supplier: this.form.value.dostawcaKod,
      warehouseLocation: this.form.value.warehouseLocation,
      gatunek: this.form.value.gatunek,
      atest: this.form.value.atest,
      odbior: this.form.value.odbior,
      regal: this.form.value.regal,
      polka: this.form.value.polka,
      karton: this.form.value.karton,
      barcode: this.form.value.barcode,
      widocznyWSklepie: this.form.value.widocznyWSklepie,
      status: this.form.value.status,
      firms: this.warehouse.firms,
      projects: this.warehouse.projects,
      pliki: this.plikiLocal,
      cenaZakupuBrutto: this.form.value.cenaZakupuBrutto,
      cenaHurtowaSprzedazyBrutto: this.form.value.cenaHurtowaSprzedazyBrutto,
      cenaDetalicznaNetto: this.form.value.cenaDetalicznaNetto,
      kodIndexDostawcy: this.form.value.kodIndeksDostawcy
    };

    if (this.mode === 'create') {
      this.warehouseService.addWarehouse(warehouse);
    } else {
      this.warehouseService.updateWarehouse(this.warehouseId, warehouse);
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
      this.router.navigate(['/warehouselist']);
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
      this.router.navigate(['/warehouselist']);
    }

    // console.log(dlTab);
    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach(plik => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          // console.log(plik.fileName);
          this.plikiService
            .kasujPlikMagazyn(plik.fileName, plik.katalog)
            .subscribe((res: { usuniety: string }) => {
              // console.log(res);
              dlTab--;
              liczbaNiezatwierdzonych--;
              if (res.usuniety === 'ok' && liczbaNiezatwierdzonych <= 0) {
                // console.log('wszystkie usuniete');
                // window.history.go(-1);
                this.router.navigate(['/warehouselist']);
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
          //   if (typeof this.warehouse.firms === 'undefined') {
          //     this.warehouse.firms = [this.dictionaries[2].values[0]];
          //     this.wybraneFirmy = [{ name: this.dictionaries[2].values[0] }];
          //     this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
          //   } else if (this.warehouse.firms.length <= 0) {
          //     this.warehouse.firms = [this.dictionaries[2].values[0]];
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
          //   if (typeof this.warehouse.projects === 'undefined') {
          //     this.warehouse.projects = [this.dictionaries[3].values[0]];
          //     this.wybraneProjekty = [{ name: this.dictionaries[3].values[0] }];
          //     this.projektyDataSource = new MatTableDataSource(
          //       this.wybraneProjekty
          //     );
          //   } else if (this.warehouse.projects.length <= 0) {
          //     this.warehouse.projects = [this.dictionaries[3].values[0]];
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
        alert('Pamiętaj aby zapisać magazyn!');
      }

      // jeżeli plik jest dodawany z systemu plików
      if (!element.zInnego) {
        this.plikiService
          .kasujPlikMagazyn(element.fileName, element.katalog)
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
      } else {
        // jeżeli plik jest dodawany z innego już istniejącego pliku
        // w bazie to nie kasuję pliku w sytemie plików
        this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
        this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
      }





    }
  }

  wyborFirmy(firma: string) {
    if (
      typeof this.warehouse.firms === 'undefined' ||
      this.warehouse.firms.length <= 0
    ) {
      this.warehouse.firms = [firma];
      this.wybraneFirmy = [{ name: firma }];
    } else {
      if (!this.warehouse.firms.includes(firma)) {
        this.warehouse.firms.push(firma);
        this.wybraneFirmy.push({ name: firma });
      }
    }
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborPliku(plik: string) {
    // console.log(plik);
  }

  deleteFirma(element) {
    this.warehouse.firms.splice(
      this.warehouse.firms.indexOf(element.name),
      1
    );
    this.wybraneFirmy.splice(this.wybraneFirmy.indexOf(element), 1);
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborProjektu(projekt: string) {
    if (
      typeof this.warehouse.projects === 'undefined' ||
      this.warehouse.projects.length <= 0
    ) {
      this.warehouse.projects = [projekt];
      this.wybraneProjekty = [{ name: projekt }];
    } else {
      if (!this.warehouse.projects.includes(projekt)) {
        this.warehouse.projects.push(projekt);
        this.wybraneProjekty.push({ name: projekt });
      }
    }
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  deleteProjekt(element) {
    this.warehouse.projects.splice(
      this.warehouse.projects.indexOf(element.name),
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
      plik.katalog = 'magazyn';
      plikiData.append('pliki', plik);
      plikiData.append('katalog', 'magazyn');
    }
    this.plikiService.wysylaniePlikowMagazyn(plikiData).subscribe(
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
              katalog: 'magazyn'
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

  wybierzKontrahenta(contractor: Contractor) {
    this.form.patchValue({
      dostawcaKod: contractor.shortName
    });
  }

  wybierzTowar(towar: Warehouse) {
    towar.pliki.forEach((plik: Plik) => {
      // informacja o tym że plik został dodany z już
      // innego istniejącego pliku w bazie
      plik.zInnego = true;
      this.plikiLocal.push(plik);
      this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
    });
  }

  // ngOnDestroy(): void {
  //   this.zalogowanyUser.unsubscribe();
  // }

  wyliczBruttoDetal(event: any) {
    if (!this.form.controls.vat.value) {
      alert('Wpisz stawkę VAT');
    } else {
      const brutto = ((event.target.value * (100 + this.form.controls.vat.value)) / 100).toFixed(2);
      this.form.patchValue({
        cenaDetalicznaBrutto: brutto
      });
    }
  }

  wyliczNettoDetal(event: any) {
    if (!this.form.controls.vat.value) {
      alert('Wpisz stawkę VAT');
    } else {
      const netto = ((event.target.value * 100) / (100 + this.form.controls.vat.value)).toFixed(2);
      this.form.patchValue({
        cenaDetalicznaNetto: netto
      });
    }
  }

  wyliczBruttoHurt(event: any) {
    if (!this.form.controls.vat.value) {
      alert('Wpisz stawkę VAT');
    } else {
      const brutto = ((event.target.value * (100 + this.form.controls.vat.value)) / 100).toFixed(2);
      this.form.patchValue({
        cenaHurtowaSprzedazyBrutto: brutto
      });
    }
  }

  wyliczNettoHurt(event: any) {
    if (!this.form.controls.vat.value) {
      alert('Wpisz stawkę VAT');
    } else {
      const netto = ((event.target.value * 100) / (100 + this.form.controls.vat.value)).toFixed(2);
      this.form.patchValue({
        cenaHurtowaSprzedazyNetto: netto
      });
    }
  }

  zerujP() {
    this.p = 1;
  }

  zerujQ() {
    this.q = 1;
    // console.log('nazIstTow:', this.nazwaIstTowaru);
    this.warehouseService.getWarehouseByName(this.nazwaIstTowaru)
      .subscribe((towary: any) => {
        // console.log(towary);
        this.towary = towary.warehouses;
      });
  }

  onSearchIstFiles(form1: NgForm) {
    console.log(form1.value.nazwaIstTowaru);
    this.warehouseService.getWarehouseByName(form1.value.nazwaIstTowaru)
      .subscribe(towary => {
        console.log('tow', towary);
      });
  }

}
