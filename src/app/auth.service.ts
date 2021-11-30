import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from "moment";
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(private http : HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')|| '{}'));
    this.currentUser = this.currentUserSubject.asObservable();


   }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  loginUser(username : string, password : string){
    let user = new URLSearchParams();
    user.set('username', username)
    user.set('password', password)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post<any>('/api/login', user, options)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));

    /*this.http.post('/api/login', user, options)
    .subscribe( // deprecated, use alternative method
      data => {
        this.setAuthData(data)
      },
      error => {
        alert("login failed")
      }      
    )*/
  }

  setAuthData(data : any){
    this.setSession(data['access_token'])
  }

  private setSession(authResult : any) {//
    const expiresAt = moment().add(authResult.expiresIn,'second')

    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()))
  }   
  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User);
}

  public isLoggedIn() {//
    return moment().isBefore(this.getExpiration())
  }

  isLoggedOut() {//
      return !this.isLoggedIn()
  }

  getExpiration() {//
      //const expiration = localStorage.getItem("expires_at");
      //const expiresAt = JSON.parse(expiration);
      //return moment(expiresAt);
      return localStorage.getItem("expires_at")
  }    
}
