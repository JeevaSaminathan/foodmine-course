import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { ORDERS_BY_TAG_URL, ORDERS_URL, ORDER_CREATE_URL, ORDER_GET_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_TAGS_URL, ORDER_TRACK_URL, ORDER_UPDATE_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';
import { OrderTag } from '../shared/models/OrderTag';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  create(order:Order){
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  getNewOrderForCurrentUser():Observable<Order>{
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  pay(order:Order):Observable<string>{
    return this.http.post<string>(ORDER_PAY_URL,order);
  }

  trackOrderById(id:number): Observable<Order>{
    return this.http.get<Order>(ORDER_TRACK_URL + id);
  }

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(ORDERS_URL);
  }
  
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_GET_URL);
  }

  getAllTags(): Observable<OrderTag[]> {
    return this.http.get<OrderTag[]>(ORDER_TAGS_URL);
  }

  getAllOrdersByTag(tag:string): Observable<Order[]>{
    return tag === "All"?
    this.getAll():
    this.http.get<Order[]>(ORDERS_BY_TAG_URL + tag);
  }

  updateStatus(orderId:number,order:Order){
    return this.http.put<Order>(ORDER_UPDATE_URL + orderId, order);
  }

}
