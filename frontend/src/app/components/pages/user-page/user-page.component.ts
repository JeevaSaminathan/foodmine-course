import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  users:User[] = [];
  constructor(private userService:UserService, 
    activatedRoute:ActivatedRoute,
    private toastrService:ToastrService,
    private router:Router) {
    let userObservable:Observable<User[]>;
    userObservable = userService.getUsers();

    userObservable.subscribe(user => {
      this.users = user;
    })
   }

   removeUserFromUsers(user:User){
    const confirmation = window.confirm(`Are you sure you want to remove ${user.name}?`);
    if(confirmation){
      this.userService.deleteUser(user.id).subscribe({
        next:() => {
          this.toastrService.success(`User Deleted Successfully`);
          this.router.navigateByUrl('/');
        },
        error:(errorResponse) => {
          this.toastrService.error(errorResponse.error, 'User');
        }
     });
    }
  }

}
