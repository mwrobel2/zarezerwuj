export interface Offer {
  id?: string;
  _id?: string;
  data?: Date;
  creator?: string;
  termsOfPayment?: string;
  deliveryType?: string;
  labelling?: string;
  packing?: string;
  // atest
  certificate?: string;
  // wykonanie
  realization?: string;
  // tolerancja wykonania
  engeneeringTolerance?: string;
  // pochodzenie towaru
  origin?: string;
  // uwagi
  comments?: string;
  contractor?: { shortName: string, fullName: string, nip: string };
  addDate?: Date;
  modDate?: Date;
  currency?: string;
  project?: string;
  company?: string;
  addBy?: { login?: string, name?: string, surname?: string, email?: string };
  modBy?: { login?: string, name?: string, surname?: string, email?: string };
  item?: {id?: number, name?: string, priceNetSell?: number, vat?: number, priceGrossSell?: number};
  items?: [{id?: number, name?: string, priceNetSell?: number, vat?: number, priceGrossSell?: number}];
}
