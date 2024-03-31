import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { OrderTrackPageComponent } from './components/pages/order-track-page/order-track-page.component';
import { FoodsAdminPageComponent } from './components/pages/foods-admin-page/foods-admin-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { OrderPageComponent } from './components/pages/order-page/order-page.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AddNewFoodsPageComponent } from './components/pages/add-new-foods-page/add-new-foods-page.component';
import { EditFoodsPageComponent } from './components/pages/edit-foods-page/edit-foods-page.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'search/:searchTerm', component:HomeComponent},
  {path:'tag/:tag', component:HomeComponent},
  {path:'food/:id', component:FoodPageComponent},
  {path:'cart-page', component:CartPageComponent},
  {path:'orders/get', component:AdminPageComponent},
  {path:'ordertag/:tag', component:AdminPageComponent},
  {path:'users/getuser', component:UserPageComponent},
  {path:'orders', component:OrderPageComponent},
  {path:'login', component: LoginPageComponent},
  {path:'register', component: RegisterPageComponent},
  {path:'checkout', component: CheckoutPageComponent, canActivate:[AuthGuard]},
  {path:'payment', component: PaymentPageComponent, canActivate:[AuthGuard]},
  {path:'track/:orderId', component: OrderTrackPageComponent, canActivate:[AuthGuard]},
  {path:'foods/getfood', component: FoodsAdminPageComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'addnewfoods', component: AddNewFoodsPageComponent, canActivate:[AuthGuard]},
  {path:'editfoods', component: EditFoodsPageComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
