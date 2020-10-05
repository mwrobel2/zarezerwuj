import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LogowanierejestracjaService } from 'src/app/services/logowanierejestracja.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Contractorform } from '../../models/formatki/contractorform.model';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSub: Subscription;
  public loggedInUserSub: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null,
    phone: null,
    status: null
  };

  contractorFields: Contractorform = {
    balance: true,
    comments: true,
    creditLimit: true,
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

  constructor(
    public authService: AuthService,
    public formsService: FormsService,
    public logowanierejestracjaService: LogowanierejestracjaService
  ) { }

  ngOnInit() {
    // I'm checking if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();
    // I'm setting up an subscription to authStatusListener
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // console.log('authenticated www', isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });

    // Checking user name and surname
    this.loggedInUserSub = this.authService
      .getLoggedInUserListener()
      .subscribe(loggedUser => {
        this.loggedInUser = loggedUser;
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');
  }

  onSignup(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.formsService.getForm('contractors')
      .subscribe(RetContractor => {
        this.contractorFields = RetContractor.document.selectedFields;
        // this.authService.createUser(form.value.login, form.value.password,
        //   form.value.email, form.value.department, form.value.name, form.value.surname, this.contractorFields);
        this.logowanierejestracjaService.createUser(form.value.login, form.value.password,
          form.value.email, form.value.department,
          form.value.name, form.value.surname, this.contractorFields, form.value.phone, form.value.status);
      });
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      console.log('wylogowany');
    }
  }

}
