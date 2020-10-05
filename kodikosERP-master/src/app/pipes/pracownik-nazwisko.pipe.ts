import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pracownikNazwisko'
})
export class PracownikNazwiskoPipe implements PipeTransform {

  transform(pracownicy: any, nazwiskoTerm: any): any {
    if (nazwiskoTerm === undefined) { return pracownicy; }
    return pracownicy.filter(pracownik => {
      let wynik: boolean;
      if ((pracownik.surname).toLowerCase().includes(nazwiskoTerm.toLowerCase())) {
        wynik = true;
      } else {
        wynik = false;
      }
      return wynik;
    });
  }

}
