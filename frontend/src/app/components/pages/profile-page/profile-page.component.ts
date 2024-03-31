import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  returnUrl = '';
  userId!:string;
  userdetails!:User;
  constructor(private userService:UserService,
    private activatedRoute:ActivatedRoute) {}


  ngOnInit(): void {

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'];
    });

    let userObservable:Observable<User>;
    userObservable = this.userService.getUserDetails(this.userId);
    
    userObservable.subscribe(user => {
      this.userdetails = user;
    })
  }

}
