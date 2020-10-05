export interface SekrPrzekazaneDo {
    id?: string;
    _id?: string;
    idDokumentu?: string,
    imie?: string,
    nazwisko?: string,
    login?: string,
    email?: string,
    status?: string,
    dataPrzekazania?: Date,
    dataOdebrania?: Date,
    komentarz?: string
}