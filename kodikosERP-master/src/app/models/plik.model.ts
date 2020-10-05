export interface Plik {
    id?: string;
    _id?: string;
    fileName?: string;
    name?: string;
    rodzaj?: string;
    size?: number;
    type?: string;
    url?: string;
    zatwierdzony?: boolean;
    // plik został dodany z już istniejącego pliku w bazie
    zInnego?: boolean;
    katalog?: string;
  }