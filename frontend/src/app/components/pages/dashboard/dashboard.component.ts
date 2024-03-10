import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  user!:User;

  constructor(private userService:UserService){
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
  }
  get isAdmin(){
    return this.user.isAdmin;
  }
}
