export interface Contractor {
  // type of the client: klient (client), dostawca (supplier)
  id?: string;
  _id?: string;
  // type?: string;
  // employee who takes care of that client
  accountManager?: string;
  accountManagerLogin?: string;
  shortName?: string;
  fullName?: string;
  nip?: string;
  country?: string;
  city?: string;
  street?: string;
  nrDomu?: string;
  nrMieszkania?: string;
  postcode?: string;
  // payment deadline in days
  paymentDeadline?: number;
  ceo?: string;
  regon?: string;
  krs?: string;
  status?: string;
  creditLimit?: number;
  creditLimitCurrency?: string;
  comments?: string;
  // Faktury przeterminowane – kwota i ile dni
  // i  tzw wolny limit kredytowy
  // Np. firma ma u nas 300 tyś limitu a faktur ma na 250 tyś więc może kupić za 50 tyś
  addDate?: Date;
  modDate?: Date;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  balance?: number;
  contrType?: string;
  // shipping - adres dostawy
  countryShipping?: string;
  cityShipping?: string;
  streetShipping?: string;
  postcodeShipping?: string;
  nrDomuShipping?: string;
  nrMieszkaniaShipping?: string;
  widziCeneEuro?: boolean;
  anotherContact?: { id?: number; acName?: string; acSurname?: string; acEmail?: string; acPhone?: string; acComment?: string; };
  anotherContacts?: [
    {
      id?: number;
      acName?: string;
      acSurname?: string;
      acEmail?: string;
      acPhone?: string;
      acComment?: string;
    }
  ];
  // typy upustu: towar, grupa, calosc
  upusty?: [{
    typUpustu?: string, nazwaTowaruGrupy?: string, upustProcent?: number,
    upustWartosc?: number, komentarz?: string, waluta?: string
  }];
  pesel?: string;
  // wyświetlanie z kolorem
  winnyKase?: boolean;
  // słownik - do zrobienia
  formaPlatnosci?: [string];
  bankAccount?: { id?: number, dkNazwa?: string, dkNrKonta?: string, dkDomyslne: boolean, swift?: string, iban?: string };
  bankAccounts?: [{ id?: number, dkNazwa?: string, dkNrKonta?: string, dkDomyslne: boolean, swift?: string, iban?: string }];
  project?: string;
  projects?: [string];
  firma?: string;
  firms?: [string];
  // pliki?: [{name?: string, lastModified?: number, size?: number, type?: string, rodzaj?: string, url?: string}];
  pliki?: any;
}
