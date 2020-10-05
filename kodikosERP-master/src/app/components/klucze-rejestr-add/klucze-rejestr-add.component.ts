import { Component, OnInit, OnDestroy } from '@angular/core';
import { KluczeRejestr } from '../../models/kluczeRejestr.model';
// dotyczy uprawnień
import { KluczeRejestrform } from '../../models/formatki/kluczerejestrform.model';
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
  selector: 'app-klucze-rejestr-add',
  templateUrl: './klucze-rejestr-add.component.html',
  styleUrls: ['./klucze-rejestr-add.component.scss']
})
export class KluczeRejestrAddComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private kluczId: string;
  private nowy: string;
  kluczeRejestr: KluczeRejestr = {
    comments: null,
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
    numerKlucza: null,
    rfidKlucza: null,
    liczbaWydan: null,
    aktywny: null
  };

  form: FormGroup;
  backendUrl = environment.backendUrl;

  // I declare displayed fields
  dispFields: KluczeRejestrform = {
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
    kluczeRejestrFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public kluczeService: KluczeService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // reactive forms
    this.form = new FormGroup({
      aktywny: new FormControl(null),
      comments: new FormControl(null),
      numerKlucza: new FormControl(null, { validators: [Validators.required] }),
      rfidKlucza: new FormControl(null, { validators: [Validators.required] })
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
          if (this.loggedInUser.kluczeRejestrFields) {
            this.dispFields = this.loggedInUser.kluczeRejestrFields;
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
          .getKluczRejestr(this.kluczId)
          .subscribe((kluczRejestrData: { kluczeRejestr: KluczeRejestr }) => {
            this.kluczeRejestr = kluczRejestrData.kluczeRejestr;
            delete this.kluczeRejestr._id;
            this.kluczeRejestr.id = kluczRejestrData.kluczeRejestr._id;
            // ustawiam wartości formatki
            // this.form.setValue({
            this.form.patchValue({
              aktywny: this.kluczeRejestr.aktywny,
              numerKlucza: this.kluczeRejestr.numerKlucza,
              rfidKlucza: this.kluczeRejestr.rfidKlucza,
              comments: this.kluczeRejestr.comments
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

  onSaveKluczRejestr() {
    if (this.form.invalid) {
      return;
    }
    const kluczeRejestr: KluczeRejestr = {
      aktywny: this.form.value.aktywny,
      comments: this.form.value.comments,
      numerKlucza: this.form.value.numerKlucza,
      rfidKlucza: this.form.value.rfidKlucza
    };

    if (this.mode === 'create') {
      this.kluczeService.addKluczRejestr(kluczeRejestr);
    } else {
      this.kluczeService.updateKluczRejestr(this.kluczId, kluczeRejestr);
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
    this.router.navigate(['/rrwmodule/kluczerejestr']);
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }

}


