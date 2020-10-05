export interface Assortment {
  id?: string;
  _id?: string;
  // nazwa towaru
  fullName?: string;
  towarOpis?: string;
  comments?: string;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  addDate?: Date;
  modDate?: Date;
  status?: string;
  firms?: [string];
  projects?: [string];
  rodzajTowaru?: string;
  pliki?: any;

  // komponent
  component?: string;
  // nazwa
  name?: string;
  // gatunek (słownik)
  brand?: string;
  // wymiar (słownik)
  measurment?: string;
  // norma
  norm?: string;
  gatunek?: string;
  atest?: string;
  odbior?: string;
}
