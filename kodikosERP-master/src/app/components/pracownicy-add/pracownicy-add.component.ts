import { Component, OnInit, NgModule, OnDestroy } from "@angular/core";
import { Pracownicy } from "../../models/pracownicy.model";
import { Form, FormGroup, FormControl, Validators } from "@angular/forms";
import { PracownicyService } from "../../services/pracownicy.service";
import { Dictionary } from "../../models/slownik.model";
import { DictionaryService } from "../../services/slowniki.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { User } from "../../models/user.model";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { LogowanierejestracjaService } from "../../services/logowanierejestracja.service";
import { MatTableDataSource } from "@angular/material/table";
import { PlikiService } from "../../services/pliki.service";
import { environment } from "../../../environments/environment";
import { Contractor } from "../../models/kontrahent.model";

@Component({
  selector: "app-pracownicy-add",
  templateUrl: "./pracownicy-add.component.html",
  styleUrls: ["./pracownicy-add.component.scss"],
})
export class PracownicyAddComponent implements OnInit {

  // domyślny typ pracownicy
  private mode = "create";
  private pracownikId: string;
  pracownicy: Pracownicy = {
    accountManager: null,
    accountManagerLogin: null,
    addBy: { login: null, name: null, surname: null, email: null },
    modBy: { login: null, name: null, surname: null, email: null },
    addDate: null,
    modDate: null,
    login: null,
    username: null,
    name: null,
    drugieImie: null,
    surname: null,
    displayName: null,
    plec: null,
    nazwiskoRodowe: null,
    nazwiskoMatki: null,
    imieMatki: null,
    imieOjca: null,
    dataUrodzenia: null,
    miejsceUrodzenia: null,
    obcokrajowiec: false,
    kartaStalegoPobytu: null,
    narodowosc: null,
    obywatelstwo: null,
    dowodOsobisty: null,
    dowodWydanyPrzez: null,
    paszport: null,
    paszportWydanyPrzez: null,
    email: null,
    phone: null,
    department: null,
    pesel: null,
    nip: null,
    urzadSkarbowy: null,
    wyksztalcenie: null,
    zawodWyuczony: null,
    uwagi: null,
    aktualniePracujacy: false,
    status: null,
    nrKartyWejsciowej: null,
    nrKartyParkingowej: null,
    klucze: [null],
  };

  // formatki dodatkowych obiektów
  rachunkiBankowe = false;
  stanowiska = false;
  umowyoPrace = false;
  adresyZamieszkania = false;
  przebiegZatrudnienia = false;
  dzieci = false;
  oswiadczenia = false;
  zezwolenia = false;
  kartyPobytu = false;
  paszporty = false;
  badaniaOkresowe = false;
  szkoleniaBHP = false;
  dodatkoweKwalifikacje = false;
  wyroznieniaKary = false;

  // matTable dodatkowych obiektów
  public rachunkiBankoweDataSource: any;
  public stanowiskaDataSource: any;
  public umowyoPraceDataSource: any;
  public adresyZamieszkaniaDataSource: any;
  public przebiegZatrudnieniaDataSource: any;
  public dzieciDataSource: any;
  public oswiadczeniaDataSource: any;
  public zezwoleniaDataSource: any;
  public kartyPobytuDataSource: any;
  public paszportyDataSource: any;
  public badaniaOkresoweDataSource: any;
  public szkoleniaBHPDataSource: any;
  public dodatkoweKwalifikacjeDataSource: any;
  public wyroznieniaKaryDataSource: any;
  public firmyDataSource: any;

  // kolumny dodatkowych obiektów
  rachunkiBankoweKolumny: string[];
  stanowiskaKolumny: string[];
  umowyoPraceKolumny: string[];
  adresyZamieszkaniaKolumny: string[];
  przebiegZatrudnieniaKolumny: string[];
  dzieciKolumny: string[];
  oswiadczeniaKolumny: string[];
  zezwoleniaKolumny: string[];
  kartyPobytuKolumny: string[];
  paszportyKolumny: string[];
  badaniaOkresoweKolumny: string[];
  szkoleniaBHPKolumny: string[];
  dodatkoweKwalifikacjeKolumny: string[];
  wyroznieniaKaryKolumny: string[];
  kluczeKolumny: string[];
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

  public plikiDataSource: any;
  mozliwoscAnulowania = true;
  katalogPlikow = "pracownicy";

  nazwaPlikuStanowiska: Object[] = [];
  nazwaPlikuumowyoPrace: Object[] = [];
  nazwaPlikuprzebiegZatrudnienia: Object[] = [];
  nazwaPlikudzieci: Object[] = [];
  nazwaPlikuoswiadczenia: Object[] = [];
  nazwaPlikuzezwolenia: Object[] = [];
  nazwaPlikukartyPobytu: Object[] = [];
  nazwaPlikupaszporty: Object[] = [];
  nazwaPlikubadaniaOkresowe: Object[] = [];
  nazwaPlikuszkoleniaBHP: Object[] = [];
  nazwaPlikudodatkoweKwalifikacje: Object[] = [];
  nazwaPlikuwyroznieniaKary: Object[] = [];

  dictionaries: Dictionary[] = [
    {
      name: null,
    },
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
  };

  userIsAuthenticated = false;
  public zalogowanyUser: Subscription;
  pliki = [{}];

  // lista kontrahentów
  contractors: Contractor[] = [];
  term: string;
  p = 1;
  rachunkiBankoweGroup: FormGroup;
  stanowiskaGroup: FormGroup;
  umowyoPraceGroup: FormGroup;
  adresyZamieszkaniaGroup: FormGroup;
  przebiegZatrudnieniaGroup: FormGroup;
  dzieciGroup: FormGroup;
  oswiadczeniaGroup: FormGroup;
  zezwoleniaGroup: FormGroup;
  kartyPobytuGroup: FormGroup;
  paszportyGroup: FormGroup;
  badaniaOkresoweGroup: FormGroup;
  szkoleniaBHPGroup: FormGroup;
  dodatkoweKwalifikacjeGroup: FormGroup;
  wyroznieniaKaryGroup: FormGroup;
  plik: any;

  constructor(
    private logowanierejestracjaService: LogowanierejestracjaService,
    public pracownicyService: PracownicyService,
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private router: Router,
    private plikiService: PlikiService,
  ) { }

  ngOnInit() {
    const valStart = { values: [""] };
    this.dictionaries[3] = valStart;
    this.dictionaries[2] = valStart;
    this.dictionaries[1] = valStart;

    this.getDictionary('firmy', 3);
    this.getDictionary("pracownicyPliki", 2);
    this.getDictionary("pracownicyPlec", 1);

    // reactive forms
    this.formPliki = new FormGroup({
      typPliku: new FormControl(null),
    });
    this.rachunkiBankoweGroup = new FormGroup({
      rachunkiBankoweNr: new FormControl(null),
      rachunkiBankoweNazwaBanku: new FormControl(null),
    });
    this.stanowiskaGroup = new FormGroup({
      stanowiskaStanowisko: new FormControl(null),
      stanowiskaOd: new FormControl(null),
      stanowiskaDo: new FormControl(null),
      stanowiskaUwagi: new FormControl(null),
      stanowiskaFirmaNazwa: new FormControl(null),
      stanowiskaFirmaId: new FormControl(null),
      stanowiskaDepartment: new FormControl(null),
      stanowiskaDataZatrudnienia: new FormControl(null),
      stanowiskaRodzajUmowy: new FormControl(null),
      stanowiskaDataZwolnienia: new FormControl(null),
      stanowiskaZajomwaneStanowisko: new FormControl(null),
      stanowiskaZawodWykonywany: new FormControl(null),
      stanowiskaStanowiskaUwagi: new FormControl(null),
    });
    this.umowyoPraceGroup = new FormGroup({
      umowyoPracenumer: new FormControl(null),
      umowyoPraceod: new FormControl(null),
      umowyoPracedo: new FormControl(null),
      umowyoPracetypUmowy: new FormControl(null),
      umowyoPracedataPodpisu: new FormControl(null),
      umowyoPraceprzedstawicielZakladu: new FormControl(null),
      umowyoPraceumowyoPraceuwagi: new FormControl(null),
      umowyoPracefirmaNazwa: new FormControl(null),
      umowyoPracefirmaId: new FormControl(null),
    });
    this.adresyZamieszkaniaGroup = new FormGroup({
      adresyZamieszkaniakraj: new FormControl(null),
      adresyZamieszkaniawojewodztwo: new FormControl(null),
      adresyZamieszkaniapowiat: new FormControl(null),
      adresyZamieszkaniagmina: new FormControl(null),
      adresyZamieszkaniamiejscowosc: new FormControl(null),
      adresyZamieszkaniaulica: new FormControl(null),
      adresyZamieszkanianumerDomu: new FormControl(null),
      adresyZamieszkanianumerMieszkania: new FormControl(null),
      adresyZamieszkaniakod: new FormControl(null),
      adresyZamieszkaniatel: new FormControl(null),
      adresyZamieszkaniaod: new FormControl(null),
      adresyZamieszkaniado: new FormControl(null),
      adresyZamieszkaniaadrZamUwagi: new FormControl(null),
    });
    this.przebiegZatrudnieniaGroup = new FormGroup({
      przebiegZatrudnieniaod: new FormControl(null),
      przebiegZatrudnieniado: new FormControl(null),
      przebiegZatrudnieniarodzajZmiany: new FormControl(null),
      przebiegZatrudnieniastanowisko: new FormControl(null),
      przebiegZatrudnieniadzial: new FormControl(null),
      przebiegZatrudnieniawymiarZatrudnienia: new FormControl(null),
      przebiegZatrudnieniawymiarZatrudnieniaUlamek: new FormControl(null),
      przebiegZatrudnieniaplacaZasadnicza: new FormControl(null),
      przebiegZatrudnieniaplacZasWaluta: new FormControl(null),
      przebiegZatrudnieniadodatekFunkcyjny: new FormControl(null),
      przebiegZatrudnieniadodFunkcWaluta: new FormControl(null),
      przebiegZatrudnieniadodatek: new FormControl(null),
      przebiegZatrudnieniadodatekWaluta: new FormControl(null),
      przebiegZatrudnieniafirmaNazwa: new FormControl(null),
      przebiegZatrudnieniafirmaId: new FormControl(null),
      przebiegZatrudnieniapodstawaPrawnaZatrudnienia: new FormControl(null),
      przebiegZatrudnieniarodzajUmowy: new FormControl(null),
    });
    this.dzieciGroup = new FormGroup({
      dzieciimieDziecka: new FormControl(null),
      dziecinazwiskoDziecka: new FormControl(null),
      dziecidataUrodzeniaDziecka: new FormControl(null),
      dziecipeselDziecka: new FormControl(null),
      dziecizasilekPielegnOd: new FormControl(null),
      dziecizasilekPielegnDo: new FormControl(null),
      dziecizasilekRodzinnyOd: new FormControl(null),
      dziecizasilekRodzinnyDo: new FormControl(null),
    });
    this.oswiadczeniaGroup = new FormGroup({
      oswiadczenianazwaOswiadczenia: new FormControl(null),
      oswiadczeniatypOswiadczenia: new FormControl(null),
      oswiadczeniakodZawoduOsw: new FormControl(null),
      oswiadczeniapracodawcaUzytkownikOsw: new FormControl(null),
      oswiadczeniaoswOd: new FormControl(null),
      oswiadczeniaoswDo: new FormControl(null),
    });
    this.zezwoleniaGroup = new FormGroup({
      zezwolenianazwaZezwolenia: new FormControl(null),
      zezwoleniatypZezwolenia: new FormControl(null),
      zezwoleniakodZawoduZezw: new FormControl(null),
      zezwoleniapracodawcaUzytkownikZezw: new FormControl(null),
      zezwoleniazezwOd: new FormControl(null),
      zezwoleniazezwDo: new FormControl(null),
    });
    this.kartyPobytuGroup = new FormGroup({
      kartyPobytukartaOd: new FormControl(null),
      kartyPobytukartaDo: new FormControl(null),
      kartyPobytunazwaKarty: new FormControl(null),
      kartyPobytunumerKarty: new FormControl(null),
    });
    this.paszportyGroup = new FormGroup({
      paszportypaszportOd: new FormControl(null),
      paszportypaszportDo: new FormControl(null),
      paszportynrPaszportu: new FormControl(null),
    });
    this.badaniaOkresoweGroup = new FormGroup({
      badaniaOkresoweod: new FormControl(null),
      badaniaOkresowedo: new FormControl(null),
      badaniaOkresowebadOkrUwagi: new FormControl(null),
    });
    this.szkoleniaBHPGroup = new FormGroup({
      szkoleniaBHPod: new FormControl(null),
      szkoleniaBHPdo: new FormControl(null),
      szkoleniaBHPszkoleniaBhpUwagi: new FormControl(null),
    });
    this.dodatkoweKwalifikacjeGroup = new FormGroup({
      dodatkoweKwalifikacjeod: new FormControl(null),
      dodatkoweKwalifikacjedo: new FormControl(null),
      dodatkoweKwalifikacjedodKwalifUwagi: new FormControl(null),
    });
    this.wyroznieniaKaryGroup = new FormGroup({
      wyroznieniaKaryod: new FormControl(null),
      wyroznieniaKarydo: new FormControl(null),
      wyroznieniaKarywyrKarUwagi: new FormControl(null),
    });
    this.form = new FormGroup({
      login: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null),
      username: new FormControl(null),
      name: new FormControl(null),
      drugieImie: new FormControl(null),
      surname: new FormControl(null),
      displayName: new FormControl(null),
      plec: new FormControl(null),
      nazwiskoRodowe: new FormControl(null),
      nazwiskoMatki: new FormControl(null),
      imieMatki: new FormControl(null),
      imieOjca: new FormControl(null),
      dataUrodzenia: new FormControl(null),
      miejsceUrodzenia: new FormControl(null),
      obcokrajowiec: new FormControl(null),
      kartaStalegoPobytu: new FormControl(null),
      narodowosc: new FormControl(null),
      obywatelstwo: new FormControl(null),
      dowodOsobisty: new FormControl(null),
      dowodWydanyPrzez: new FormControl(null),
      paszport: new FormControl(null),
      paszportWydanyPrzez: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
      department: new FormControl(null),
      pesel: new FormControl(null),
      nip: new FormControl(null),
      urzadSkarbowy: new FormControl(null),
      wyksztalcenie: new FormControl(null),
      zawodWyuczony: new FormControl(null),
      uwagi: new FormControl(null),
      aktualniePracujacy: new FormControl(null),
      status: new FormControl(null),
      nrKartyWejsciowej: new FormControl(null),
      nrKartyParkingowej: new FormControl(null),
      klucze: new FormControl(null),
    });

    // sprawdzam usera
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      (user) => {
        this.loggedInUser = user;
        if (
          typeof this.loggedInUser !== "undefined" &&
          this.loggedInUser.moduly !== null &&
          typeof this.loggedInUser.moduly !== "undefined"
        ) {
          this.userIsAuthenticated = true;
        }
      },
      (error) => {
        this.router.navigate(["/login"]);
      }
    );

    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("pracownikId")) {
        // ******************* it means that we are in edit mode ******************
        this.mode = "edit";
        this.pracownikId = paramMap.get("pracownikId");
        // I'm getting data about pracownicy
        this.pracownicyService
          .getPracownicy(this.pracownikId)
          .subscribe((pracownicyData: { pracownicy: Pracownicy }) => {
            this.pracownicy = pracownicyData.pracownicy;
            delete this.pracownicy._id;
            this.pracownicy.id = pracownicyData.pracownicy._id;
            this.rachunkiBankoweDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.rachunkiBankowe
            );
            this.stanowiskaDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.stanowiska
            );
            this.umowyoPraceDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.umowyoPrace
            );
            this.adresyZamieszkaniaDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.adresyZamieszkania
            );
            this.przebiegZatrudnieniaDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.przebiegZatrudnienia
            );
            this.dzieciDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.dzieci
            );
            this.oswiadczeniaDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.oswiadczenia
            );
            this.zezwoleniaDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.zezwolenia
            );
            this.kartyPobytuDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.kartyPobytu
            );
            this.paszportyDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.paszporty
            );
            this.badaniaOkresoweDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.badaniaOkresowe
            );
            this.szkoleniaBHPDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.szkoleniaBHP
            );
            this.dodatkoweKwalifikacjeDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.dodatkoweKwalifikacje
            );
            this.wyroznieniaKaryDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.wyroznieniaKary
            );
            this.plikiDataSource = new MatTableDataSource(
              pracownicyData.pracownicy.pliki
            );
            // pliki
            if (typeof pracownicyData.pracownicy.pliki !== "undefined") {
              for (const plik of pracownicyData.pracownicy.pliki) {
                this.plikiLocal.push(plik);
              }
            }

            this.form.patchValue({
              login: this.pracownicy.login,
              username: this.pracownicy.username,
              name: this.pracownicy.name,
              drugieImie: this.pracownicy.drugieImie,
              surname: this.pracownicy.surname,
              displayName: this.pracownicy.displayName,
              plec: this.pracownicy.plec,
              nazwiskoRodowe: this.pracownicy.nazwiskoRodowe,
              nazwiskoMatki: this.pracownicy.nazwiskoMatki,
              imieMatki: this.pracownicy.imieMatki,
              imieOjca: this.pracownicy.imieOjca,
              dataUrodzenia: this.pracownicy.dataUrodzenia,
              miejsceUrodzenia: this.pracownicy.miejsceUrodzenia,
              obcokrajowiec: this.pracownicy.obcokrajowiec,
              kartaStalegoPobytu: this.pracownicy.kartaStalegoPobytu,
              narodowosc: this.pracownicy.narodowosc,
              obywatelstwo: this.pracownicy.obywatelstwo,
              dowodOsobisty: this.pracownicy.dowodOsobisty,
              dowodWydanyPrzez: this.pracownicy.dowodWydanyPrzez,
              paszport: this.pracownicy.paszport,
              paszportWydanyPrzez: this.pracownicy.paszportWydanyPrzez,
              email: this.pracownicy.email,
              phone: this.pracownicy.phone,
              department: this.pracownicy.department,
              pesel: this.pracownicy.pesel,
              nip: this.pracownicy.nip,
              urzadSkarbowy: this.pracownicy.urzadSkarbowy,
              wyksztalcenie: this.pracownicy.wyksztalcenie,
              zawodWyuczony: this.pracownicy.zawodWyuczony,
              uwagi: this.pracownicy.uwagi,
              aktualniePracujacy: this.pracownicy.aktualniePracujacy,
              status: this.pracownicy.status,
              nrKartyWejsciowej: this.pracownicy.nrKartyWejsciowej,
              nrKartyParkingowej: this.pracownicy.nrKartyParkingowej,
              klucze: this.pracownicy.klucze,
            });
          });
        if (paramMap.has("nowy")) {
          this.mode = "create";
        }
      } else {
        this.mode = "create";
        this.pracownikId = null;
      }
    });

    this.rachunkiBankoweKolumny = ["nr", "glowny", "nazwaBanku", "action"];
    this.stanowiskaKolumny = [
      "stanowisko",
      "od",
      "do",
      "uwagi",
      "aktualne",
      "firmaNazwa",
      "department",
      "dataZatrudnienia",
      "rodzajUmowy",
      "dataZwolnienia",
      "zajmowaneStanowisko",
      "zawodWykonywany",
      "stanowiskaUwagi",
      "plikiStanowiska",
      "action",
    ];
    this.umowyoPraceKolumny = [
      "numer",
      "od",
      "do",
      "typUmowy",
      "dataPodpisu",
      "przedstawicielZakladu",
      "umowyoPraceuwagi",
      "firmaNazwa",
      "aktualna",
      "plikiUmowyPraca",
      "action",
    ];
    this.adresyZamieszkaniaKolumny = [
      "kraj",
      "wojewodztwo",
      "powiat",
      "gmina",
      "miejscowosc",
      "ulica",
      "numerDomu",
      "numerMieszkania",
      "kod",
      "tel",
      "aktualny",
      "od",
      "do",
      "adrZamUwagi",
      "action",
    ];
    this.przebiegZatrudnieniaKolumny = [
      "od",
      "do",
      "rodzajZmiany",
      "stanowisko",
      "dzial",
      "wymiarZatrudnienia",
      "wymiarZatrudnieniaUlamek",
      "placaZasadnicza",
      "placZasWaluta",
      "dodatekFunkcyjny",
      "dodFunkcWaluta",
      "dodatek",
      "dodatekWaluta",
      "firmaNazwa",
      "podstawaPrawnaZatrudnienia",
      "rodzajUmowy",
      "plikiPrzebZatr",
      "action",
    ];
    this.dzieciKolumny = [
      "imieDziecka",
      "nazwiskoDziecka",
      "dataUrodzeniaDziecka",
      "peselDziecka",
      "zasilekPielegnOd",
      "zasilekPielegnDo",
      "zasilekRodzinnyOd",
      "zasilekRodzinnyDo",
      "plikiDzieci",
      "action",
    ];
    this.oswiadczeniaKolumny = [
      "nazwaOswiadczenia",
      "typOswiadczenia",
      "kodZawoduOsw",
      "pracodawcaUzytkownikOsw",
      "OswOd",
      "OswDo",
      "plikiOswiadczenia",
      "action",
    ];
    this.zezwoleniaKolumny = [
      "nazwaZezwolenia",
      "typZezwolenia",
      "kodZawoduZezw",
      "pracodawcaUzytkownikZezw",
      "ZezwOd",
      "ZezwDo",
      "plikiZezwolenia",
      "action",
    ];
    this.kartyPobytuKolumny = [
      "kartaOd",
      "kartaDo",
      "nazwaKarty",
      "numerKarty",
      "plikiKP",
      "action",
    ];
    this.paszportyKolumny = [
      "paszportOd",
      "paszportDo",
      "nrPaszportu",
      "plikiKP",
      "action",
    ];
    this.badaniaOkresoweKolumny = [
      "od",
      "do",
      "badOkrUwagi",
      "aktualne",
      "plikiBadOkr",
      "action",
    ];
    this.szkoleniaBHPKolumny = [
      "od",
      "do",
      "szkoleniaBhpUwagi",
      "aktualne",
      "plikiBHP",
      "action",
    ];
    this.dodatkoweKwalifikacjeKolumny = [
      "od",
      "do",
      "dodKwalifUwagi",
      "plikiKwalifikacje",
      "action",
    ];
    this.wyroznieniaKaryKolumny = ["od", "do", "wyrKarUwagi", "plikiWyrKar", "action"];
    this.kluczeKolumny = ["name", "action"];
    this.plikiKolumny = ["name", "rodzaj", "action"];
  }

  onSavePracownicy() {
    if (this.form.invalid) {
      return;
    }
    // ustawiam status plików na zatwierdzony
    this.plikiLocal.forEach(plik => {
      plik.zatwierdzony = true;
      if (!plik.katalog) {
        plik.katalog = "pracownicy";
      }
    });

    const pracownicy: Pracownicy = {
      login: this.form.value.login,
      username: this.form.value.username,
      name: this.form.value.name,
      drugieImie: this.form.value.drugieImie,
      surname: this.form.value.surname,
      displayName: this.form.value.displayName,
      plec: this.form.value.plec,
      nazwiskoRodowe: this.form.value.nazwiskoRodowe,
      nazwiskoMatki: this.form.value.nazwiskoMatki,
      imieMatki: this.form.value.imieMatki,
      imieOjca: this.form.value.imieOjca,
      dataUrodzenia: this.form.value.dataUrodzenia,
      miejsceUrodzenia: this.form.value.miejsceUrodzenia,
      obcokrajowiec: this.form.value.obcokrajowiec,
      kartaStalegoPobytu: this.form.value.kartaStalegoPobytu,
      narodowosc: this.form.value.narodowosc,
      obywatelstwo: this.form.value.obywatelstwo,
      dowodOsobisty: this.form.value.dowodOsobisty,
      dowodWydanyPrzez: this.form.value.dowodWydanyPrzez,
      paszport: this.form.value.paszport,
      paszportWydanyPrzez: this.form.value.paszportWydanyPrzez,
      email: this.form.value.email,
      phone: this.form.value.phone,
      department: this.form.value.department,
      pesel: this.form.value.pesel,
      nip: this.form.value.nip,
      urzadSkarbowy: this.form.value.urzadSkarbowy,
      wyksztalcenie: this.form.value.wyksztalcenie,
      zawodWyuczony: this.form.value.zawodWyuczony,
      rachunkiBankowe: this.pracownicy.rachunkiBankowe,
      stanowiska: this.pracownicy.stanowiska,
      umowyoPrace: this.pracownicy.umowyoPrace,
      adresyZamieszkania: this.pracownicy.adresyZamieszkania,
      przebiegZatrudnienia: this.pracownicy.przebiegZatrudnienia,
      dzieci: this.pracownicy.dzieci,
      oswiadczenia: this.pracownicy.oswiadczenia,
      zezwolenia: this.pracownicy.zezwolenia,
      kartyPobytu: this.pracownicy.kartyPobytu,
      paszporty: this.pracownicy.paszporty,
      badaniaOkresowe: this.pracownicy.badaniaOkresowe,
      szkoleniaBHP: this.pracownicy.szkoleniaBHP,
      dodatkoweKwalifikacje: this.pracownicy.dodatkoweKwalifikacje,
      wyroznieniaKary: this.pracownicy.wyroznieniaKary,
      uwagi: this.form.value.uwagi,
      aktualniePracujacy: this.form.value.aktualniePracujacy,
      status: this.form.value.status,
      nrKartyWejsciowej: this.form.value.nrKartyWejsciowej,
      nrKartyParkingowej: this.form.value.nrKartyParkingowej,
      klucze: this.form.value.klucze,
      pliki: this.plikiLocal,
    };

    if (this.mode === "create") {
      this.pracownicyService.addPracownicy(pracownicy);
    } else {
      this.pracownicyService.updatePracownicy(this.pracownikId, pracownicy);
    }
  }

  logout() {
    if (confirm("Czy na pewno chcesz się wylogować z systemu?")) {
      this.logowanierejestracjaService.logout().subscribe(
        (data) => {
          this.router.navigate(["/"]);
        },
        (error) => console.error(error)
      );
    }
  }

  powrot() {
    let dlTab = this.plikiLocal.length;
    if (dlTab <= 0) {
      this.router.navigate(["/lazy/pracownicy"]);
    }

    // sprawdzam czy są jakieś niezatwierdzone
    let liczbaNiezatwierdzonych = 0;
    this.plikiLocal.forEach((pl) => {
      if (!pl.zatwierdzony) {
        liczbaNiezatwierdzonych++;
      }
    });

    if (liczbaNiezatwierdzonych <= 0) {
      this.router.navigate(["/lazy/pracownicy"]);
    }

    if (liczbaNiezatwierdzonych > 0) {
      this.plikiLocal.forEach((plik) => {
        // kasuję tylko nie zatwierdzone pliki, które były teraz dodane a nie te które już
        // były dodane wcześniej
        if (!plik.zatwierdzony) {
          this.plikiService
            .kasujPlikPracownicy(plik.fileName, plik.katalog)
            .subscribe((res: { usuniety: string }) => {
              dlTab--;
              liczbaNiezatwierdzonych--;
              if (res.usuniety === "ok" && liczbaNiezatwierdzonych <= 0) {
                this.router.navigate(["/lazy/pracownicy"]);
              }
            });
        }
      });
    }
  }

  getDictionary(name: string, index: number) {
    return this.dictionaryService
      .getDictionaryName(name)
      .subscribe((dictionaryData) => {
        this.dictionaries[index] = dictionaryData;
        this.dictionaries[index].liczba = dictionaryData.values.length;
        delete this.dictionaries[index]._id;
        this.dictionaries[index].id = dictionaryData._id;
      });
  }

  deletePlik(element) {
    console.log(element);
    if (confirm("Czy na pewno usunąć plik?")) {
      if (element.zatwierdzony) {
        this.mozliwoscAnulowania = false;
        alert("Pamiętaj aby zapisać pracownicy!");
      }
      this.plikiService
        .kasujPlikPracownicy(element.fileName, element.katalog)
        .subscribe((res: { usuniety: string }) => {
          this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
          this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          if (res.usuniety !== "ok") {
            alert(`Plik został już usunięty wcześniej.`);
          }
        });
    }
  }

  deletePlikObiekt(element) {
    console.log(element);
    if (confirm("Czy na pewno usunąć plik?")) {
      if (element.zatwierdzony) {
        this.mozliwoscAnulowania = false;
        alert("Pamiętaj aby zapisać pracownicy!");
      }
      this.plikiService
        .kasujPlikPracownicy(element.fileName, element.katalog)
        .subscribe((res: { usuniety: string }) => {
          switch (element.dziedzina) {
            case 'Stanowiska': {
              this.nazwaPlikuStanowiska.splice(this.nazwaPlikuStanowiska.indexOf(element), 1);
              break;
            }
            case 'Umowy o pracę': {
              this.nazwaPlikuumowyoPrace.splice(this.nazwaPlikuumowyoPrace.indexOf(element), 1);
              break;
            }
            case 'Przebieg zatrudnienia': {
              this.nazwaPlikuprzebiegZatrudnienia.splice(this.nazwaPlikuprzebiegZatrudnienia.indexOf(element), 1);
              break;
            }
            case 'Dzieci': {
              this.nazwaPlikudzieci.splice(this.nazwaPlikudzieci.indexOf(element), 1);
              break;
            }
            case 'Oświadczenia': {
              this.nazwaPlikuoswiadczenia.splice(this.nazwaPlikuoswiadczenia.indexOf(element), 1);
              break;
            }
            case 'Zezwolenia': {
              this.nazwaPlikuzezwolenia.splice(this.nazwaPlikuzezwolenia.indexOf(element), 1);
              break;
            }
            case 'Karty pobytu': {
              this.nazwaPlikukartyPobytu.splice(this.nazwaPlikukartyPobytu.indexOf(element), 1);
              break;
            }
            case 'Paszporty': {
              this.nazwaPlikupaszporty.splice(this.nazwaPlikupaszporty.indexOf(element), 1);
              break;
            }
            case 'Badania okresowe': {
              this.nazwaPlikubadaniaOkresowe.splice(this.nazwaPlikubadaniaOkresowe.indexOf(element), 1);
              break;
            }
            case 'Szkolenia BHP': {
              this.nazwaPlikuszkoleniaBHP.splice(this.nazwaPlikuszkoleniaBHP.indexOf(element), 1);
              break;
            }
            case 'Dodatkowe kwalifikacje': {
              this.nazwaPlikudodatkoweKwalifikacje.splice(this.nazwaPlikudodatkoweKwalifikacje.indexOf(element), 1);
              break;
            }
            case 'Wyróżnienia i kary': {
              this.nazwaPlikuwyroznieniaKary.splice(this.nazwaPlikuwyroznieniaKary.indexOf(element), 1);
              break;
            }
            default: {
              console.log(element);
              this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
              this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
              break;
            }
          }
          if (res.usuniety !== "ok") {
            alert(`Plik został już usunięty wcześniej.`);
          }
        });
    }
  }

  deletePlikBezConfirm(element) {
    this.plikiService
      .kasujPlikPracownicy(element.fileName, element.katalog)
      .subscribe((res: { usuniety: string }) => {
        this.plikiLocal.splice(this.plikiLocal.indexOf(element), 1);
        this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
        if (res.usuniety !== "ok") {
          alert(`Plik został już usunięty wcześniej.`);
        }
      });
  }

  wyborPliku(plik: string) {
    console.log(plik);
  }

  onFilesPicked(event: any, dziedzina, glownyPlik: boolean) {
    const plikiTmp = (event.target as HTMLInputElement).files;
    if (plikiTmp.length > 0) {
      this.plikiLocalData = event.target.files;
      this.onAddPliki(dziedzina, glownyPlik);
    }
  }

  onAddPliki(dziedzina, glownyPlik) {
    const plikiData = new FormData();
    for (const plik of this.plikiLocalData) {
      plik.newNazwa = plik.name;
      plikiData.append("pliki", plik);
      plikiData.append("katalog", "pracownicy");
    }
    this.plikiService.wysylaniePlikowPracownicy(plikiData).subscribe(
      (res: { status: string; plikiZapisane: any }) => {
        if (res.status === "ok") {
          res.plikiZapisane.forEach((plik) => {
            this.dodajPlikDoObiektu(dziedzina, plik);
            if (glownyPlik) {
              this.plikiLocal.push({
                name: plik.originalname,
                fileName: plik.filename,
                size: plik.size,
                type: plik.mimetype,
                rodzaj: this.aktualnyTypPliku,
                url: plik.path,
                zatwierdzony: false,
                katalog: "pracownicy",
                dziedzina: dziedzina
              });
            }
            this.plikiDataSource = new MatTableDataSource(this.plikiLocal);
          });
        }
      },
      (err) => console.error(err)
    );
  }

  ustawAktualnyTypPliku(typPliku: string) {
    this.aktualnyTypPliku = typPliku;
  }

  dodajPlikDoObiektu(dziedzina, plik) {
    this.ustawAktualnyTypPliku(dziedzina);
    this.plik = ({
      name: plik.originalname,
      fileName: plik.filename,
      size: plik.size,
      type: plik.mimetype,
      rodzaj: this.aktualnyTypPliku,
      url: plik.path,
      zatwierdzony: false,
      katalog: "pracownicy",
      dziedzina: dziedzina
    });
    switch (dziedzina) {
      case 'Stanowiska': {
        this.nazwaPlikuStanowiska.push(this.plik);
        plik = null;
        break;
      }
      case 'Umowy o pracę': {
        this.nazwaPlikuumowyoPrace.push(this.plik);
        plik = null;
        break;
      }
      case 'Przebieg zatrudnienia': {
        this.nazwaPlikuprzebiegZatrudnienia.push(this.plik);
        plik = null;
        break;
      }
      case 'Dzieci': {
        this.nazwaPlikudzieci.push(this.plik);
        plik = null;
        break;
      }
      case 'Oświadczenia': {
        this.nazwaPlikuoswiadczenia.push(this.plik);
        plik = null;
        break;
      }
      case 'Zezwolenia': {
        this.nazwaPlikuzezwolenia.push(this.plik);
        plik = null;
        break;
      }
      case 'Karty pobytu': {
        this.nazwaPlikukartyPobytu.push(this.plik);
        plik = null;
        break;
      }
      case 'Paszporty': {
        this.nazwaPlikupaszporty.push(this.plik);
        plik = null;
        break;
      }
      case 'Badania okresowe': {
        this.nazwaPlikubadaniaOkresowe.push(this.plik);
        plik = null;
        break;
      }
      case 'Szkolenia BHP': {
        this.nazwaPlikuszkoleniaBHP.push(this.plik);
        plik = null;
        break;
      }
      case 'Dodatkowe kwalifikacje': {
        this.nazwaPlikudodatkoweKwalifikacje.push(this.plik);
        plik = null;
        break;
      }
      case 'Wyróżnienia i kary': {
        this.nazwaPlikuwyroznieniaKary.push(this.plik);
        plik = null;
        break;
      }
      default: {
        console.log(this.plik);
        plik = null;
        break;
      }
    }
    this.plik = null;
  }

  zerujP() {
    this.p = 1;
  }

  // rachunki bankowe
  addRachunkiBankowe() {
    if (typeof this.pracownicy.rachunkiBankowe === "undefined") {
      this.pracownicy.rachunkiBankowe = [
        {
          nr: this.rachunkiBankoweGroup.value.rachunkiBankoweNr,
          glowny: this.rachunkiBankoweGroup.value.glowny,
          nazwaBanku: this.rachunkiBankoweGroup.value.rachunkiBankoweNazwaBanku,
        },
      ];
    } else {
      this.pracownicy.rachunkiBankowe.push({
        nr: this.rachunkiBankoweGroup.value.rachunkiBankoweNr,
        glowny: this.rachunkiBankoweGroup.value.glowny,
        nazwaBanku: this.rachunkiBankoweGroup.value.rachunkiBankoweNazwaBanku,
      });
    }
    this.rachunkiBankoweGroup.reset();
    this.rachunkiBankoweDataSource = new MatTableDataSource(
      this.pracownicy.rachunkiBankowe
    );
  }

  editRachunkiBankowe(element) {
    this.rachunkiBankowe = true;
    this.rachunkiBankoweGroup.reset();
    this.rachunkiBankoweGroup.patchValue({
      rachunkiBankoweNr: element.nr,
      rachunkiBankoweNazwaBanku: element.nazwaBanku
    })
    this.rachunkiBankoweGroup.value.glowny = element.glowny
    this.deleteRachunkiBankowe(element, true);
  }

  deleteRachunkiBankowe(element, edycja) {
    this.pracownicy.rachunkiBankowe.splice(
      this.pracownicy.rachunkiBankowe.indexOf(element), 1
    );
    this.rachunkiBankoweDataSource = new MatTableDataSource(
      this.pracownicy.rachunkiBankowe
    );
  }

  rachunkiBankoweDomyslne() {
    this.rachunkiBankoweGroup.value.glowny = !this.rachunkiBankoweGroup.value.glowny;
  }

  // stanowiska
  addStanowiska() {
    if (typeof this.pracownicy.stanowiska === "undefined") {
      this.pracownicy.stanowiska = [
        {
          stanowisko: this.stanowiskaGroup.value.stanowiskaStanowisko,
          od: this.stanowiskaGroup.value.stanowiskaOd,
          do: this.stanowiskaGroup.value.stanowiskaDo,
          uwagi: this.stanowiskaGroup.value.stanowiskaUwagi,
          aktualne: this.stanowiskaGroup.value.aktualne,
          firmaNazwa: this.stanowiskaGroup.value.stanowiskaFirmaNazwa,
          department: this.stanowiskaGroup.value.stanowiskaDepartment,
          dataZatrudnienia: this.stanowiskaGroup.value
            .stanowiskaDataZatrudnienia,
          rodzajUmowy: this.stanowiskaGroup.value.stanowiskaRodzajUmowy,
          dataZwolnienia: this.stanowiskaGroup.value.stanowiskaDataZwolnienia,
          zajmowaneStanowisko: this.stanowiskaGroup.value
            .stanowiskaZajmowaneStanowisko,
          zawodWykonywany: this.stanowiskaGroup.value.stanowiskaZawodWykonywany,
          stanowiskaUwagi: this.stanowiskaGroup.value.stanowiskaStanowiskaUwagi,
          plikiStanowiska: this.nazwaPlikuStanowiska,
        },
      ];
    } else {
      this.pracownicy.stanowiska.push({
        stanowisko: this.stanowiskaGroup.value.stanowiskaStanowisko,
        od: this.stanowiskaGroup.value.stanowiskaOd,
        do: this.stanowiskaGroup.value.stanowiskaDo,
        uwagi: this.stanowiskaGroup.value.stanowiskaUwagi,
        aktualne: this.stanowiskaGroup.value.aktualne,
        firmaNazwa: this.stanowiskaGroup.value.stanowiskaFirmaNazwa,
        department: this.stanowiskaGroup.value.stanowiskaDepartment,
        dataZatrudnienia: this.stanowiskaGroup.value.stanowiskaDataZatrudnienia,
        rodzajUmowy: this.stanowiskaGroup.value.stanowiskaRodzajUmowy,
        dataZwolnienia: this.stanowiskaGroup.value.stanowiskaDataZwolnienia,
        zajmowaneStanowisko: this.stanowiskaGroup.value
          .stanowiskaZajomwaneStanowisko,
        zawodWykonywany: this.stanowiskaGroup.value.stanowiskaZawodWykonywany,
        stanowiskaUwagi: this.stanowiskaGroup.value.stanowiskaStanowiskaUwagi,
        plikiStanowiska: this.nazwaPlikuStanowiska,
      });
    }
    this.stanowiskaGroup.reset();
    this.stanowiskaDataSource = new MatTableDataSource(
      this.pracownicy.stanowiska
    );
    this.nazwaPlikuStanowiska = [];
  }

  editStanowiska(element) {
    this.nazwaPlikuStanowiska = element.plikiStanowiska;
    this.stanowiska = true;
    this.stanowiskaGroup.reset();
    this.stanowiskaGroup.patchValue({
      stanowiskaStanowisko: element.stanowisko,
      stanowiskaOd: element.od,
      stanowiskaDo: element.do,
      stanowiskaUwagi: element.uwagi,
      stanowiskaFirmaNazwa: element.firmaNazwa,
      stanowiskaDepartment: element.department,
      stanowiskaDataZatrudnienia: element.dataZatrudnienia,
      stanowiskaRodzajUmowy: element.rodzajUmowy,
      stanowiskaDataZwolnienia: element.dataZwolnienia,
      stanowiskaZajomwaneStanowisko: element.zajomwaneStanowisko,
      stanowiskaZawodWykonywany: element.zawodWykonywany,
      stanowiskaStanowiskaUwagi: element.stanowiskaUwagi,
    });
    this.stanowiskaGroup.value.aktualne = element.aktualne;
    this.deleteStanowiska(element, true);
  }

  deleteStanowiska(element, edycja) {
    this.pracownicy.stanowiska.splice(
      this.pracownicy.stanowiska.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiStanowiska.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.stanowiskaDataSource = new MatTableDataSource(
      this.pracownicy.stanowiska
    );
  }

  stanowiskaAktualne() {
    this.stanowiskaGroup.value.aktualne = !this.stanowiskaGroup.value.aktualne;
  }

  // umowyoPrace
  addUmowyoPrace() {
    if (typeof this.pracownicy.umowyoPrace === "undefined") {
      this.pracownicy.umowyoPrace = [
        {
          numer: this.umowyoPraceGroup.value.umowyoPracenumer,
          od: this.umowyoPraceGroup.value.umowyoPraceod,
          do: this.umowyoPraceGroup.value.umowyoPracedo,
          typUmowy: this.umowyoPraceGroup.value.umowyoPracetypUmowy,
          dataPodpisu: this.umowyoPraceGroup.value.umowyoPracedataPodpisu,
          firmaNazwa: this.umowyoPraceGroup.value.umowyoPracefirmaNazwa,
          przedstawicielZakladu: this.umowyoPraceGroup.value
            .umowyoPraceprzedstawicielZakladu,
          umowyoPraceuwagi: this.umowyoPraceGroup.value
            .umowyoPraceumowyoPraceuwagi,
          aktualna: this.umowyoPraceGroup.value.aktualna,
          plikiUmowyPraca: this.nazwaPlikuumowyoPrace,
        },
      ];
    } else {
      this.pracownicy.umowyoPrace.push({
        numer: this.umowyoPraceGroup.value.umowyoPracenumer,
        od: this.umowyoPraceGroup.value.umowyoPraceod,
        do: this.umowyoPraceGroup.value.umowyoPracedo,
        typUmowy: this.umowyoPraceGroup.value.umowyoPracetypUmowy,
        dataPodpisu: this.umowyoPraceGroup.value.umowyoPracedataPodpisu,
        firmaNazwa: this.umowyoPraceGroup.value.umowyoPracefirmaNazwa,
        przedstawicielZakladu: this.umowyoPraceGroup.value
          .umowyoPraceprzedstawicielZakladu,
        umowyoPraceuwagi: this.umowyoPraceGroup.value
          .umowyoPraceumowyoPraceuwagi,
        aktualna: this.umowyoPraceGroup.value.aktualna,
        plikiUmowyPraca: this.nazwaPlikuumowyoPrace,
      });
    }
    this.umowyoPraceGroup.reset();
    this.umowyoPraceDataSource = new MatTableDataSource(
      this.pracownicy.umowyoPrace
    );
    this.nazwaPlikuumowyoPrace = [];
  }

  editUmowyoPrace(element) {
    this.nazwaPlikuumowyoPrace = element.plikiUmowyPraca;
    this.umowyoPrace = true;
    this.umowyoPraceGroup.reset();
    this.umowyoPraceGroup.patchValue({
      umowyoPracenumer: element.numer,
      umowyoPraceod: element.od,
      umowyoPracedo: element.do,
      umowyoPracetypUmowy: element.typUmowy,
      umowyoPracedataPodpisu: element.dataPodpisu,
      umowyoPracefirmaNazwa: element.firmaNazwa,
      umowyoPraceprzedstawicielZakladu: element.przedstawicielZakladu,
      umowyoPraceumowyoPraceuwagi: element.umowyoPraceuwagi,
      umowyoPraceaktualna: element.aktualna,
    });
    this.umowyoPraceGroup.value.aktualna = element.aktualna;
    this.deleteUmowyoPrace(element, true);
  }

  deleteUmowyoPrace(element, edycja) {
    this.pracownicy.umowyoPrace.splice(
      this.pracownicy.umowyoPrace.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiUmowyPraca.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.umowyoPraceDataSource = new MatTableDataSource(
      this.pracownicy.umowyoPrace
    );
  }

  umowyoPraceAktualna() {
    this.umowyoPraceGroup.value.aktualna = !this.umowyoPraceGroup.value.aktualna;
  }

  // adresyZamieszkania
  addAdresyZamieszkania() {
    if (typeof this.pracownicy.adresyZamieszkania === "undefined") {
      this.pracownicy.adresyZamieszkania = [
        {
          kraj: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniakraj,
          od: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniaod,
          do: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniado,
          wojewodztwo: this.adresyZamieszkaniaGroup.value
            .adresyZamieszkaniawojewodztwo,
          powiat: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniapowiat,
          gmina: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniagmina,
          miejscowosc: this.adresyZamieszkaniaGroup.value
            .adresyZamieszkaniamiejscowosc,
          ulica: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniaulica,
          numerDomu: this.adresyZamieszkaniaGroup.value
            .adresyZamieszkanianumerDomu,
          numerMieszkania: this.adresyZamieszkaniaGroup.value
            .adresyZamieszkanianumerMieszkania,
          kod: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniakod,
          tel: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniatel,
          aktualny: this.adresyZamieszkaniaGroup.value
            .aktualny,
          adrZamUwagi: this.adresyZamieszkaniaGroup.value
            .adresyZamieszkaniaadrZamUwagi,
        },
      ];
    } else {
      this.pracownicy.adresyZamieszkania.push({
        kraj: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniakraj,
        od: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniaod,
        do: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniado,
        wojewodztwo: this.adresyZamieszkaniaGroup.value
          .adresyZamieszkaniawojewodztwo,
        powiat: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniapowiat,
        gmina: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniagmina,
        miejscowosc: this.adresyZamieszkaniaGroup.value
          .adresyZamieszkaniamiejscowosc,
        ulica: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniaulica,
        numerDomu: this.adresyZamieszkaniaGroup.value
          .adresyZamieszkanianumerDomu,
        numerMieszkania: this.adresyZamieszkaniaGroup.value
          .adresyZamieszkanianumerMieszkania,
        kod: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniakod,
        tel: this.adresyZamieszkaniaGroup.value.adresyZamieszkaniatel,
        aktualny: this.adresyZamieszkaniaGroup.value.aktualny,
        adrZamUwagi: this.adresyZamieszkaniaGroup.value
          .adresyZamieszkaniaadrZamUwagi,
      });
    }
    this.adresyZamieszkaniaGroup.reset();
    this.adresyZamieszkaniaDataSource = new MatTableDataSource(
      this.pracownicy.adresyZamieszkania
    );
  }

  editAdresyZamieszkania(element) {
    this.adresyZamieszkania = true;
    this.adresyZamieszkaniaGroup.reset();
    this.adresyZamieszkaniaGroup.patchValue({
      adresyZamieszkaniakraj: element.kraj,
      adresyZamieszkaniaod: element.od,
      adresyZamieszkaniado: element.do,
      adresyZamieszkaniawojewodztwo: element.wojewodztwo,
      adresyZamieszkaniapowiat: element.powiat,
      adresyZamieszkaniagmina: element.gmina,
      adresyZamieszkaniamiejscowosc: element.miejscowosc,
      adresyZamieszkaniaulica: element.ulica,
      adresyZamieszkanianumerDomu: element.numerDomu,
      adresyZamieszkanianumerMieszkania: element.numerMieszkania,
      adresyZamieszkaniakod: element.kod,
      adresyZamieszkaniatel: element.tel,
      adresyZamieszkaniaaktualny: element.aktualny,
      adresyZamieszkaniaadrZamUwagi: element.adrZamUwagi,
    });
    this.adresyZamieszkaniaGroup.value.aktualny = element.aktualny;
    this.deleteAdresyZamieszkania(element);
  }

  deleteAdresyZamieszkania(element) {
    this.pracownicy.adresyZamieszkania.splice(
      this.pracownicy.adresyZamieszkania.indexOf(element),
      1
    );
    this.adresyZamieszkaniaDataSource = new MatTableDataSource(
      this.pracownicy.adresyZamieszkania
    );
  }

  adresyZamieszkaniaAktualny() {
    this.adresyZamieszkaniaGroup.value.aktualny = !this.adresyZamieszkaniaGroup.value.aktualny;
  }

  // przebiegZatrudnienia
  addPrzebiegZatrudnienia() {
    if (typeof this.pracownicy.przebiegZatrudnienia === "undefined") {
      this.pracownicy.przebiegZatrudnienia = [
        {
          rodzajZmiany: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniarodzajZmiany,
          od: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniaod,
          do: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniado,
          stanowisko: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniastanowisko,
          dzial: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniadzial,
          wymiarZatrudnienia: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniawymiarZatrudnienia,
          wymiarZatrudnieniaUlamek: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniawymiarZatrudnieniaUlamek,
          placaZasadnicza: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniaplacaZasadnicza,
          placZasWaluta: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniaplacZasWaluta,
          dodatekFunkcyjny: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniadodatekFunkcyjny,
          dodFunkcWaluta: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniadodFunkcWaluta,
          dodatek: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniadodatek,
          dodatekWaluta: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniadodatekWaluta,
          podstawaPrawnaZatrudnienia: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniapodstawaPrawnaZatrudnienia,
          rodzajUmowy: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniarodzajUmowy,
          firmaNazwa: this.przebiegZatrudnieniaGroup.value
            .przebiegZatrudnieniafirmaNazwa,
          plikiPrzebZatr: this.nazwaPlikuprzebiegZatrudnienia
        },
      ];
    } else {
      this.pracownicy.przebiegZatrudnienia.push({
        rodzajZmiany: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniarodzajZmiany,
        od: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniaod,
        do: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniado,
        stanowisko: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniastanowisko,
        dzial: this.przebiegZatrudnieniaGroup.value.przebiegZatrudnieniadzial,
        wymiarZatrudnienia: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniawymiarZatrudnienia,
        wymiarZatrudnieniaUlamek: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniawymiarZatrudnieniaUlamek,
        placaZasadnicza: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniaplacaZasadnicza,
        placZasWaluta: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniaplacZasWaluta,
        dodatekFunkcyjny: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniadodatekFunkcyjny,
        dodFunkcWaluta: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniadodFunkcWaluta,
        dodatek: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniadodatek,
        dodatekWaluta: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniadodatekWaluta,
        podstawaPrawnaZatrudnienia: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniapodstawaPrawnaZatrudnienia,
        rodzajUmowy: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniarodzajUmowy,
        firmaNazwa: this.przebiegZatrudnieniaGroup.value
          .przebiegZatrudnieniafirmaNazwa,
        plikiPrzebZatr: this.nazwaPlikuprzebiegZatrudnienia
      });
    }
    this.przebiegZatrudnieniaGroup.reset();
    this.przebiegZatrudnieniaDataSource = new MatTableDataSource(
      this.pracownicy.przebiegZatrudnienia
    );
    this.nazwaPlikuprzebiegZatrudnienia = [];
  }

  editPrzebiegZatrudnienia(element) {
    this.nazwaPlikuprzebiegZatrudnienia = element.plikiPrzebZatr;
    this.przebiegZatrudnienia = true;
    this.przebiegZatrudnieniaGroup.reset();
    this.przebiegZatrudnieniaGroup.patchValue({
      przebiegZatrudnieniarodzajZmiany: element.rodzajZmiany,
      przebiegZatrudnieniaod: element.od,
      przebiegZatrudnieniado: element.do,
      przebiegZatrudnieniastanowisko: element.stanowisko,
      przebiegZatrudnieniadzial: element.dzial,
      przebiegZatrudnieniawymiarZatrudnienia: element.wymiarZatrudnienia,
      przebiegZatrudnieniawymiarZatrudnieniaUlamek: element.wymiarZatrudnieniaUlamek,
      przebiegZatrudnieniaplacaZasadnicza: element.placaZasadnicza,
      przebiegZatrudnieniaplacZasWaluta: element.placZasWaluta,
      przebiegZatrudnieniadodatekFunkcyjny: element.dodatekFunkcyjny,
      przebiegZatrudnieniadodFunkcWaluta: element.dodFunkcWaluta,
      przebiegZatrudnieniadodatek: element.dodatek,
      przebiegZatrudnieniadodatekWaluta: element.dodatekWaluta,
      przebiegZatrudnieniapodstawaPrawnaZatrudnienia: element.podstawaPrawnaZatrudnienia,
      przebiegZatrudnieniarodzajUmowy: element.rodzajUmowy,
      przebiegZatrudnieniafirmaNazwa: element.firmaNazwa,
    });
    this.deletePrzebiegZatrudnienia(element, true);

  }
  deletePrzebiegZatrudnienia(element, edycja) {
    this.pracownicy.przebiegZatrudnienia.splice(
      this.pracownicy.przebiegZatrudnienia.indexOf(element),
      1
    );
    this.przebiegZatrudnieniaDataSource = new MatTableDataSource(
      this.pracownicy.przebiegZatrudnienia
    );
  }

  // dzieci
  addDzieci() {
    if (typeof this.pracownicy.dzieci === "undefined") {
      this.pracownicy.dzieci = [
        {
          imieDziecka: this.dzieciGroup.value.dzieciimieDziecka,
          nazwiskoDziecka: this.dzieciGroup.value.dziecinazwiskoDziecka,
          dataUrodzeniaDziecka: this.dzieciGroup.value
            .dziecidataUrodzeniaDziecka,
          peselDziecka: this.dzieciGroup.value.dziecipeselDziecka,
          zasilekPielegnOd: this.dzieciGroup.value.dziecizasilekPielegnOd,
          zasilekPielegnDo: this.dzieciGroup.value.dziecizasilekPielegnDo,
          zasilekRodzinnyOd: this.dzieciGroup.value.dziecizasilekRodzinnyOd,
          zasilekRodzinnyDo: this.dzieciGroup.value.dziecizasilekRodzinnyDo,
          plikiDzieci: this.nazwaPlikudzieci
        },
      ];
    } else {
      this.pracownicy.dzieci.push({
        imieDziecka: this.dzieciGroup.value.dzieciimieDziecka,
        nazwiskoDziecka: this.dzieciGroup.value.dziecinazwiskoDziecka,
        dataUrodzeniaDziecka: this.dzieciGroup.value.dziecidataUrodzeniaDziecka,
        peselDziecka: this.dzieciGroup.value.dziecipeselDziecka,
        zasilekPielegnOd: this.dzieciGroup.value.dziecizasilekPielegnOd,
        zasilekPielegnDo: this.dzieciGroup.value.dziecizasilekPielegnDo,
        zasilekRodzinnyOd: this.dzieciGroup.value.dziecizasilekRodzinnyOd,
        zasilekRodzinnyDo: this.dzieciGroup.value.dziecizasilekRodzinnyDo,
        plikiDzieci: this.nazwaPlikudzieci
      });
    }
    this.dzieciGroup.reset();
    this.dzieciDataSource = new MatTableDataSource(this.pracownicy.dzieci);
    this.nazwaPlikudzieci = [];
  }

  editDzieci(element) {
    this.nazwaPlikudzieci = element.plikiDzieci;
    this.dzieci = true;
    this.dzieciGroup.reset();
    this.dzieciGroup.patchValue({
      dzieciimieDziecka: element.imieDziecka,
      dziecinazwiskoDziecka: element.nazwiskoDziecka,
      dziecidataUrodzeniaDziecka: element.dataUrodzeniaDziecka,
      dziecipeselDziecka: element.peselDziecka,
      dziecizasilekPielegnOd: element.zasilekPielegnOd,
      dziecizasilekPielegnDo: element.zasilekPielegnDo,
      dziecizasilekRodzinnyOd: element.zasilekRodzinnyOd,
      dziecizasilekRodzinnyDo: element.zasilekRodzinnyDo,
    });
    this.deleteDzieci(element, true);
  }

  deleteDzieci(element, edycja) {
    this.pracownicy.dzieci.splice(this.pracownicy.dzieci.indexOf(element), 1);
    if (!edycja) {
      element.plikiDzieci.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.dzieciDataSource = new MatTableDataSource(this.pracownicy.dzieci);
  }

  // oswiadczenia
  addOswiadczenia() {
    if (typeof this.pracownicy.oswiadczenia === "undefined") {
      this.pracownicy.oswiadczenia = [
        {
          nazwaOswiadczenia: this.oswiadczeniaGroup.value
            .oswiadczenianazwaOswiadczenia,
          typOswiadczenia: this.oswiadczeniaGroup.value
            .oswiadczeniatypOswiadczenia,
          kodZawoduOsw: this.oswiadczeniaGroup.value.oswiadczeniakodZawoduOsw,
          pracodawcaUzytkownikOsw: this.oswiadczeniaGroup.value
            .oswiadczeniapracodawcaUzytkownikOsw,
          plikiOswiadczenia: this.nazwaPlikuoswiadczenia,
          OswOd: this.oswiadczeniaGroup.value.oswiadczeniaoswOd,
          OswDo: this.oswiadczeniaGroup.value.oswiadczeniaoswDo,
        },
      ];
    } else {
      this.pracownicy.oswiadczenia.push({
        nazwaOswiadczenia: this.oswiadczeniaGroup.value
          .oswiadczenianazwaOswiadczenia,
        typOswiadczenia: this.oswiadczeniaGroup.value
          .oswiadczeniatypOswiadczenia,
        kodZawoduOsw: this.oswiadczeniaGroup.value.oswiadczeniakodZawoduOsw,
        pracodawcaUzytkownikOsw: this.oswiadczeniaGroup.value
          .oswiadczeniapracodawcaUzytkownikOsw,
        plikiOswiadczenia: this.nazwaPlikuoswiadczenia,
        OswOd: this.oswiadczeniaGroup.value.oswiadczeniaoswOd,
        OswDo: this.oswiadczeniaGroup.value.oswiadczeniaoswDo,
      });
    }
    this.oswiadczeniaGroup.reset();
    this.oswiadczeniaDataSource = new MatTableDataSource(
      this.pracownicy.oswiadczenia
    );
    this.nazwaPlikuoswiadczenia = [];
  }

  editOswiadczenia(element) {
    this.nazwaPlikuoswiadczenia = element.plikiOswiadczenia;
    this.oswiadczenia = true;
    this.oswiadczeniaGroup.reset();
    this.oswiadczeniaGroup.patchValue({
      oswiadczenianazwaOswiadczenia: element.nazwaOswiadczenia,
      oswiadczeniatypOswiadczenia: element.typOswiadczenia,
      oswiadczeniakodZawoduOsw: element.kodZawoduOsw,
      oswiadczeniapracodawcaUzytkownikOsw: element.pracodawcaUzytkownikOsw,
      oswiadczeniaoswOd: element.OswOd,
      oswiadczeniaoswDo: element.OswDo,
    });
    this.deleteOswiadczenia(element, true);
  }

  deleteOswiadczenia(element, edycja) {
    this.pracownicy.oswiadczenia.splice(
      this.pracownicy.oswiadczenia.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiOswiadczenia.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.oswiadczeniaDataSource = new MatTableDataSource(
      this.pracownicy.oswiadczenia
    );
  }

  // zezwolenia
  addZezwolenia() {
    if (typeof this.pracownicy.zezwolenia === "undefined") {
      this.pracownicy.zezwolenia = [
        {
          nazwaZezwolenia: this.zezwoleniaGroup.value.zezwolenianazwaZezwolenia,
          typZezwolenia: this.zezwoleniaGroup.value.zezwoleniatypZezwolenia,
          kodZawoduZezw: this.zezwoleniaGroup.value.zezwoleniakodZawoduZezw,
          pracodawcaUzytkownikZezw: this.zezwoleniaGroup.value.zezwoleniapracodawcaUzytkownikZezw,
          plikiZezwolenia: this.nazwaPlikuzezwolenia,
          ZezwOd: this.zezwoleniaGroup.value.zezwoleniazezwOd,
          ZezwDo: this.zezwoleniaGroup.value.zezwoleniazezwDo,
        },
      ];
    } else {
      this.pracownicy.zezwolenia.push({
        nazwaZezwolenia: this.zezwoleniaGroup.value.zezwolenianazwaZezwolenia,
        typZezwolenia: this.zezwoleniaGroup.value.zezwoleniatypZezwolenia,
        kodZawoduZezw: this.zezwoleniaGroup.value.zezwoleniakodZawoduZezw,
        pracodawcaUzytkownikZezw: this.zezwoleniaGroup.value.zezwoleniapracodawcaUzytkownikZezw,
        plikiZezwolenia: this.nazwaPlikuzezwolenia,
        ZezwOd: this.zezwoleniaGroup.value.zezwoleniazezwOd,
        ZezwDo: this.zezwoleniaGroup.value.zezwoleniazezwDo,
      });
    }
    this.zezwoleniaGroup.reset();
    this.zezwoleniaDataSource = new MatTableDataSource(
      this.pracownicy.zezwolenia
    );
    this.nazwaPlikuzezwolenia = [];
  }

  editZezwolenia(element) {
    this.nazwaPlikuzezwolenia = element.plikiZezwolenia;
    this.zezwolenia = true;
    this.zezwoleniaGroup.reset();
    this.zezwoleniaGroup.patchValue({
      zezwolenianazwaZezwolenia: element.nazwaZezwolenia,
      zezwoleniatypZezwolenia: element.typZezwolenia,
      zezwoleniakodZawoduZezw: element.kodZawoduZezw,
      zezwoleniapracodawcaUzytkownikZezw: element.pracodawcaUzytkownikZezw,
      zezwoleniazezwOd: element.ZezwOd,
      zezwoleniazezwDo: element.ZezwDo,
    });
    this.deleteZezwolenia(element, true);
  }

  deleteZezwolenia(element, edycja) {
    this.pracownicy.zezwolenia.splice(
      this.pracownicy.zezwolenia.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiZezwolenia.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.zezwoleniaDataSource = new MatTableDataSource(
      this.pracownicy.zezwolenia
    );
  }

  // kartyPobytu
  addKartyPobytu() {
    if (typeof this.pracownicy.kartyPobytu === "undefined") {
      this.pracownicy.kartyPobytu = [
        {
          nazwaKarty: this.kartyPobytuGroup.value.kartyPobytunazwaKarty,
          numerKarty: this.kartyPobytuGroup.value.kartyPobytunumerKarty,
          plikiKP: this.nazwaPlikukartyPobytu,
          kartaOd: this.kartyPobytuGroup.value.kartyPobytukartaOd,
          kartaDo: this.kartyPobytuGroup.value.kartyPobytukartaDo,
        },
      ];
    } else {
      this.pracownicy.kartyPobytu.push({
        nazwaKarty: this.kartyPobytuGroup.value.kartyPobytunazwaKarty,
        numerKarty: this.kartyPobytuGroup.value.kartyPobytunumerKarty,
        plikiKP: this.nazwaPlikukartyPobytu,
        kartaOd: this.kartyPobytuGroup.value.kartyPobytukartaOd,
        kartaDo: this.kartyPobytuGroup.value.kartyPobytukartaDo,
      });
    }
    this.kartyPobytuGroup.reset();
    this.kartyPobytuDataSource = new MatTableDataSource(this.pracownicy.kartyPobytu);
    this.nazwaPlikukartyPobytu = [];
  }

  editKartyPobytu(element) {
    this.nazwaPlikukartyPobytu = element.plikiKP;
    this.kartyPobytu = true;
    this.kartyPobytuGroup.reset();
    this.kartyPobytuGroup.patchValue({
      kartyPobytunazwaKarty: element.nazwaKarty,
      kartyPobytunumerKarty: element.numerKarty,
      kartyPobytukartaOd: element.kartaOd,
      kartyPobytukartaDo: element.kartaDo,
    });
    this.deleteKartyPobytu(element, true);
  }

  deleteKartyPobytu(element, edycja) {
    this.pracownicy.kartyPobytu.splice(
      this.pracownicy.kartyPobytu.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiKP.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.kartyPobytuDataSource = new MatTableDataSource(
      this.pracownicy.kartyPobytu
    );
  }

  // paszporty
  addPaszporty() {
    if (typeof this.pracownicy.paszporty === "undefined") {
      this.pracownicy.paszporty = [
        {
          nrPaszportu: this.paszportyGroup.value.paszportynrPaszportu,
          plikiKP: this.nazwaPlikupaszporty,
          paszportOd: this.paszportyGroup.value.paszportypaszportOd,
          paszportDo: this.paszportyGroup.value.paszportypaszportDo,
        },
      ];
    } else {
      this.pracownicy.paszporty.push({
        nrPaszportu: this.paszportyGroup.value.paszportynrPaszportu,
        plikiKP: this.nazwaPlikupaszporty,
        paszportOd: this.paszportyGroup.value.paszportypaszportOd,
        paszportDo: this.paszportyGroup.value.paszportypaszportDo,
      });
    }
    this.paszportyGroup.reset();
    this.paszportyDataSource = new MatTableDataSource(this.pracownicy.paszporty);
    this.nazwaPlikupaszporty = [];
  }

  editPaszporty(element) {
    this.nazwaPlikupaszporty = element.plikiKP;
    this.paszporty = true;
    this.paszportyGroup.reset();
    this.paszportyGroup.patchValue({
      paszportynrPaszportu: element.nrPaszportu,
      paszportypaszportOd: element.paszportOd,
      paszportypaszportDo: element.paszportDo,
    });
    this.deletePaszporty(element, true);
  }

  deletePaszporty(element, edycja) {
    this.pracownicy.paszporty.splice(
      this.pracownicy.paszporty.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiKP.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.paszportyDataSource = new MatTableDataSource(
      this.pracownicy.paszporty
    );
  }

  // badaniaOkresowe
  addBadaniaOkresowe() {
    if (typeof this.pracownicy.badaniaOkresowe === "undefined") {
      this.pracownicy.badaniaOkresowe = [
        {
          badOkrUwagi: this.badaniaOkresoweGroup.value
            .badaniaOkresowebadOkrUwagi,
          aktualne: this.badaniaOkresoweGroup.value.aktualne,
          plikiBadOkr: this.nazwaPlikubadaniaOkresowe,
          od: this.badaniaOkresoweGroup.value.badaniaOkresoweod,
          do: this.badaniaOkresoweGroup.value.badaniaOkresowedo,
        },
      ];
    } else {
      this.pracownicy.badaniaOkresowe.push({
        badOkrUwagi: this.badaniaOkresoweGroup.value.badaniaOkresowebadOkrUwagi,
        aktualne: this.badaniaOkresoweGroup.value.aktualne,
        plikiBadOkr: this.nazwaPlikubadaniaOkresowe,
        od: this.badaniaOkresoweGroup.value.badaniaOkresoweod,
        do: this.badaniaOkresoweGroup.value.badaniaOkresowedo,
      });
    }
    this.badaniaOkresoweGroup.reset();
    this.badaniaOkresoweDataSource = new MatTableDataSource(
      this.pracownicy.badaniaOkresowe
    );
    this.nazwaPlikubadaniaOkresowe = [];
  }

  editBadaniaOkresowe(element) {
    this.nazwaPlikubadaniaOkresowe = element.plikiBadOkr;
    this.badaniaOkresowe = true;
    this.badaniaOkresoweGroup.reset();
    this.badaniaOkresoweGroup.patchValue({
      badaniaOkresowebadOkrUwagi: element.badOkrUwagi,
      badaniaOkresoweod: element.od,
      badaniaOkresowedo: element.do,
    });
    this.badaniaOkresoweGroup.value.aktualne = element.aktualne
    this.deleteBadaniaOkresowe(element, true);
  }

  deleteBadaniaOkresowe(element, edycja) {
    this.pracownicy.badaniaOkresowe.splice(
      this.pracownicy.badaniaOkresowe.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiBadOkr.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.badaniaOkresoweDataSource = new MatTableDataSource(
      this.pracownicy.badaniaOkresowe
    );
  }

  badaniaOkresoweAktualne() {
    this.badaniaOkresoweGroup.value.aktualne = !this.badaniaOkresoweGroup.value.aktualne;
  }

  // szkoleniaBHP
  addSzkoleniaBHP() {
    if (typeof this.pracownicy.szkoleniaBHP === "undefined") {
      this.pracownicy.szkoleniaBHP = [
        {
          szkoleniaBhpUwagi: this.szkoleniaBHPGroup.value
            .szkoleniaBHPszkoleniaBhpUwagi,
          aktualne: this.szkoleniaBHPGroup.value.aktualne,
          plikiBHP: this.nazwaPlikuszkoleniaBHP,
          od: this.szkoleniaBHPGroup.value.szkoleniaBHPod,
          do: this.szkoleniaBHPGroup.value.szkoleniaBHPdo,
        },
      ];
    } else {
      this.pracownicy.szkoleniaBHP.push({
        szkoleniaBhpUwagi: this.szkoleniaBHPGroup.value
          .szkoleniaBHPszkoleniaBhpUwagi,
        aktualne: this.szkoleniaBHPGroup.value.aktualne,
        plikiBHP: this.nazwaPlikuszkoleniaBHP,
        od: this.szkoleniaBHPGroup.value.szkoleniaBHPod,
        do: this.szkoleniaBHPGroup.value.szkoleniaBHPdo,
      });
    }
    this.szkoleniaBHPGroup.reset();
    this.szkoleniaBHPDataSource = new MatTableDataSource(
      this.pracownicy.szkoleniaBHP
    );
    this.nazwaPlikuszkoleniaBHP = [];
  }

  editSzkoleniaBHP(element) {
    this.nazwaPlikuszkoleniaBHP = element.plikiBHP;
    this.szkoleniaBHP = true;
    this.szkoleniaBHPGroup.reset();
    this.szkoleniaBHPGroup.patchValue({
      szkoleniaBHPszkoleniaBhpUwagi: element.szkoleniaBHPszkoleniaBhpUwagi,
      szkoleniaBHPod: element.szkoleniaBHPod,
      szkoleniaBHPdo: element.szkoleniaBHPdo,
    });
    this.szkoleniaBHPGroup.value.aktualne = element.aktualne;
    this.deleteSzkoleniaBHP(element, true);
  }

  deleteSzkoleniaBHP(element, edycja) {
    this.pracownicy.szkoleniaBHP.splice(
      this.pracownicy.szkoleniaBHP.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiBHP.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.szkoleniaBHPDataSource = new MatTableDataSource(
      this.pracownicy.szkoleniaBHP
    );
  }

  szkoleniaBHPAktualne() {
    this.szkoleniaBHPGroup.value.aktualne = !this.szkoleniaBHPGroup.value.aktualne;
  }

  // dodatkoweKwalifikacje
  addDodatkoweKwalifikacje() {
    if (typeof this.pracownicy.dodatkoweKwalifikacje === "undefined") {
      this.pracownicy.dodatkoweKwalifikacje = [
        {
          dodKwalifUwagi: this.dodatkoweKwalifikacjeGroup.value
            .dodatkoweKwalifikacjedodKwalifUwagi,
          plikiKwalifikacje: this.nazwaPlikudodatkoweKwalifikacje,
          od: this.dodatkoweKwalifikacjeGroup.value.dodatkoweKwalifikacjeod,
          do: this.dodatkoweKwalifikacjeGroup.value.dodatkoweKwalifikacjedo,
        },
      ];
    } else {
      this.pracownicy.dodatkoweKwalifikacje.push({
        dodKwalifUwagi: this.dodatkoweKwalifikacjeGroup.value
          .dodatkoweKwalifikacjedodKwalifUwagi,
        plikiKwalifikacje: this.nazwaPlikudodatkoweKwalifikacje,
        od: this.dodatkoweKwalifikacjeGroup.value.dodatkoweKwalifikacjeod,
        do: this.dodatkoweKwalifikacjeGroup.value.dodatkoweKwalifikacjedo,
      });
    }
    this.dodatkoweKwalifikacjeGroup.reset();
    this.dodatkoweKwalifikacjeDataSource = new MatTableDataSource(
      this.pracownicy.dodatkoweKwalifikacje
    );
    this.nazwaPlikudodatkoweKwalifikacje = [];
  }

  editDodatkoweKwalifikacje(element) {
    this.nazwaPlikudodatkoweKwalifikacje = element.plikiKwalifikacje;
    this.dodatkoweKwalifikacje = true;
    this.dodatkoweKwalifikacjeGroup.reset();
    this.dodatkoweKwalifikacjeGroup.patchValue({
      dodatkoweKwalifikacjedodKwalifUwagi: element.dodKwalifUwagi,
      dodatkoweKwalifikacjeod: element.od,
      dodatkoweKwalifikacjedo: element.do,
    });
    this.deleteDodatkoweKwalifikacje(element, true);
  }

  deleteDodatkoweKwalifikacje(element, edycja) {
    this.pracownicy.dodatkoweKwalifikacje.splice(
      this.pracownicy.dodatkoweKwalifikacje.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiKwalifikacje.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.dodatkoweKwalifikacjeDataSource = new MatTableDataSource(
      this.pracownicy.dodatkoweKwalifikacje
    );
  }

  // wyroznieniaKary
  addWyroznieniaKary() {
    if (typeof this.pracownicy.wyroznieniaKary === "undefined") {
      this.pracownicy.wyroznieniaKary = [
        {
          wyrKarUwagi: this.wyroznieniaKaryGroup.value
            .wyroznieniaKarywyrKarUwagi,
          plikiWyrKar: this.nazwaPlikuwyroznieniaKary,
          od: this.wyroznieniaKaryGroup.value.wyroznieniaKaryod,
          do: this.wyroznieniaKaryGroup.value.wyroznieniaKarydo,
        },
      ];
    } else {
      this.pracownicy.wyroznieniaKary.push({
        wyrKarUwagi: this.wyroznieniaKaryGroup.value.wyroznieniaKarywyrKarUwagi,
        plikiWyrKar: this.nazwaPlikuwyroznieniaKary,
        od: this.wyroznieniaKaryGroup.value.wyroznieniaKaryod,
        do: this.wyroznieniaKaryGroup.value.wyroznieniaKarydo,
      });
    }
    this.wyroznieniaKaryGroup.reset();
    this.wyroznieniaKaryDataSource = new MatTableDataSource(
      this.pracownicy.wyroznieniaKary
    );
    this.nazwaPlikuwyroznieniaKary = [];
  }

  editWyroznieniaKary(element) {
    this.nazwaPlikuwyroznieniaKary = element.plikiWyrKar;
    this.wyroznieniaKary = true;
    this.wyroznieniaKaryGroup.reset();
    this.wyroznieniaKaryGroup.patchValue({
      wyroznieniaKarywyrKarUwagi: element.wyrKarUwagi,
      wyroznieniaKaryod: element.od,
      wyroznieniaKarydo: element.do,
    });
    this.deleteWyroznieniaKary(element, true);
  }

  deleteWyroznieniaKary(element, edycja) {
    this.pracownicy.wyroznieniaKary.splice(
      this.pracownicy.wyroznieniaKary.indexOf(element),
      1
    );
    if (!edycja) {
      element.plikiWyrKar.forEach(plik => {
        this.deletePlikBezConfirm(plik);
      });
    }
    this.wyroznieniaKaryDataSource = new MatTableDataSource(
      this.pracownicy.wyroznieniaKary
    );
  }

}
