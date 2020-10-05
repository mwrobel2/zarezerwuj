export interface KluczeRejestr {
  id?: string;
  _id?: string;
  comments?: string;
  accountManager?: string;
  accountManagerLogin?: string;
  addBy?: { login?: string; name?: string; surname?: string; email?: string };
  modBy?: { login?: string; name?: string; surname?: string; email?: string };
  addDate?: Date;
  modDate?: Date;
  aktywny?: boolean;
  numerKlucza?: string;
  rfidKlucza?: string;
  liczbaWydan?: number;
}
