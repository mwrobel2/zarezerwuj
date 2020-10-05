export interface ContractorForm {
  id?: string;
  _id?: string;
  name?: string;
  selectedFields?: {
    paymentDeadline?: boolean,
    creditLimit?: boolean,
    comments?: boolean,
    status?: boolean,
    balance?: boolean,
    buttonDodajKontr?: boolean,
    buttonOfertaKontr?: boolean,
    buttonEdytujKontr?: boolean,
    buttonUsunKontr?: boolean,
    widziWszystkie?: boolean,
    adres?: boolean,
    kontakyt?: boolean,
    firmy?: boolean,
    projekty?: boolean,
    kontBankowe?: boolean,
    pliki?: boolean,
    buttonPliki?: boolean
  };
}
