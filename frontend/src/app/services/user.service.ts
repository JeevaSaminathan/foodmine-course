import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_CHANGE_PASSWORD_URL, USER_DELETE_USERS_URL, USER_FORGET_CHANGE_PASSWORD_URL, USER_GET_USERS_URL, USER_GET_USER_DETAILS_FORGET_PASSWORD_URL, USER_GET_USER_DETAILS_URL, USER_LOGIN_URL, USER_REGISTER_URL, USER_SEND_OTP_URL, USER_UPDATE_URL, USER_VERIFY_OTP_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { IUserChangePassword } from '../shared/interfaces/IUserChangePassword';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
   }

   public get currentUser():User{
    return this.userSubject.value;
   }

   login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}!`,
            'Login Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
   }

   register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the Foodmine ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
   }

   getUsers(): Observable<User[]>{
    return this.http.get<User[]>(USER_GET_USERS_URL);
  }

   logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
   }
   
   private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
   }

   private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
   }

   deleteUser(UserId:string){
    return this.http.delete<User>(USER_DELETE_USERS_URL + UserId);
  }

  getUserDetails(userId:string): Observable<User>{
    return this.http.get<User>(USER_GET_USER_DETAILS_URL + userId );
  }

  updateUser(userId:string,user:User){
    return this.http.put<User>(USER_UPDATE_URL + userId, user);
  }

  changePassword(userId:string,userChangePassword:IUserChangePassword):Observable<User>{
    return this.http.put<User>(USER_CHANGE_PASSWORD_URL + userId, userChangePassword).pipe(
      tap({
        next: (user) =>{
          this.toastrService.success(
            `Changed Password Successfully ${user.name}!`
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Change Password Failed');
        }
      })
    );
   }

   getUserDetailsforForgetPassword(email:string): Observable<User>{
    return this.http.get<User>(USER_GET_USER_DETAILS_FORGET_PASSWORD_URL + email );
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(USER_SEND_OTP_URL, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(USER_VERIFY_OTP_URL, { email, otp });
  }

  forgetChangePassword(email: string, password: string): Observable<any> {
    return this.http.put<User>(USER_FORGET_CHANGE_PASSWORD_URL, { email, password });
  }

}
