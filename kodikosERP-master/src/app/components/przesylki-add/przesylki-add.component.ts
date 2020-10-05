import { Component, OnInit, OnDestroy } from '@angular/core';
import { Przesylki } from '../../models/przesylki.model';
import { Przesylkiform } from '../../models/formatki/przesylkiform.model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { PrzesylkiService } from '../../services/przesylki.service';
import { PracownicyService } from '../../services/pracownicy.service';
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
import { Pracownicy } from 'src/app/models/pracownicy.model';

@Component({
  selector: 'app-przesylki-add',
  templateUrl: './przesylki-add.component.html',
  styleUrls: ['./przesylki-add.component.scss']
})
export class PrzesylkiAddComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private przesylkaId: string;
  private nowy: string;

  przesylka: Przesylki = {
    fullName: null,
    comments: null,
    nrZapotrzebowania: null,
    doKogo: null,
    doKogoEmails: null,
    rodzajPlatnosci: null,
    kwota: null,
    status: null,
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
  };
  wybraneFirmy: [{}];
  projektyKolumny: string[];
  firmyKolumny: string[];
  plikiKolumny: string[];
  wybraneProjekty: [{}];
  liczbaFirm: number;
  liczbaProjektow: number;
  liczbaTypowPlatnosci: number;
  liczbaStatusowPrzesylek: number;
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

  dispFields: Przesylkiform = {
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

  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    przesylkiFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;
  // plikAdres: string;
  pliki = [{}];
  nazwiskoTerm: string;

  pracownicys: Pracownicy[] = [];
  private pracownicySub: Subscription;
  private totalPracownicys;
  p = 1;
  odbiorcyPrzesylki: [string] = null;
  odbiorcyPrzesylkiEmails: [string] = null;
  // public odbiorcyDataSource: any;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public przesylkiService: PrzesylkiService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private plikiService: PlikiService,
    private pracownicyService: PracownicyService
  ) { }

  ngOnInit(): void {

    const valStart = { values: [''] };
    this.dictionaries[4] = valStart;
    this.dictionaries[3] = valStart;
    this.dictionaries[2] = valStart;
    this.dictionaries[1] = valStart;
    this.getDictionary('statusyPrzesylek', 4);
    this.getDictionary('typyPlatnosci', 3);
    this.getDictionary('firmy', 2);
    this.getDictionary('projekty', 1);

    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null)
    });

    this.form = new FormGroup({
      status: new FormControl('oczekuje na doręczenie'),
      comments: new FormControl(null),
      firma: new FormControl(null),
      projekt: new FormControl(null),
      nrZapotrzebowania: new FormControl(null),
      // doKogo: new FormControl(null),
      // nazwa firmy do której skierowana jest przesyłka
      nazwaPelna: new FormControl(null),
      terminDostawy: new FormControl(null),
      rodzajPlatnosci: new FormControl(null),
      kwota: new FormControl(null)
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
          if (this.loggedInUser.przesylkiFields) {
            this.dispFields = this.loggedInUser.przesylkiFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('przesylkaId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.przesylkaId = paramMap.get('przesylkaId');
        // I'm getting data about przesylka
        this.przesylkiService
          .getPrzesylka(this.przesylkaId)
          .subscribe((przesylkaData: { przesylki: Przesylki }) => {
            this.przesylka = przesylkaData.przesylki;
            delete this.przesylka._id;
            this.przesylka.id = przesylkaData.przesylki._id;
            this.plikiDataSource = new MatTableDataSource(
              przesylkaData.przesylki.pliki
            );
            this.odbiorcyPrzesylki = przesylkaData.przesylki.doKogo;
            this.odbiorcyPrzesylkiEmails = przesylkaData.przesylki.doKogoEmails;
            // this.odbiorcyDataSource = new MatTableDataSource(przesylkaData.przesylki.doKogo);
            // pliki
            if (typeof przesylkaData.przesylki.pliki !== 'undefined') {
              for (const plik of przesylkaData.przesylki.pliki) {
                this.plikiLocal.push(plik);
              }
            }
            // firmy
            if (typeof przesylkaData.przesylki.firms !== 'undefined') {
              for (const firma of przesylkaData.przesylki.firms) {
                if (typeof this.wybraneFirmy === 'undefined') {
                  this.wybraneFirmy = [{ name: firma }];
                } else if (this.przesylka.firms.length <= 0) {
                  this.wybraneFirmy.push({ name: firma });
                }
              }
              this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
            }
            // projekty
            if (typeof przesylkaData.przesylki.projects !== 'undefined') {
              for (const projekt of przesylkaData.przesylki.projects) {
                if (typeof this.wybraneProjekty === 'undefined') {
                  this.wybraneProjekty = [{ name: projekt }];
                } else if (this.przesylka.projects.length <= 0) {
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
              comments: this.przesylka.comments,
              firma: null,
              projekt: null,
              nrZapotrzebowania: this.przesylka.nrZapotrzebowania,
              // doKogo: this.przesylka.doKogo,
              // nazwa firmy do której skierowana jest przesyłka
              nazwaPelna: this.przesylka.fullName,
              terminDostawy: this.przesylka.terminDostawy,
              rodzajPlatnosci: this.przesylka.rodzajPlatnosci,
              kwota: this.przesylka.kwota,
              status: this.przesylka.status
            });
          });
        if (paramMap.has('nowy')) {
          this.mode = 'create';
        }
      } else {
        this.mode = 'create';
        this.przesylkaId = null;
      }
    });

    this.firmyKolumny = ['name', 'action'];

    this.projektyKolumny = ['name', 'action'];

    this.plikiKolumny = ['name', 'rodzaj', 'action'];

    this.pracownicyService.getPracownicysAllObs();

    this.pracownicySub = this.pracownicyService
      .getPracownicysUpdatedListener()
      .subscribe(
        (pracownicyData: {
          pracownicys: Pracownicy[];
          pracownicysCount: number;
        }) => {
          this.totalPracownicys = pracownicyData.pracownicysCount;
          this.pracownicys = pracownicyData.pracownicys;
          // console.log(this.pracownicys);
        }
      );

  }

  getDictionary(name: string, index: number) {
    return this.dictionaryService
      .getDictionaryName(name)
      .subscribe(dictionaryData => {
        this.dictionaries[index] = dictionaryData;
        this.dictionaries[index].liczba = dictionaryData.values.length;
        delete this.dictionaries[index]._id;
        this.dictionaries[index].id = dictionaryData._id;
        if (name === 'firmy') {
          this.liczbaFirm = this.dictionaries[2].liczba;
        }
        if (name === 'projekty') {
          this.liczbaProjektow = this.dictionaries[1].liczba;
        }
        if (name === 'typyPlatnosci') {
          this.liczbaTypowPlatnosci = this.dictionaries[3].liczba;
        }
        if (name === 'statusyPrzesylek') {
          this.liczbaStatusowPrzesylek = this.dictionaries[4].liczba;
        }
      });
  }

  onSavePrzesylka() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
      plik.katalog = 'przesylki';
    });

    const przesylka: Przesylki = {
      fullName: this.form.value.nazwaPelna,
      comments: this.form.value.comments,
      status: this.form.value.status,
      firms: this.przesylka.firms,
      projects: this.przesylka.projects,
      pliki: this.plikiLocal,
      nrZapotrzebowania: this.form.value.nrZapotrzebowania,
      doKogo: this.odbiorcyPrzesylki,
      doKogoEmails: this.odbiorcyPrzesylkiEmails,
      terminDostawy: this.form.value.terminDostawy,
      rodzajPlatnosci: this.form.value.rodzajPlatnosci,
      kwota: this.form.value.kwota
    };

    if (this.mode === 'create') {
      this.przesylkiService.addPrzesylka(przesylka);
    } else {
      // jeżeli zmienił się status to wyślij też maila
      if (this.przesylka.status !== przesylka.status) {
        this.przesylkiService.updatePrzesylki(this.przesylkaId, przesylka, true);
      } else {
        this.przesylkiService.updatePrzesylki(this.przesylkaId, przesylka, false);
      }
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
      this.router.navigate(['/rrwmodule/przesylki']);
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
      this.router.navigate(['/rrwmodule/przesylki']);
    }

    // console.log(dlTab);
    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach(plik => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          // console.log(plik.fileName);
          this.plikiService
            .kasujPlikPrzesylki(plik.fileName)
            .subscribe((res: { usuniety: string }) => {
              // console.log(res);
              dlTab--;
              liczbaNiezatwierdzonych--;
              if (res.usuniety === 'ok' && liczbaNiezatwierdzonych <= 0) {
                // console.log('wszystkie usuniete');
                // window.history.go(-1);
                this.router.navigate(['/rrwmodule/przesylki']);
              }
            });
        }
      });
    }
  }

  deletePlik(element) {
    if (confirm('Czy na pewno usunąć plik?')) {
      if (element.zatwierdzony) {
        this.mozliwoscAnulowania = false;
        alert('Pamiętaj aby zapisać informację o przesyłce!');
      }
      this.plikiService
        .kasujPlikPrzesylki(element.fileName)
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
      typeof this.przesylka.firms === 'undefined' ||
      this.przesylka.firms.length <= 0
    ) {
      this.przesylka.firms = [firma];
      this.wybraneFirmy = [{ name: firma }];
    } else {
      if (!this.przesylka.firms.includes(firma)) {
        this.przesylka.firms.push(firma);
        this.wybraneFirmy.push({ name: firma });
      }
    }
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  deleteFirma(element) {
    this.przesylka.firms.splice(
      this.przesylka.firms.indexOf(element.name),
      1
    );
    this.wybraneFirmy.splice(this.wybraneFirmy.indexOf(element), 1);
    this.firmyDataSource = new MatTableDataSource(this.wybraneFirmy);
  }

  wyborProjektu(projekt: string) {
    if (
      typeof this.przesylka.projects === 'undefined' ||
      this.przesylka.projects.length <= 0
    ) {
      this.przesylka.projects = [projekt];
      this.wybraneProjekty = [{ name: projekt }];
    } else {
      if (!this.przesylka.projects.includes(projekt)) {
        this.przesylka.projects.push(projekt);
        this.wybraneProjekty.push({ name: projekt });
      }
    }
    this.projektyDataSource = new MatTableDataSource(this.wybraneProjekty);
  }

  deleteProjekt(element) {
    this.przesylka.projects.splice(
      this.przesylka.projects.indexOf(element.name),
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
      plik.katalog = 'przesylki';
      plikiData.append('pliki', plik);
      plikiData.append('katalog', 'przesylki');
    }
    this.plikiService.wysylaniePlikowPrzesylki(plikiData).subscribe(
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
              katalog: 'przesylki'
            });
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
        }
      },
      err => console.log(err)
    );
  }

  ustawAktualnyTypPliku(typPliku: string) {
    this.aktualnyTypPliku = typPliku;
  }

  zerujP() {
    this.p = 1;
  }

  wybierzPracownika(pracownik: Pracownicy) {
    if (this.odbiorcyPrzesylki === null) {
      this.odbiorcyPrzesylki = [pracownik.displayName];
      this.odbiorcyPrzesylkiEmails = [pracownik.email];
    } else {
      if (this.odbiorcyPrzesylki.map(x => x).indexOf(pracownik.displayName) < 0) {
        this.odbiorcyPrzesylki.push(pracownik.displayName);
        this.odbiorcyPrzesylkiEmails.push(pracownik.email);
      } else {
        alert(`${pracownik.displayName} jest już na liście odbiorców.`);
        // this.odbiorcyPrzesylki.splice(this.odbiorcyPrzesylki.indexOf(pracownik.displayName), 1);
      }
    }
    // this.odbiorcyDataSource = new MatTableDataSource(this.odbiorcyPrzesylki);
  }

  usunOdbiorce(odbiorca: string) {
    this.odbiorcyPrzesylki.splice(this.odbiorcyPrzesylki.indexOf(odbiorca), 1);
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }

}

