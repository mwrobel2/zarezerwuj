export interface Warehouse {
  id?: string;
  _id?: string;
  // Kod - indeks
  itemNumber?: string;
  // Nazwa towaru
  fullName?: string;
  // szczegóły towaru
  towarOpis?: string;
  // Rodzaj towaru, np rury, puchary, subst.szkodliwe
  rodzajTowaru?: string;
  // Definicja stawki
  vat?: number;
  jednostka?: string;
  // ile jest towaru
  liczba?: number;
  cenaZakupuNetto?: number;
  cenaHurtowaSprzedazyNetto?: number;
  cenaDetalicznaBrutto?: number;
  // wyliczana automatycznie:
  cenaDetalicznaWaluta?: string;
  cenaExportEuro?: number;
  // Dostawca - kod
  supplier?: string;
  comments?: string;
  // zostawiam do przyszłych potrzeb
  idAsortymentu?: string;
  warehouseLocation?: string;
  regal?: string;
  polka?: string;
  karton?: string;
  barcode?: string;
  widocznyWSklepie?: boolean;
  wysokosc?: number;
  dlugosc?: number;
  szerokosc?: number;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  addDate?: Date;
  modDate?: Date;
  status?: string;
  firms?: [string];
  projects?: [string];
  pliki?: any;
  cenaZakupuBrutto?: number;
  cenaHurtowaSprzedazyBrutto?: number;
  cenaDetalicznaNetto?: number;
  kodIndexDostawcy?: string;
  gatunek?: string;
  atest?: string;
  odbior?: string;
}
