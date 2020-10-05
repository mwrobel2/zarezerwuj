import { Component, OnInit } from '@angular/core';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dictionary-create',
  templateUrl: './dictionary-create.component.html',
  styleUrls: ['./dictionary-create.component.scss']
})
export class DictionaryCreateComponent implements OnInit {
  private mode = 'create';
  private dictionaryId: string;
  dictionary: Dictionary = {
    // name: null
  };
  valuesTemp: string[] = [];

  // public loggedInUserSub: Subscription;
  public zalogowanyUser: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    moduly: null,
    contractorFields: null
  };
  // private authListenerSub: Subscription;
  userIsAuthenticated = false;

  constructor(
    public dictionaryService: DictionaryService,
    public route: ActivatedRoute,
    private logowanierejestracjaService: LogowanierejestracjaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.zalogowanyUser = this.logowanierejestracjaService.getUser().subscribe(
      user => {
        this.loggedInUser = user;
        if (typeof this.loggedInUser !== 'undefined' && this.loggedInUser.moduly !== null
          && typeof this.loggedInUser.moduly !== 'undefined') {
          this.userIsAuthenticated = true;
        }
      },
      error => {
        this.router.navigate(['/login']);
      });


    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('dictId')) {
        // it means that we are in edit mode
        this.mode = 'edit';
        this.dictionaryId = paramMap.get('dictId');
        // I'm getting data about dictionary
        this.dictionaryService
          .getDictionary(this.dictionaryId)
          .subscribe(dictionaryData => {
            // console.log('dict:', dictionaryData);
            this.dictionary = dictionaryData;
            delete this.dictionary._id;
            this.dictionary.id = dictionaryData._id;
            this.valuesTemp = this.dictionary.values;
          });
      } else {
        this.mode = 'create';
        this.dictionaryId = null;
      }
    });
  }

  onSaveSlownik(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const dictionary: Dictionary = {
      // name: form.value.nazwa,
      values: this.valuesTemp,
      description: form.value.opis
    };
    // console.log('dict: ', dictionary);
    if (this.mode === 'create') {
      this.dictionaryService.addDictionary(dictionary);
    } else {
      this.dictionaryService.updateDictionary(this.dictionaryId, dictionary);
    }
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  powrot() {
    window.history.go(-1);
  }

  dodajWartosc() {
    let newItem = prompt('Podaj wartość');
    this.valuesTemp.push(newItem);
  }

  usunWartosc(i) {
    this.valuesTemp.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.zalogowanyUser.unsubscribe();
  }
}
