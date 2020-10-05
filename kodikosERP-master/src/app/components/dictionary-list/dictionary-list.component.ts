import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { LogowanierejestracjaService } from '../../services/logowanierejestracja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.scss']
})
export class DictionaryListComponent implements OnInit {
  dictionaries: Dictionary[] = [];
  private dictionariesSub: Subscription;
  userIsAuthenticated = false;
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
  totalDictionaries = 10;
  dictionariesPerPage = 5;
  pageSizeOptions = [2, 5, 10, 50, 100];

  constructor(
    public dictionariesService: DictionaryService,
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


    this.dictionariesService.getDictionaries();
    this.dictionariesSub = this.dictionariesService
      .getDictionariesUpdatedListener()
      .subscribe((dictionaries: Dictionary[]) => {
        // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
        // console.log('dictionaries get', dictionaries);
        this.dictionaries = dictionaries;
      });
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(dictionaryId: string) {
    this.dictionariesService.deleteDictionary(dictionaryId);
  }

  ngOnDestroy(): void {
    this.dictionariesSub.unsubscribe();
    this.zalogowanyUser.unsubscribe();
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }
}
