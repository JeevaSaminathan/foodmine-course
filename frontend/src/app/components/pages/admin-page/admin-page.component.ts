import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {

  orders:Order[] = [];
  constructor(orderService:OrderService, activatedRoute:ActivatedRoute) {
    let orderObservable:Observable<Order[]>;
    orderObservable = orderService.getOrders();

    orderObservable.subscribe(order => {
      this.orders = order;
    })
  }

}
