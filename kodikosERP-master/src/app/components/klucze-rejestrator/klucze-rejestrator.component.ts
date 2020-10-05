import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { KluczeService } from '../../services/klucze.service';
import { Subscription } from 'rxjs';
import { KluczeRejestr } from '../../models/kluczeRejestr.model';
import { Klucze } from '../../models/klucze.model';
import { KluczeWydania } from '../../models/kluczeWydania.model';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { User } from '../../models/user.model';
import { KluczeRejestratorForm } from '../../models/formatki/kluczerejestratorform.model';
import { Router } from '@angular/router';
import screenfull, { Screenfull } from 'node_modules/screenfull';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
// import screenfull = require('screenfull');


@Component({
  selector: 'app-klucze-rejestrator',
  templateUrl: './klucze-rejestrator.component.html',
  styleUrls: ['./klucze-rejestrator.component.scss']
})
export class KluczeRejestratorComponent implements OnInit {

  form: FormGroup;
  // klucze rejestr subscription
  // public krSub: Subscription;

  private searchValues = {
    rfidKlucza: '',
    nrKarty: '',
    operacja: '',
    // nrKlucza w kolekcji klucze
    fullName: ''
  };

  public aktywnaKarta = {
    nrKarty: '',
    imie: null,
    nazwisko: '',
    login: '',
    zaklad: ''
  };

  kluczePerPage = 10;
  currentPage = 1;

  private kluczeRejestrSub: Subscription;
  totalKluczeRejestr = 0;
  kluczeRejestr: KluczeRejestr[] = [];

  private kluczeSub: Subscription;
  totalKlucze = 0;
  klucze: Klucze[] = [];

  private kluczeWydaniaSub: Subscription;
  kluczeWydania: KluczeWydania[] = [];
  totalKluczeWydania = 0;

  numerKlucza = '';

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
    kluczeRejestratorFields: null
  };
  userIsAuthenticated = false;

  // I declare displayed fields
  dispFields: KluczeRejestratorForm = {
    comments: false,
    status: false,
    buttonDodajKontr: false,
    buttonOfertaKontr: false,
    buttonEdytujKontr: false,
    buttonUsunKontr: false,
    widziWszystkie: false
  };

  wydaneKlucze = [];

  // pełny ekran
  pelny = false;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public kluczeService: KluczeService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // const inTxtId = document.getElementById('nrKart');
    // inTxtId.focus();
    this.pelny = false;

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
          if (this.loggedInUser.kluczeRejestratorFields) {
            this.dispFields = this.loggedInUser.kluczeRejestratorFields;
          }
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );

    this.form = new FormGroup({
      numerRFID: new FormControl(null),
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    const rfid = this.form.value.numerRFID;

    this.form.patchValue({
      numerRFID: ''
    });

    this.searchValues = {
      rfidKlucza: rfid,
      nrKarty: rfid,
      operacja: null,
      fullName: null
    };

    this.currentPage = 1;
    this.kluczeService.getKluczeRejestr(
      this.kluczePerPage,
      this.currentPage,
      this.searchValues
    );

    // Sprawdzam czy RFID jest w kolekcji kluczeRejestr (czy jest kluczem)
    this.kluczeRejestrSub = this.kluczeService
      .getKluczeRejestrUpdatedListener()
      .subscribe(
        (kluczeRejestrData: {
          kluczeRejestr: KluczeRejestr[];
          kluczeRejestrCount: number;
        }) => {
          if (kluczeRejestrData.kluczeRejestr.length === 1) {
            // klucz jest w kolekcji kluczeRejestr
            this.totalKluczeRejestr = kluczeRejestrData.kluczeRejestrCount;
            this.kluczeRejestr = kluczeRejestrData.kluczeRejestr;
            this.numerKlucza = this.kluczeRejestr[0].numerKlucza;
            // console.log(this.numerKlucza);
            // sprawdzam czy klucz jest w kolekcji klucze wydania ze statusem operacja:wydanie
            // jeżeli jest to: zwrot, jeżeli nie to: wydanie
            this.searchValues.operacja = 'wydanie';
            this.searchValues.rfidKlucza = rfid;
            this.kluczeService.getKluczeWydania(
              this.kluczePerPage,
              this.currentPage,
              this.searchValues
            );
            this.kluczeWydaniaSub = this.kluczeService
              .getKluczeWydaniaUpdatedListener()
              .subscribe(
                (kluczeWydaniaData: {
                  kluczeWydania: KluczeWydania[];
                  kluczeWydaniaCount: number;
                }) => {
                  if (kluczeWydaniaData.kluczeWydania.length > 0) {
                    // klucz został wydany i robimy zwrot
                    // console.log('zwrot klucza', this.numerKlucza);
                    this.openDialogZwrotKlucza(this.numerKlucza);
                    // console.log(kluczeWydaniaData.kluczeWydania);
                    this.totalKluczeWydania = kluczeWydaniaData.kluczeWydaniaCount;
                    this.kluczeWydania = kluczeWydaniaData.kluczeWydania;
                    this.kluczeWydania[0].operacja = 'zwrot';
                    this.kluczeWydania[0].dataZwrotu = new Date();
                    this.kluczeService.updateKluczWydania(this.kluczeWydania[0].id, this.kluczeWydania[0]);
                    // sprawdzam czy klucz jest też w tablicy wydaneKlucze
                    // jak jest to go usuwam z tablicy
                    // console.log('CZY KLUCZ JEST', this.wydaneKlucze.indexOf(this.numerKlucza));
                    if (this.wydaneKlucze.indexOf(this.numerKlucza) >= 0) {
                      this.wydaneKlucze.splice(this.wydaneKlucze.indexOf(this.numerKlucza), 1);
                    }
                    // console.log(this.kluczeWydania);
                    this.kluczeWydaniaSub.unsubscribe();
                  } else {
                    // klucz nie jest wydany i robimy wydanie jeżeli jest aktywna karta (musimy wiedzieć komu wydajemy)
                    if (this.aktywnaKarta.imie) {
                      // console.log('rozpoczynam wydawanie klucza:', this.numerKlucza);
                      // Zanim wydam klucz sprawdzam uprawnienia do tego klucza dla danej karty
                      this.searchValues.fullName = this.numerKlucza;
                      this.searchValues.nrKarty = this.aktywnaKarta.nrKarty;
                      // console.log(this.searchValues);
                      this.kluczeService.getKlucze(
                        this.kluczePerPage,
                        this.currentPage,
                        this.searchValues
                      );
                      this.kluczeSub = this.kluczeService
                        .getKluczeUpdatedListener()
                        .subscribe(
                          (kluczeData: {
                            klucze: Klucze[];
                            kluczeCount: number;
                          }) => {
                            this.totalKlucze = kluczeData.kluczeCount;
                            this.klucze = kluczeData.klucze;
                            // console.log('klucze', this.klucze);
                            if (this.klucze.length > 0) {
                              // Ta karta posiada uprawnienia do tego klucza
                              // console.log('WYDAJĘ KLUCZ:', this.numerKlucza);
                              const kluczeWydania: KluczeWydania = {
                                numerKlucza: this.numerKlucza,
                                rfidKlucza: this.klucze[0].rfidKlucza,
                                rfidKarty: this.klucze[0].nrKarty,
                                imie: this.klucze[0].imie,
                                nazwisko: this.klucze[0].nazwisko,
                                dzial: this.klucze[0].zaklad,
                                dataWydania: new Date(),
                                // dataWydania: this.form.value.dataWydania.replace(/-/g, '/').replace('T', ' '),
                                dataZwrotu: null,
                                operacja: 'wydanie',
                                wpisAutomatyczny: true
                              };
                              this.kluczeService.addKluczWydania(kluczeWydania);
                              this.wydaneKlucze.unshift(kluczeWydania.numerKlucza);
                              this.kluczeSub.unsubscribe();
                            } else {
                              // Karta nie posiada uprawnień do tego klucza
                              // alert('Nie masz uprawnień do pobierania tego klucza.');
                              this.openDialogBrakUprawnien();
                              this.kluczeSub.unsubscribe();
                            }
                          }
                        );
                    } else {
                      // alert('Zeskanuj kartę aby pobrać klucz');
                      this.openDialogZeskanujKarte();
                    }
                    this.kluczeWydaniaSub.unsubscribe();
                  }
                }
              );


            this.kluczeRejestrSub.unsubscribe();
          } else {
            // klucza nie ma w kolekcji kluczeRejestr (czyli nie jest kluczem, sprawdzam czy jest kartą)
            // console.log('klucza nie ma w kolekcji kluczeRejestr');
            // sprawdzam czy RFID jest w kolekcji klucze w polu nrKarty (uprawnienia)
            this.searchValues.rfidKlucza = null;
            this.kluczeService.getKlucze(
              this.kluczePerPage,
              this.currentPage,
              this.searchValues
            );
            this.kluczeSub = this.kluczeService
              .getKluczeUpdatedListener()
              .subscribe(
                (kluczeData: {
                  klucze: Klucze[];
                  kluczeCount: number;
                }) => {
                  // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
                  this.totalKlucze = kluczeData.kluczeCount;
                  this.klucze = kluczeData.klucze;
                  if (this.klucze.length > 0) {
                    // sprawdzam czy są aktualnie wydawane jakieś klucze
                    // jeżeli są to czyszczę informację o tych wydaniach
                    if (this.wydaneKlucze.length > 0) {
                      this.wydaneKlucze = [];
                    }
                    // jeżeli drugi raz przykładam tą samą kartę to kasuję informację
                    // o tym kto pobiera - jest to zakończenie operacji pobierania kluczy
                    // przez daną osobę
                    if (this.aktywnaKarta.nrKarty === this.klucze[0].nrKarty || this.klucze[0].login === 'koniecTransakcji') {
                      // console.log('TA SAMA KARTA PRZYŁOŻONA DRUGI RAZ');
                      this.aktywnaKarta.imie = null;
                      this.aktywnaKarta.nazwisko = null;
                      this.aktywnaKarta.nrKarty = null;
                      this.aktywnaKarta.login = null;
                      this.aktywnaKarta.zaklad = null;
                    } else {
                      // RFID: nie ma w kluczach jest w uprawnieniach
                      this.aktywnaKarta.imie = this.klucze[0].imie;
                      this.aktywnaKarta.nazwisko = this.klucze[0].nazwisko;
                      this.aktywnaKarta.nrKarty = this.klucze[0].nrKarty;
                      this.aktywnaKarta.login = this.klucze[0].login;
                      this.aktywnaKarta.zaklad = this.klucze[0].zaklad;
                    }
                    // console.log(this.aktywnaKarta);
                    this.kluczeSub.unsubscribe();
                  } else {
                    // RFID nie ma w kluczach, nie ma w uprawnieniach
                    // alert('Nieznany klucz lub karta.');
                    this.openDialogNieznanaKarta();
                    this.kluczeSub.unsubscribe();
                  }

                }
              );


            this.kluczeRejestrSub.unsubscribe();
          }

        }
      );

  }

  focusPole() {
    const inTxtId = document.getElementById('nrKart');
    inTxtId.focus();
  }

  openFullScreen() {
    const inTxtId = document.getElementById('nrKart');
    // screenfull.isEnabled;
    (screenfull as Screenfull).request();
    // (screenfull as Screenfull).toggle();
    inTxtId.focus();
    this.pelny = true;
  }

  //   this.krSub = this.kluczeService.getKluczRejestr(rfid).subscribe((kluczRejestrData: {message: any, kluczeRejestr: any}) => {
  //     // console.log('KRD', kluczRejestrData);
  //     if (kluczRejestrData.message === 'kluczeRejestr ID not found') {
  //       // nie znalazł klucza w kolekcji kluczeRejestr
  //       console.log('Not FOUND');
  //       this.krSub.unsubscribe();
  //     } else {
  //       // znalazł klucz w kolekcji kluczeRejestr
  //       console.log('KRD.KR', kluczRejestrData.kluczeRejestr);
  //       console.log('KRD.KR.NRK', kluczRejestrData.kluczeRejestr.numerKlucza);
  //     }
  //   });
  // }

  openDialogZeskanujKarte() {
    const dialogRef1 = this.dialog.open(DialogZeskanujKarteComponent, {
    });
    dialogRef1.afterOpened().subscribe(result => {
      setTimeout(() => {
        dialogRef1.close();
      }, 2000);
    });
  }

  openDialogZwrotKlucza(nrKlucza: string) {
    const dialogRef2 = this.dialog.open(DialogZwrotKluczaComponent, {
      data: { nrKlucza }
    });
    dialogRef2.afterOpened().subscribe(result => {
      setTimeout(() => {
        dialogRef2.close();
      }, 2000);
    });
  }

  openDialogBrakUprawnien() {
    const dialogRef3 = this.dialog.open(DialogBrakUprawnienComponent, {
    });
    dialogRef3.afterOpened().subscribe(result => {
      setTimeout(() => {
        dialogRef3.close();
      }, 2000);
    });
  }

  openDialogNieznanaKarta() {
    const dialogRef4 = this.dialog.open(DialogNieznanaKrataComponent, {
    });
    dialogRef4.afterOpened().subscribe(result => {
      setTimeout(() => {
        dialogRef4.close();
      }, 2000);
    });
  }


}


@Component({
  selector: 'app-dialog-zeskanujkarte',
  templateUrl: 'dialog-zeskanujKarte.html'
})
export class DialogZeskanujKarteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}

@Component({
  selector: 'app-dialog-zwrotklucza',
  templateUrl: 'dialog-zwrotKlucza.html'
})
export class DialogZwrotKluczaComponent {
  nrKlucza: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}

@Component({
  selector: 'app-dialog-brakuprawnien',
  templateUrl: 'dialog-brakUprawnien.html'
})
export class DialogBrakUprawnienComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}

@Component({
  selector: 'app-dialog-nieznanakarta',
  templateUrl: 'dialog-nieznanaKarta.html'
})
export class DialogNieznanaKrataComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
