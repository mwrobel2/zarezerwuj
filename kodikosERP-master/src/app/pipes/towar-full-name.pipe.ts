import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'towarFullName'
})
export class TowarFullNamePipe implements PipeTransform {

  transform(towarFullName: any, term: any): any {
    if (term === undefined) { return towarFullName; }
    return towarFullName.filter(towar => {
      let wynik: boolean;
      if ((towar.fullName).toLowerCase().includes(term.toLowerCase())) {
        wynik = true;
      } else {
        wynik = false;
      }
      return wynik;
    });
  }
}

