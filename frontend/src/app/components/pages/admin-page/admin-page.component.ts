import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { OrderStatus } from 'src/app/shared/constants/order.status';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {

  orders:Order[] = [];
  constructor(private orderService:OrderService, activatedRoute:ActivatedRoute,
    private toastrService:ToastrService,
    private router:Router) {
    let orderObservable:Observable<Order[]>;
    activatedRoute.params.subscribe((params) => {
      if(params.tag)
        orderObservable = this.orderService.getAllOrdersByTag(params.tag);
      else
        orderObservable = this.orderService.getAll();

        orderObservable.subscribe((serverFoods) => {
          this.orders = serverFoods;
        })
    })
  }

  statusChange(order: Order){
    const selectElement = document.getElementById('status') as HTMLSelectElement;
    
    const selectedValue = selectElement.value;

    order.status = selectedValue;
    if(selectedValue == OrderStatus.PAYED){
      order.ordertags = OrderStatus.PAYED;
    }else if(selectedValue == OrderStatus.SHIPPED){
      order.ordertags = OrderStatus.SHIPPED;
    }else if(selectedValue == OrderStatus.CANCELED){
      order.ordertags = OrderStatus.CANCELED;
    }else if(selectedValue == OrderStatus.REFUNDED){
      order.ordertags = OrderStatus.REFUNDED;
    }else if(selectedValue == OrderStatus.DELIVERYED){
      order.ordertags = OrderStatus.DELIVERYED;
    }

    const confirmation = window.confirm(`Are you sure you want to edit the Status of ${order.name}?`);
    if(confirmation){
      this.orderService.updateStatus(order.id, order).subscribe({
        next:() => {
          this.toastrService.success(`Order Status Changed Successfully`);
          this.router.navigateByUrl('/dashboard');
        },
        error:(errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Order');
        }
      })
    }
  }

}
