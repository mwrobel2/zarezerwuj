import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LogowanierejestracjaService } from 'src/app/services/logowanierejestracja.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  logowanieDomenowe = false;

  constructor(
    public authService: AuthService,
    public logowanierejestracjaService: LogowanierejestracjaService
    ) { }

  ngOnInit() {
  }

  // stara wersja nie używania i nie używać
  // używać onLoginPassport
  onLogin(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.login, form.value.password);
  }

  onLoginPassport(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.logowanierejestracjaService.loginUser(form.value.login, form.value.password, form.value.logowanieDomenowe);
  }

}
