import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersUpdated = new Subject<Order[]>();

  constructor(private router: Router, private http: HttpClient) {}

  // GET ALL ORDERS
  getOrders() {
    // zwracam kopię tablicy 'kontrahenci' tak aby inni ludzie
    // nie modyfikowali tablicy na której aktualnie pracuję
    // return [...this.assortments];

    // httpClient is generic type so we state that we will get aray of orders
    this.http
      .get<{ message: string; orders: any }>(environment.apiUrl + '/order')
      // I am using pipe to change id na _id
      .pipe(
        map(ordersData => {
          return ordersData.orders.map(order => {
            return {
              id: order._id,
              data: order.data,
              creator: order.creator,
              termsOfPayment: order.termsOfPayment,
              deliveryType: order.deliveryType,
              labelling: order.labelling,
              packing: order.packing,
              // atest
              certificate: order.certificate,
              // wykonanie
              realization: order.realization,
              // tolerancja wykonania
              engeneeringTolerance: order.engeneeringTolerance,
              // pochodzenie towaru
              origin: order.origin,
              // uwagi
              comments: order.comments,
              items: order.items
            };
          });
        })
      )
      .subscribe(transformedOrders => {
        // this function gets data
        // positive case
        this.orders = transformedOrders;
        this.ordersUpdated.next([...this.orders]);
      });
  }

  // I am listening to subject of ordersUpdated
  getOrdersUpdatedListener() {
    return this.ordersUpdated.asObservable();
  }

  // ADDING an Order
  addOrder(orderData: Order) {
    const order: Order = {
      id: null,
      data: orderData.data,
      creator: orderData.creator,
      termsOfPayment: orderData.termsOfPayment,
      deliveryType: orderData.deliveryType,
      labelling: orderData.labelling,
      packing: orderData.packing,
      // atest
      certificate: orderData.certificate,
      // wykonanie
      realization: orderData.realization,
      // tolerancja wykonania
      engeneeringTolerance: orderData.engeneeringTolerance,
      // pochodzenie towaru
      origin: orderData.origin,
      // uwagi
      comments: orderData.comments,
      items: orderData.items
    };
    // I'm sending data to node server
    this.http
      .post<{ message: string; orderId: string }>(
        environment.apiUrl + '/order',
        order
      )
      .subscribe(responseData => {
        // console.log(responseData.message);
        const id = responseData.orderId;
        order.id = id;
        this.orders.push(order);
        // I'm emitting a new vlue to contractorsUpdated
        // as a copy of contractors table
        this.ordersUpdated.next([...this.orders]);
        this.router.navigate(['/lazy/order']);
      });
  }

  // GET SINGLE ORDER
  getOrderId(id: string) {
    // I'm getting an order from local array of orders
    // return {...this.orders.find(c => c.id === id)};

    // I'm getting an order from database
    return this.http.get<{ _id: string }>(environment.apiUrl + '/order/' + id);
  }

  // UPDATE AN ORDER
  updateOrder(id: string, orderData: Order) {
    const order: Order = orderData;
    this.http
      .put(environment.apiUrl + '/order/' + id, order)
      .subscribe(response => {
        this.router.navigate(['/lazy/order']);
      });
  }

  deleteOrder(orderId: string) {
    this.http.delete(environment.apiUrl + '/order/' + orderId).subscribe(() => {
      const updatedOrders = this.orders.filter(order => order.id != orderId);
      this.orders = updatedOrders;
      this.ordersUpdated.next([...this.orders]);
    });
  }
}
