import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { Contractorform } from '../../models/formatki/contractorform.model';
import { Szkodliwaform } from '../../models/formatki/szkodliwaform.model';
import { Assortmentform } from '../../models/formatki/assortmentform.model';
import { Sekretariatform } from '../../models/formatki/sekretariatform.model';
import { Warehouseform } from '../../models/formatki/warehouseform.model';
import { Kluczeform } from '../../models/formatki/kluczeform.model';
import { KluczeRejestrform } from '../../models/formatki/kluczerejestrform.model';
import { KluczeWydaniaform } from '../../models/formatki/kluczewydaniaform.model';
import { Przesylkiform } from '../../models/formatki/przesylkiform.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  private mode = 'create';
  private userId: string;
  user: User = {
    login: null
  };

  // public loggedInUserSub: Subscription;
  public zalogowanyUser: Subscription;
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
    szkodliwaFields: null
  };
  isLoading = false;
  // private authListenerSub: Subscription;
  userIsAuthenticated = false;
  dictionaries: Dictionary[] = [
    {
      name: null
    }
  ];
  moduly: string[] = [];
  checked: boolean;

  kontrahentFields: Contractorform = {
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

  szkodliwaFields: Szkodliwaform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    projekty: false,
    firmy: false,
    widziWszystkie: false,
    pliki: false,
    buttonPliki: false
  };

  assortmentFields: Assortmentform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    projekty: false,
    firmy: false,
    widziWszystkie: false,
    pliki: false,
    buttonPliki: false,
  };

  sekretariatFields: Sekretariatform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    projekty: false,
    firmy: false,
    widziWszystkie: false,
    pliki: false,
    buttonPliki: false,
  };

  warehouseFields: Warehouseform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    projekty: false,
    firmy: false,
    widziWszystkie: false,
    pliki: false,
    buttonPliki: false,
  };

  kluczeFields: Kluczeform = {
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

  kluczeRejestrFields: KluczeRejestrform = {
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

  kluczeWydaniaFields: KluczeWydaniaform = {
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

  przesylkiFields: Przesylkiform = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false,
    projekty: false,
    firmy: false,
    pliki: false,
    buttonPliki: false
  };

  constructor(
    public usersService: UsersService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private logowanierejestracjaService: LogowanierejestracjaService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
        }
      },
      error => {
        this.router.navigate(['/login']);
      });
    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'edit';
        this.userId = paramMap.get('userId');
        // I'm getting data about user
        this.usersService.getUser(this.userId).subscribe(userData => {
          this.user = userData;
          this.moduly = this.user.moduly;
          if (typeof this.user.contractorFields !== 'undefined') {
            this.kontrahentFields = this.user.contractorFields;
          }
          if (typeof this.user.szkodliwaFields !== 'undefined') {
            this.szkodliwaFields = this.user.szkodliwaFields;
          }
          if (typeof this.user.assortmentFields !== 'undefined') {
            this.assortmentFields = this.user.assortmentFields;
          }
          if (typeof this.user.kluczeFields !== 'undefined') {
            this.kluczeFields = this.user.kluczeFields;
          }
          if (typeof this.user.kluczeRejestrFields !== 'undefined') {
            this.kluczeRejestrFields = this.user.kluczeRejestrFields;
          }
          if (typeof this.user.kluczeWydaniaFields !== 'undefined') {
            this.kluczeWydaniaFields = this.user.kluczeWydaniaFields;
          }
          if (typeof this.user.przesylkiFields !== 'undefined') {
            this.przesylkiFields = this.user.przesylkiFields;
          }
          if (typeof this.user.sekretariatFields !== 'undefined') {
            this.sekretariatFields = this.user.sekretariatFields;
          }
          if (typeof this.user.warehouseFields !== 'undefined') {
            this.warehouseFields = this.user.warehouseFields;
          }
          // do sprawdzenia
          delete this.user._id;
          this.user.id = userData._id;
        });
      } else {
        this.mode = 'create';
        this.userId = null;
      }
    });

    this.getDictionary('administracjaUprawnienia', 0);
  }

  // ZAPISANIE USERA
  onSaveUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user: User = {
      login: form.value.login,
      email: form.value.email,
      department: form.value.department,
      name: form.value.imie,
      surname: form.value.nazwisko,
      password: form.value.password,
      moduly: this.moduly,
      contractorFields: this.kontrahentFields,
      szkodliwaFields: this.szkodliwaFields,
      assortmentFields: this.assortmentFields,
      sekretariatFields: this.sekretariatFields,
      warehouseFields: this.warehouseFields,
      kluczeFields: this.kluczeFields,
      kluczeRejestrFields: this.kluczeRejestrFields,
      kluczeWydaniaFields: this.kluczeWydaniaFields,
      przesylkiFields: this.przesylkiFields
    };
    if (this.mode === 'create') {
      this.usersService.addUser(user);
    } else {
      this.usersService.updateUser(this.userId, user);
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
    window.history.go(-1);
  }

  getDictionary(name: string, index: number) {
    return (
      this.dictionaryService
        // .getDictionary('5d14a56de80a966db04beef6')
        .getDictionaryName(name)
        .subscribe(dictionaryData => {
          this.dictionaries[index] = dictionaryData;
          delete this.dictionaries[index]._id;
          this.dictionaries[index].id = dictionaryData._id;
        })
    );
  }

  changeModul(modul: string) {
    if (!this.moduly.includes(modul)) {
      this.moduly.push(modul);
    } else {
      this.moduly.splice(this.moduly.indexOf(modul), 1);
    }
  }

  zapiszPola(pola: NgForm, modul: string) {
    console.log(pola.value);
    console.log(modul);
  }

}
