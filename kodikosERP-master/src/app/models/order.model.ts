export interface Order {
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
  items?: any;
}
