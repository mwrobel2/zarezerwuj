export interface Klucze {
    id?: string;
    _id?: string;
    // nazwa klucza (może być zestaw kluczy)
    fullName?: string;
    numerKlucza?: string;
    rfidKlucza?: string;
    login?: string;
    imie?: string;
    nazwisko?: string;
    // dni tygodnia w których dana osoba może pobierać klucze
    dniTygodnia?: [{dzien?: string, odGodziny?: string, doGodziny?: string}];
    // konkretne daty w których osoba może pobrać klucz
    konkretneDaty?: [{data?: Date, odGodziny?: string, doGodziny?: string}];
    zaklad?: string;
    comments?: string;
    accountManager?: string;
    accountManagerLogin?: string;
    addBy?: { login?: string; name?: string; surname?: string; email?: string };
    modBy?: { login?: string; name?: string; surname?: string; email?: string };
    addDate?: Date;
    modDate?: Date;
    status?: string;
    aktywny?: boolean;
    godzinaOd?: string;
    godzinaDo?: string;
    nrKarty?: string;
  }
