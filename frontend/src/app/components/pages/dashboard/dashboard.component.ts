import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  user!:User;

  constructor(private userService:UserService,
    private router:Router
  ){
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
  }
  get isAdmin(){
    return this.user.isAdmin;
  }

  userProfilePage(user:User){
    this.router.navigate(['/users/profile'], { queryParams: { id: user.id } });
  }

}
