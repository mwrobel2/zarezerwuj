export interface Pracownicy {
  id?: string;
  _id?: string;
  addDate?: Date;
  modDate?: Date;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string, name?: string, surname?: string, email?: string },
  modBy?: { login?: string, name?: string, surname?: string, email?: string },
  login?: string;
  // username i displayName używane do logowanie do active directory
  username?: string;
  name?: string;
  drugieImie?: string;
  surname?: string;
  displayName?: string;
  plec?: string;
  nazwiskoRodowe?: string;
  nazwiskoMatki?: string;
  imieMatki?: string;
  imieOjca?: string;
  dataUrodzenia?: Date;
  miejsceUrodzenia?: string;
  obcokrajowiec?: boolean;
  kartaStalegoPobytu?: string;
  narodowosc?: string;
  obywatelstwo?: string;
  dowodOsobisty?: string;
  dowodWydanyPrzez?: string;
  paszport?: string;
  paszportWydanyPrzez?: string;

  email?: string;
  phone?: string;
  department?: string;

  pesel?: string;
  nip?: string;
  urzadSkarbowy?: string;
  wyksztalcenie?: string;
  zawodWyuczony?: string;

  pliki?: any;

  rachunkiBankowe?: [{ nr: string, glowny: boolean, nazwaBanku?: string }];

  stanowiska?: [{
    stanowisko?: string, od?: Date, do?: Date,
    uwagi?: string, aktualne?: boolean, firmaNazwa?: string, firmaId?: string, department?: string,
    dataZatrudnienia?: Date, rodzajUmowy?: string, dataZwolnienia?: Date, zajmowaneStanowisko?: string,
    zawodWykonywany?: string, stanowiskaUwagi?: string, plikiStanowiska?: any
  }];

  umowyoPrace?: [{
    numer?: string, od?: Date; do?: Date, typUmowy?: string, dataPodpisu?: Date,
    przedstawicielZakladu?: string, umowyoPraceuwagi?: string, firmaNazwa?: string, firmaId?: string,
    aktualna?: boolean, plikiUmowyPraca?: any
  }];

  przebiegZatrudnienia?: [{
    od?: Date, do?: Date, rodzajZmiany?: string, stanowisko?: string, dzial?: string,
    wymiarZatrudnienia: number, wymiarZatrudnieniaUlamek?: string, placaZasadnicza?: number,
    placZasWaluta?: string, dodatekFunkcyjny?: number, dodFunkcWaluta?: string, dodatek?: number,
    dodatekWaluta?: string, firmaNazwa?: string, firmaId?: string, plikiPrzebZatr?: any,
    podstawaPrawnaZatrudnienia?: string, rodzajUmowy?: string
  }];

  adresyZamieszkania?: [{
    kraj?: string, wojewodztwo?: string, powiat?: string, gmina?: string,
    miejscowosc?: string, ulica?: string, numerDomu?: string, numerMieszkania?: string, kod?: string,
    tel?: string, aktualny?: boolean, od?: Date, do: Date, adrZamUwagi?: string
  }];

  dzieci?: [{
    imieDziecka?: string, nazwiskoDziecka?: string, dataUrodzeniaDziecka?: Date,
    peselDziecka?: string, zasilekPielegnOd: Date, zasilekPielegnDo?: Date, zasilekRodzinnyOd?: Date,
    zasilekRodzinnyDo?: Date, plikiDzieci?: any
  }];

  oswiadczenia?: [{
    nazwaOswiadczenia?: string, typOswiadczenia?: string, kodZawoduOsw?: string,
    pracodawcaUzytkownikOsw?: string, plikiOswiadczenia?: any, OswOd?: Date, OswDo?: Date
  }];

  zezwolenia?: [{
    nazwaZezwolenia?: string, typZezwolenia?: string, kodZawoduZezw?: string,
    pracodawcaUzytkownikZezw?: string, plikiZezwolenia?: any, ZezwOd?: Date, ZezwDo?: Date
  }];

  kartyPobytu?: [{ kartaOd?: Date, kartaDo?: Date, nazwaKarty?: string, numerKarty?: string, plikiKP?: any }];

  paszporty?: [{ paszportOd?: Date, paszportDo?: Date, nrPaszportu?: string, plikiKP?: any }];

  badaniaOkresowe?: [{ od?: Date, do?: Date, badOkrUwagi?: string, aktualne?: boolean, plikiBadOkr?: any }];

  szkoleniaBHP?: [{ od?: Date, do?: Date, szkoleniaBhpUwagi?: string, aktualne?: boolean, plikiBHP?: any }];

  dodatkoweKwalifikacje?: [{ od?: Date, do?: Date, dodKwalifUwagi?: string, plikiKwalifikacje?: any }];

  wyroznieniaKary?: [{ od?: Date, do?: Date, wyrKarUwagi?: string, plikiWyrKar?: any }];

  uwagi?: string;
  aktualniePracujacy?: boolean;
  status?: string;

  nrKartyWejsciowej?: string;
  nrKartyParkingowej?: string;
  klucze?: [string];
  katalog?: string;
}
