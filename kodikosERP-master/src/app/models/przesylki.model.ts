export interface Przesylki {
  id?: string;
  _id?: string;
  nrZapotrzebowania?: string;
  doKogo?: [string];
  doKogoEmails?: [string];
  // nazwa firmy do której skierowana jest przesyłka
  fullName?: string;
  terminDostawy?: Date;
  rodzajPlatnosci?: string;
  kwota?: number;
  comments?: string;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string, name?: string, surname?: string, email?: string };
  modBy?: { login?: string, name?: string, surname?: string, email?: string };
  addDate?: Date;
  modDate?: Date;
  status?: string;
  firms?: [string];
  projects?: [string];
  pliki?: any;
}
