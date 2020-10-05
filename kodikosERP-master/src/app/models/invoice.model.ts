export interface Invoice {
  id?: string;
  _id?: string;
  company?: string,
  nip?: string,
  companyStreet?: string,
  companyPostCode?: string,
  companyCity?: string,
  issuerLogin?: string,
  issueDate?: Date,
  sellDate?: Date,
  issueCity?: string,
  paymentType?: string,
  factoring?: string,
  currency?: string,
  currencyDate?: Date,
  currencyRate?: number,
  tableNBP?: string,
  dueDate?: Date,
  paid?: number,
  // prowizja
  commission?: number,
  paidCommision?: number,
  // towary
  commodities?: any
}
