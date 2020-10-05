export interface Sekretariat {
    id?: string;
    _id?: string;
    idDokumentu?: string;
    // tytuł
    fullName?: string,
    // kommentarz do dokumentu
    comments?: string,
    accountManager?: string,
    accountManagerLogin?: string,
    addBy?: { login?: string, name?: string, surname?: string, email?: string },
    modBy?: { login?: string, name?: string, surname?: string, email?: string },
    addDate?: Date,
    modDate?: Date,
    // status zależy od tego czy zatwierdzony przez wszystkich
    status?: string,
    firms?: [string],
    projects?: [string],
    //typ dokumentu
    brand?: string,
    pliki?: any,
    // barcode?: string,



    rodzajTowaru?: string,
    component?: string,
    name?: string,
    measurment?: string,
    norm?: string,
    gatunek?: string,
    atest?: string,
    odbior?: string
  }
  