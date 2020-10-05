import { Component, OnInit, OnDestroy } from '@angular/core';
import { KluczeWydania } from '../../models/kluczeWydania.model';
// dotyczy uprawnień
import { KluczeWydaniaform } from '../../models/formatki/kluczewydaniaform.model';
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
  selector: 'app-klucze-wydania-add',
  templateUrl: './klucze-wydania-add.component.html',
  styleUrls: ['./klucze-wydania-add.component.scss']
})
export class KluczeWydaniaAddComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private kluczId: string;
  private nowy: string;
  kluczeWydania: KluczeWydania = {
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
    numerKlucza: null,
    rfidKlucza: null,
    rfidKarty: null,
    imie: null,
    nazwisko: null,
    dzial: null,
    dataWydania: null,
    dataZwrotu: null,
    operacja: 'wydanie',
    wpisAutomatyczny: null
  };

  form: FormGroup;
  backendUrl = environment.backendUrl;

  // I declare displayed fields
  dispFields: KluczeWydaniaform = {
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
    kluczeWydaniaFields: null
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public kluczeService: KluczeService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // reactive forms
    this.form = new FormGroup({
      numerKlucza: new FormControl(null, { validators: [Validators.required] }),
      rfidKlucza: new FormControl(null, { validators: [Validators.required] }),
      rfidKarty: new FormControl(null, { validators: [Validators.required] }),
      imie: new FormControl(null, { validators: [Validators.required] }),
      nazwisko: new FormControl(null, { validators: [Validators.required] }),
      dzial: new FormControl(null),
      dataWydania: new FormControl(null, { validators: [Validators.required] }),
      dataZwrotu: new FormControl(null),
      // operacja: new FormControl('wydanie'),
      wpisAutomatyczny: new FormControl(null),
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
          if (this.loggedInUser.kluczeWydaniaFields) {
            this.dispFields = this.loggedInUser.kluczeWydaniaFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('Id')) {
        // ******************* it means that we are in edit mode ******************
        this.mode = 'edit';
        this.kluczId = paramMap.get('Id');
        // I'm getting data about kluczeWydania
        this.kluczeService
          .getKluczWydania(this.kluczId)
          .subscribe((kluczWydaniaData: { kluczeWydania: KluczeWydania }) => {
            this.kluczeWydania = kluczWydaniaData.kluczeWydania;
            delete this.kluczeWydania._id;
            this.kluczeWydania.id = kluczWydaniaData.kluczeWydania._id;
            // ustawiam format dat
            let dataWydTr;
            if (this.kluczeWydania.dataWydania) {
              const dWT =  new Date(this.kluczeWydania.dataWydania);
              const dWT1 = (new Date((dWT.setHours(dWT.getHours() + 2)))).toISOString();
              dataWydTr = dWT1.substring(0, dWT1.length - 1);
            } else {
              dataWydTr = null;
            }
            let dataZwrTr;
            if (this.kluczeWydania.dataZwrotu) {
              const dZT =  new Date(this.kluczeWydania.dataZwrotu);
              const dZT1 = (new Date((dZT.setHours(dZT.getHours() + 2)))).toISOString();
              dataZwrTr = dZT1.substring(0, dZT1.length - 1);
            } else {
              dataZwrTr = null;
            }

            // ustawiam wartości formatki
            // this.form.setValue({
            this.form.patchValue({
              numerKlucza: this.kluczeWydania.numerKlucza,
              rfidKlucza: this.kluczeWydania.rfidKlucza,
              rfidKarty: this.kluczeWydania.rfidKarty,
              imie: this.kluczeWydania.imie,
              nazwisko: this.kluczeWydania.nazwisko,
              dzial: this.kluczeWydania.dzial,
              dataWydania: dataWydTr,
              dataZwrotu: dataZwrTr,
              operacja: this.kluczeWydania.operacja,
              wpisAutomatyczny: this.kluczeWydania.wpisAutomatyczny,
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

  onSaveKluczWydania() {
    if (this.form.invalid) {
      return;
    }
    let operacjaLocal;
    if (this.form.value.dataZwrotu) {
      operacjaLocal = 'zwrot';
    } else {
      operacjaLocal = 'wydanie';
    }
    const kluczeWydania: KluczeWydania = {
      numerKlucza: this.form.value.numerKlucza,
      rfidKlucza: this.form.value.rfidKlucza,
      rfidKarty: this.form.value.rfidKarty,
      imie: this.form.value.imie,
      nazwisko: this.form.value.nazwisko,
      dzial: this.form.value.dzial,
      dataWydania: this.form.value.dataWydania,
      // dataWydania: this.form.value.dataWydania.replace(/-/g, '/').replace('T', ' '),
      dataZwrotu: this.form.value.dataZwrotu,
      operacja: operacjaLocal,
      wpisAutomatyczny: this.form.value.wpisAutomatyczny
    };
    if (this.mode === 'create') {
      this.kluczeService.addKluczWydania(kluczeWydania);
    } else {
      this.kluczeService.updateKluczWydania(this.kluczId, kluczeWydania);
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
    this.router.navigate(['/rrwmodule/kluczewydania']);
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }

}
