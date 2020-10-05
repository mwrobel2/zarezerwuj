import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private ordersSub: Subscription;
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
  totalOrders = 10;
  ordersPerPage = 5;
  pageSizeOptions = [2, 5, 10, 50, 100];
  dataSource: any;
  displayedColumns: string[];

  constructor(
    public orderService: OrderService,
    private authService: AuthService
  ) {}

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
        // console.log(this.loggedInUser);
      });
    this.loggedInUser.name = sessionStorage.getItem('KODuserName');
    this.loggedInUser.surname = sessionStorage.getItem('KODuserSurname');

    this.orderService.getOrders();

    this.displayedColumns = [
      'data',
      'creator',
      'termsOfPayment',
      'deliveryType',
      'labelling',
      'packing',
      'certificate',
      // 'realization',
      'engeneeringTolerance',
      'origin',
      'comments',
      'action'
    ];

    this.ordersSub = this.orderService
      .getOrdersUpdatedListener()
      .subscribe((orders: Order[]) => {
        // DO ZASTANOWIENIA CZY PRZEKAZYWAĆ WSZYSTKIE OFERTY W TEN SPOSÓB ....
        // console.log('contractors get', contractors);
        this.orders = orders;
        // console.log(this.assortments);
        this.dataSource = orders;
      });
  }

  ngOnDestroy(): void {
    this.ordersSub.unsubscribe();
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

  powrot() {
    window.history.go(-1);
  }

  onDelete(orderId: string) {
    this.orderService.deleteOrder(orderId);
  }
}
