import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { NgForm } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss']
})
export class InvoiceAddComponent implements OnInit {
  private mode = 'create';
  private invoiceId: string;

  invoice: Invoice = {
    company: '',
    nip: '',
    companyStreet: '',
    companyPostCode: '',
    companyCity: '',
    issuerLogin: '',
    issueDate: null,
    sellDate: null,
    issueCity: '',
    paymentType: '',
    factoring: '',
    currency: '',
    currencyDate: null,
    currencyRate: null,
    tableNBP: '',
    dueDate: null,
    paid: null,
    // prowizja
    commission: null,
    paidCommision: null,
    // towary
    commodities: null
  };

  dictionaries: Dictionary[] = [
    {
      name: null
    }
  ];

  public loggedInUserSub: Subscription;
  public loggedInUser: User = {
    id: null,
    _id: null,
    login: null,
    email: null,
    department: null,
    name: null,
    surname: null
  };
  private authListenerSub: Subscription;
  userIsAuthenticated = false;


  constructor(
    private invoiceService: InvoiceService,
    private dictionaryService: DictionaryService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('invoiceId')) {
        // it means that we are in edit mode
        this.mode = 'edit';
        this.invoiceId = paramMap.get('invoiceId');
        // I'm getting data about assortment
        this.invoiceService
          .getInvoiceId(this.invoiceId)
          .subscribe(invoiceData => {
            this.invoice = invoiceData;
            delete this.invoice._id;
            this.invoice.id = invoiceData._id;
          });
      } else {
        this.mode = 'create';
        this.invoiceId = null;
      }
    });


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
        console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      console.log('wylogowany');
    }
  }

  powrot() {
    window.history.go(-1);
  }

  onSaveInvoice(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const invoice: Invoice = {
      company: form.value.company,
      nip: form.value.nip,
      companyStreet: form.value.companyStreet,
      companyPostCode: form.value.companyPostCode,
      companyCity: form.value.companyCity,
      issuerLogin: form.value.issuerLogin,
      issueDate: form.value.issueDate,
      sellDate: form.value.sellDate,
      issueCity: form.value.issueCity,
      paymentType: form.value.paymentType,
      factoring: form.value.factoring,
      currency: form.value.currency,
      currencyDate: form.value.currencyDate,
      currencyRate: form.value.currencyRate,
      tableNBP: form.value.tableNBP,
      dueDate: form.value.dueDate,
      paid: form.value.paid,
      // prowizja
      commission: form.value.commission,
      paidCommision: form.value.paidCommision,
      // towary
      commodities: form.value.commodities
    };
    if (this.mode === 'create') {
      // console.log('Zapisano');
      this.invoiceService.addInvoice(invoice);
    } else {
      this.invoiceService.updateInvoice(this.invoiceId, invoice);
    }
  }
}

