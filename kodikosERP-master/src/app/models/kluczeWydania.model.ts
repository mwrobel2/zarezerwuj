export interface KluczeWydania {
  id?: string;
  _id?: string;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  addDate?: Date;
  modDate?: Date;
  // ------------
  numerKlucza?: string;
  rfidKlucza?: string;
  rfidKarty?: string;
  imie?: string;
  nazwisko?: string;
  dzial?: string;
  dataWydania?: Date;
  dataZwrotu?: Date;
  operacja?: string;
  wpisAutomatyczny?: boolean;
}
