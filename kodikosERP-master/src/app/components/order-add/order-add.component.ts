import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { NgForm } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Dictionary } from '../../models/slownik.model';
import { DictionaryService } from '../../services/slowniki.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.scss']
})
export class OrderAddComponent implements OnInit {
  private mode = 'create';
  private orderId: string;

  order: Order = {
    data: null,
    creator: '',
    termsOfPayment: '',
    deliveryType: '',
    labelling: '',
    packing: '',
    // atest
    certificate: '',
    // wykonanie
    // realization: '',
    // tolerancja wykonania
    engeneeringTolerance: '',
    // pochodzenie towaru
    origin: '',
    // uwagi
    comments: '',
    items: null
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
    private orderService: OrderService,
    private dictionaryService: DictionaryService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // I'm checkin parameters of URL
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('orderId')) {
        // it means that we are in edit mode
        this.mode = 'edit';
        this.orderId = paramMap.get('orderId');
        // I'm getting data about assortment
        this.orderService
          .getOrderId(this.orderId)
          .subscribe(orderData => {
            this.order = orderData;
            delete this.order._id;
            this.order.id = orderData._id;
          });
      } else {
        this.mode = 'create';
        this.orderId = null;
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

  onSaveOrder(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const order: Order = {
      data: form.value.data,
      creator: form.value.creator,
      termsOfPayment: form.value.termsOfPayment,
      deliveryType: form.value.deliveryType,
      labelling: form.value.labelling,
      packing: form.value.packing,
      // atest
      certificate: form.value.certificate,
      // wykonanie
      // realization: form.value.realization,
      // tolerancja wykonania
      engeneeringTolerance: form.value.engeneeringTolerance,
      // pochodzenie towaru
      origin: form.value.origin,
      // uwagi
      comments: form.value.comments,
      items: form.value.items
    };
    if (this.mode === 'create') {
      this.orderService.addOrder(order);
    } else {
      this.orderService.updateOrder(this.orderId, order);
    }
  }
}

