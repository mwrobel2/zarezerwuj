import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractors'
})
export class ContractorsPipe implements PipeTransform {

  transform(contractors: any, term: any): any {
    if (term === undefined) { return contractors; }
    return contractors.filter(contractor => {
      let wynik: boolean;
      if ((contractor.shortName).toLowerCase().includes(term.toLowerCase())) {
        wynik = true;
      } else {
        wynik = false;
      }
      return wynik;
    });
  }
}
