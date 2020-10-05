import { Component, OnInit, OnDestroy } from '@angular/core';
import { Klucze } from '../../models/klucze.model';
// dotyczy uprawnień
import { Kluczeform } from '../../models/formatki/kluczeform.model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { KluczeService } from '../../services/klucze.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-klucze-add',
  templateUrl: './klucze-add.component.html',
  styleUrls: ['./klucze-add.component.scss']
})
export class KluczeAddComponent implements OnInit, OnDestroy {
  // domyślny typ asortymentu
  private mode = 'create';
  private kluczId: string;
  private nowy: string;
  klucze: Klucze = {
    fullName: null,
    comments: null,
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
    status: null,
    numerKlucza: null,
    rfidKlucza: null,
    login: null,
    imie: null,
    nazwisko: null,
    dniTygodnia: null,
    konkretneDaty: null,
    zaklad: null,
    aktywny: null,
    godzinaOd: null,
    godzinaDo: null,
    nrKarty: null
  };

  form: FormGroup;
  backendUrl = environment.backendUrl;

  // I declare displayed fields
  dispFields: Kluczeform = {
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
    kluczeFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  // plikAdres: string;
  pliki = [{}];

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public kluczeService: KluczeService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    // reactive forms
    this.form = new FormGroup({
      aktywny: new FormControl(null),
      fullName: new FormControl(null, { validators: [Validators.required] }),
      login: new FormControl(null, { validators: [Validators.required] }),
      imie: new FormControl(null,  { validators: [Validators.required] }),
      nazwisko: new FormControl(null, { validators: [Validators.required] }),
      zaklad: new FormControl(null),
      comments: new FormControl(null),
      numerKlucza: new FormControl(null),
      rfidKlucza: new FormControl(null, { validators: [Validators.required] }),
      dniTygodnia: new FormControl(null),
      konkretneDaty: new FormControl(null),
      nrKarty: new FormControl(null, { validators: [Validators.required] })
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
          if (this.loggedInUser.kluczeFields) {
            this.dispFields = this.loggedInUser.kluczeFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('kluczId')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.kluczId = paramMap.get('kluczId');
        // I'm getting data about assortment
        this.kluczeService
          .getKlucz(this.kluczId)
          .subscribe((kluczData: { klucze: Klucze }) => {
            this.klucze = kluczData.klucze;
            delete this.klucze._id;
            this.klucze.id = kluczData.klucze._id;
            // ustawiam wartości formatki
            // this.form.setValue({
            this.form.patchValue({
              aktywny: this.klucze.aktywny,
              fullName: this.klucze.fullName,
              login: this.klucze.login,
              imie: this.klucze.imie,
              nazwisko: this.klucze.nazwisko,
              zaklad: this.klucze.zaklad,
              comments: this.klucze.comments,
              numerKlucza: this.klucze.numerKlucza,
              rfidKlucza: this.klucze.rfidKlucza,
              dniTygodnia: this.klucze.dniTygodnia,
              konkretneDaty: this.klucze.konkretneDaty,
              nrKarty: this.klucze.nrKarty
            });
          });
        if (paramMap.has('nowy')) {
          this.mode = 'create';
        }
      } else {
        this.mode = 'create';
        this.kluczId = null;
      }
    });
  }

  onSaveKlucz() {
    if (this.form.invalid) {
      return;
    }
    const klucze: Klucze = {
      aktywny: this.form.value.aktywny,
      fullName: this.form.value.fullName,
      login: this.form.value.login,
      imie: this.form.value.imie,
      nazwisko: this.form.value.nazwisko,
      zaklad: this.form.value.zaklad,
      nrKarty: this.form.value.nrKarty,
      numerKlucza: this.form.value.numerKlucza,
      rfidKlucza: this.form.value.rfidKlucza
    };

    if (this.mode === 'create') {
      this.kluczeService.addKlucz(klucze);
    } else {
      this.kluczeService.updateKlucz(this.kluczId, klucze);
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
    this.router.navigate(['/rrwmodule/klucze']);
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }
}

