import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-strstartowa',
  templateUrl: './strstartowa.component.html',
  styleUrls: ['./strstartowa.component.scss']
})
export class StrstartowaComponent implements OnInit {
  logoLink = environment.logoImage;
  database = environment.database;

  napisyPL = {
    zaloguj: 'Zaloguj się do systemu'
  }

  napisyENG = {
    zaloguj: 'Sign In'
  }

  napisy = this.napisyPL;

  constructor() {}

  ngOnInit() {
    //POBIERAM WERSJE JĘZYKOWĄ
    switch(localStorage.getItem('kodiJezyk')) {
      case null:
        this.napisy = this.napisyPL;
        break;
      case 'PL':
        this.napisy = this.napisyPL;
        break;
      case 'ENG':
        this.napisy = this.napisyENG;
        break;
      default:
        this.napisy = this.napisyPL;
    }
  }

  zapiszJezyk(jezyk: string) {
    switch (jezyk) {
      case 'PL':
        this.napisy = this.napisyPL;
        localStorage.setItem('kodiJezyk', 'PL');
        break;
      case 'ENG':
        this.napisy = this.napisyENG;
        localStorage.setItem('kodiJezyk', 'ENG');
        break;
      default:
        this.napisy = this.napisyPL;
        localStorage.setItem('kodiJezyk', 'PL');
    }
  }
}
