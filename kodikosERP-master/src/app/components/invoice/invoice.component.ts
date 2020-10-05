import { Component, OnInit, OnDestroy } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  private invoicesSub: Subscription;
  private authListenerSub: Subscription;
  userIsAuthenticated = false;
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
  totalInvoices = 10;
  invoicesPerPage = 5;
  pageSizeOptions = [2, 5, 10, 50, 100];

  constructor(
    public invoiceService: InvoiceService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    // I'm checking if user is authenticated
    this.userIsAuthenticated = this.authService.getIsAuth();
    // I'm setting up an subscription to authStatusListener
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        // console.log('authenticated www', isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });


    // Checking user name and surname
    this.loggedInUserSub = this.authService.getLoggedInUserListener()
      .subscribe((loggedUser) => {
        this.loggedInUser = loggedUser;
        console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');


    this.invoiceService.getInvoices();
    this.invoicesSub = this.invoiceService.getInvoicesUpdatedListener()
      .subscribe((invoices: Invoice[]) => {
        // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKICH KONTRAKTORÓW W TEN SPOSÓB ....
        // console.log('invoices get', invoices);
        this.invoices = invoices;
      });
  }

  powrot() {
    window.history.go(-1);
  }

  onDelete(invoiceId: string) {
    this.invoiceService.deleteInvoice(invoiceId);
  }

  ngOnDestroy(): void {
    this.invoicesSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  logout() {
    if (confirm('Czy na pewno chcesz się wylogować z systemu?')) {
      console.log('wylogowany');
    }
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

}
