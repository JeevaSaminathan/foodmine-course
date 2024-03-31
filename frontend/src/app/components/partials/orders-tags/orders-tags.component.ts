import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderTag } from 'src/app/shared/models/OrderTag';

@Component({
  selector: 'app-orders-tags',
  templateUrl: './orders-tags.component.html',
  styleUrls: ['./orders-tags.component.css']
})
export class OrdersTagsComponent {

  ordertag?:OrderTag[];
  constructor(orderService:OrderService) {
    orderService.getAllTags().subscribe(serverTags => {
      this.ordertag = serverTags;
    });
  }

}
