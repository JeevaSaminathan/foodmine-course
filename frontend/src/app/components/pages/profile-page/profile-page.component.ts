import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IUserChangePassword } from 'src/app/shared/interfaces/IUserChangePassword';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  returnUrl = '';
  users:User = new User();
  changeUsers:IUserChangePassword = {
    name : '',
    email : '',
    password : '',
    newPassword : '',
    address : '',
    isAdmin : false
  };
  userId!:string;
  isSubmitted = false;
  userUpdateForm!:FormGroup;
  passwordUpdateForm!:FormGroup;
  userdetails!:User;
  confirmPassword!:string;
  constructor(private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService,
    private formBuilder:FormBuilder,
    private router:Router
  ) {}


  ngOnInit(): void {

    this.userUpdateForm = this.formBuilder.group({
      
    });
    this.passwordUpdateForm = this.formBuilder.group({
      
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'];
    });

    let userObservable:Observable<User>;
    userObservable = this.userService.getUserDetails(this.userId);
    
    userObservable.subscribe(user => {
      this.userdetails = user;
      this.users = this.userdetails;
    })
  }

  submit(){

    function validateInput(this: any, name: string, address: string): string | null {

      if (!name) {
        return 'Please fill the Name.';
      }
      if (name.trim().length < 3) {
        return 'Name must be at least 3 characters long.';
      }
    

      if (!address) {
        return 'Please fill the Address.';
      }

      if (address.trim().length < 7) {
        return 'Address must be at least 7 characters long.';
      }
    
      return null;
    }
    
    const validationError = validateInput(this.users.name, this.users.address);
    this.isSubmitted = true;
    if(validationError){
      this.toastrService.warning(validationError, 'Invalid Inputs');
      return;
    }

    
    const confirmation = window.confirm(`Are you sure you want to edit ${this.users.name}?`);
    if(confirmation){
      this.userService.updateUser(this.userId, this.users).subscribe({
        next:() => {
          this.toastrService.success(`User Edited Successfully`);
          this.router.navigateByUrl('/');
          setTimeout(() => {
            this.userService.logout();
          }, 2000);
        },
        error:(errorResponse) => {
          this.toastrService.error(errorResponse.error, 'User');
        }
      })
    }
    return;
  }

  passwordsubmit(){

    function validateInput(this: any, newPassword: string, confirmPassword: string): string | null {

      if (!newPassword) {
        return 'Please fill the Password.';
      }
      if (newPassword.trim().length < 5) {
        return 'New Password must be at least 5 characters long.';
      }
      if(newPassword !== confirmPassword){
        return 'New Password must equal to Confirm Password';
      }
      return null;
    }

    
    const validationError = validateInput(this.changeUsers.newPassword, this.confirmPassword);
    this.isSubmitted = true;
    if(validationError){
      this.toastrService.warning(validationError, 'Invalid Inputs');
      return;
    }

    this.changeUsers.name = this.userdetails.name;
    this.changeUsers.address = this.userdetails.address;
    this.changeUsers.email = this.userdetails.email;
    this.changeUsers.isAdmin = this.userdetails.isAdmin;
    const confirmation = window.confirm(`Are you sure you want to change the Password of ${this.users.name}?`);
    if(confirmation){
      this.userService.changePassword(this.userId, this.changeUsers).subscribe({
        next:() => {
          this.router.navigateByUrl('/');
          setTimeout(() => {
            this.userService.logout();
          }, 2000);
        }
      })
    }
    return;
  }

  onEnterName(value: string): void {
    this.users.name = value;
  }

  onEnterAddress(value: string): void {
    this.users.address = value;
  }

  onEnterOldPassword(value: string): void {
    this.changeUsers.password = value;
  }

  onEnterNewPassword(value: string): void {
    this.changeUsers.newPassword = value;
  }

  onEnterConfirmPassword(value: string): void {
    this.confirmPassword = value;
  }


}
