import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as moment from "moment"
import { BehaviorSubject, Observable } from 'rxjs'
import { User } from './models/user'
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService()

  private currentUserSubject: BehaviorSubject<User>
  public currentUser: Observable<User>


  constructor(private http : HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('current-user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  loginUser(username : string, password : string){
    let user = new URLSearchParams()
    user.set('username', username)
    user.set('password', password)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post<any>('/api/login', user, options)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('current-user', JSON.stringify(user))
        this.currentUserSubject.next(user)

        let currentUser : {
          username : string, 
          access_token : string, 
          refresh_token : string
        } = JSON.parse(localStorage.getItem('current-user')!)

        if(this.tokenExpired(currentUser.access_token)){
          //should clear user information
          return
        }
        return user
      }));  
  }

  autoLogin(){
    let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)
    if(!currentUser){
      return
    }

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('current-user')
    this.currentUserSubject.next(new User('', '', new Date))
  }

  private tokenExpired(token: string) {
    return this.helper.isTokenExpired(token)
  }

}
