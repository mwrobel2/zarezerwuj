import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../../services/auth.service';
import { FormsService } from '../../../services/forms.service';
import { Contractorform } from '../../../models/formatki/contractorform.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { LogowanierejestracjaService } from '../../../services/logowanierejestracja.service';

@Component({
  selector: 'app-kontrahenci',
  templateUrl: './kontrahenci.component.html',
  styleUrls: ['./kontrahenci.component.scss']
})
export class KontrahenciComponent implements OnInit {
  userIsAuthenticated = false;
  // private authListenerSub: Subscription;
  // I declare displayed fields
  iddokumentu: string;
  dispFields: Contractorform = {
    balance: true,
    comments: true,
    paymentDeadline: true,
    status: true,
    buttonDodajKontr: true,
    buttonOfertaKontr: true,
    buttonEdytujKontr: true,
    buttonUsunKontr: true,
    widziWszystkie: true,
    adres: true,
    kontakty: true,
    firmy: true,
    projekty: true,
    kontBankowe: true,
    pliki: true,
    buttonPliki: true
  };

  // public loggedInUserSub: Subscription;
  // public loggedInUser: User = {
  //   id: null,
  //   _id: null,
  //   login: null,
  //   email: null,
  //   department: null,
  //   name: null,
  //   surname: null
  // };
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


  constructor(
    // private authService: AuthService,
    private logowanierejestracjaService: LogowanierejestracjaService,
    private formsService: FormsService,
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
    // // I'm checking if user is authenticated
    // this.userIsAuthenticated = this.authService.getIsAuth();
    // // I'm setting up an subscription to authStatusListener
    // this.authListenerSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(isAuthenticated => {
    //     // console.log('authenticated www', isAuthenticated);
    //     this.userIsAuthenticated = isAuthenticated;
    //   });

    // this.loggedInUserSub = this.authService.getLoggedInUserListener()
    //   .subscribe((loggedUser) => {
    //     this.loggedInUser = loggedUser;
    //   });
    // this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    // this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');


    this.formsService.getForm('contractors')
      .subscribe(RetContractor => {
        this.dispFields = RetContractor.document.selectedFields;
        this.iddokumentu = RetContractor.document._id;
      });

  }

  onSaveKontrahentForm(form: NgForm) {

    const aktFields: Contractorform = {
      balance: form.value.balance,
      comments: form.value.comments,
      creditLimit: form.value.creditLimit,
      paymentDeadline: form.value.paymentDeadline,
      status: true,
      buttonDodajKontr: form.value.buttonDodajKontr,
      buttonEdytujKontr: form.value.buttonEdytujKontr,
      buttonOfertaKontr: form.value.buttonOfertaKontr,
      buttonUsunKontr: form.value.buttonUsunKontr,
      widziWszystkie: form.value.widziWszystkie,
      adres: form.value.adres,
      kontakty: form.value.kontakty,
      firmy: form.value.firmy,
      projekty: form.value.projekty,
      kontBankowe: form.value.kontBankowe,
      pliki: form.value.pliki,
      buttonPliki: form.value.buttonPliki
    };
    this.formsService.saveForm(aktFields, this.iddokumentu);
  }

  powrot() {
    window.history.go(-1);
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      this.logowanierejestracjaService.logout().subscribe(
        data => { this.router.navigate(['/']); },
        error => console.error(error)
      );
    }
  }

}
