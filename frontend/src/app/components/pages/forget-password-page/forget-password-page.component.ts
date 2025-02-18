import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.component.html',
  styleUrls: ['./forget-password-page.component.css']
})
export class ForgetPasswordPageComponent {

  userdetails!:User;
  users!:User;
  email!:string;
  otp: string = '';
  otpSent = false;
  otpverify = false;
  message: string = '';
  password!:string;
  confirmPassword!:string;
  isSubmitted = false;
  forgetPasswordForm!:FormGroup;
  constructor(private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService,
    private formBuilder:FormBuilder,
    private router:Router){}

  ngOnInit(): void {

    this.forgetPasswordForm = this.formBuilder.group({
      
    });
  }

  verify(){

    const confirmation = window.confirm(`Are you sure you want to change the Password ${this.email}?`);
    if(confirmation){
      let userObservable:Observable<User>;
      userObservable = this.userService.getUserDetailsforForgetPassword(this.email);
        
      userObservable.subscribe(user => {
      this.userdetails = user;
      this.users = this.userdetails;
      if(this.userdetails){
        this.toastrService.success(`User Verified Successfully`);
        const confirmations = window.confirm(`Are you sure otp send this ${this.email}?`);
        if(confirmations){
            this.userService.sendOtp(this.email).subscribe(
              (response) => {
                this.otpSent = true;
                this.toastrService.success(`OTP sent to your email`);
              },
              (error) => {
                this.otpSent = false;
                this.toastrService.error(`OTP not sent to your email`);
              }
            );  
        }
      }
      else{
        this.toastrService.error('User not Found');
      }
    })
    }
    return;
  }

  verifyOtp() {
    this.userService.verifyOtp(this.email, this.otp).subscribe(
      (response) => {
        this.otpverify = true;
        this.toastrService.success(`OTP verified with your email`);
      },
      (error) => {
        this.otpverify = false;
        this.toastrService.error(`OTP not verified with your email`);
      }
    );
  }

  forgetChangePassword() {

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

    
    const validationError = validateInput(this.password, this.confirmPassword);
    this.isSubmitted = true;
    if(validationError){
      this.toastrService.warning(validationError, 'Invalid Inputs');
      return;
    }

    const confirmation = window.confirm(`Are you sure you want to change the Password of ${this.users.name}?`);
    if(confirmation){
      this.userService.forgetChangePassword(this.email, this.password).subscribe(
        (response) => {
          this.toastrService.success(`Password Changed Successfully`);
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.toastrService.error(`Password not changed`);
        }
      );
    }
    return;

  }

  onEnterEmail(value: string): void {
    this.email = value;
  }

  onEnterOtp(value: string): void {
    this.otp = value;
  }

  onEnterNewPassword(value: string): void {
    this.password = value;
  }

  onEnterConfirmPassword(value: string): void {
    this.confirmPassword = value;
  }

}
function sendOtp() {
  throw new Error('Function not implemented.');
}

