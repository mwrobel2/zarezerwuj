export interface Szkodliwa {
  id?: string;
  _id?: string;
  fullName?: string;
  cas?: string;
  ilosc?: number;
  jednostka?: string;
  miejscePrzech?: string;
  osobaOdpow?: string;
  zaklad?: string;
  rodzajeZagrozen?: [{
    id?: number, zagrozenie?: string, piktogram?: string,
    osobyPracujace?: [{
      id?: number, imie?: string, nazwisko?: string, login?: string,
      email?: string, stanowisko?: string, czasZmiana?: number, czasRok?: number
    }]
  }];
  producent?: string;
  rok?: number;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  addDate?: Date;
  modDate?: Date;
  project?: string;
  projects?: [string];
  firma?: string;
  firms?: [string];
  pliki?: any;
  comments?: string;
  status?: string;
  piktogramy?: [];
  czasNarazeniaZmiana?: number;
  czasNarazeniaRok?: number;
  szkodType?: string;
  accountManager?: string;
  accountManagerLogin?: string;



  shortName?: string;
  nip?: string;
  country?: string;
  city?: string;
  street?: string;
  postcode?: string;
  paymentDeadline?: number;
  ceo?: string;
  regon?: string;
  krs?: string;
  creditLimit?: number;
  creditLimitCurrency?: string;
  balance?: number;
  contrType?: string;
  countryShipping?: string;
  cityShipping?: string;
  streetShipping?: string;
  postcodeShipping?: string;
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
  bankAccount?: { id?: number, dkNazwa?: string, dkNrKonta?: string, dkDomyslne: boolean };
  bankAccounts?: [{ id?: number, dkNazwa?: string, dkNrKonta?: string, dkDomyslne: boolean }];
}
