export interface Project {
  id?: string;
  _id?: string;
  nazwa?: string;
  opis?: string;
  kod?: string;
  kodERP?: string;
  faza?: string;
  mechFinansowania?: string;
  kategoria?: string;
  kierownik?: string;
  zastepcaKier?: string;
  zespol?: [{login?: string; name?: string; surname?: string; email?: string; department?: string}];
  dataRozpoczecia?: Date;
  dataZakonczenia?: Date;
  saldo?: number;
  planowanyPrzychod?: number;
  creator?: string;
  comments?: string;
  addDate?: Date;
  modDate?: Date;
  addBy?: {login?: string; name?: string; surname?: string; email?: string};
  modBy?: {login?: string; name?: string; surname?: string; email?: string};
}
