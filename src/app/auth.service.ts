import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as moment from "moment"
import { BehaviorSubject, Observable } from 'rxjs'
import { IUser } from './models/user'
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt'
import { DatePipe } from '@angular/common'

interface IUserData{
  alias : string
}

interface IDayData{
  bussinessDate : String
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService()
  

  private currentUserSubject: BehaviorSubject<IUser>
  public currentUser: Observable<IUser>

  public user : {
    username : string, 
    access_token : string, 
    refresh_token : string
  } = JSON.parse(localStorage.getItem('current-user')!) 


  constructor(
    private http : HttpClient,
    private datePipe : DatePipe
    ) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('current-user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value
  }

  loginUser(username : string, password : string){
    let user = new URLSearchParams()
    user.set('username', username)
    user.set('password', password)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }

    return this.http.post<any>('/api/login', user, options)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('current-user', JSON.stringify(user))
       // this.currentUserSubject.next(user)
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
    //this.currentUserSubject.next(new User('', '', new Date))
  }

  private tokenExpired(token: string) {
    return this.helper.isTokenExpired(token)
  }



  public async loadUserSession(username : string){
      
    let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<IUserData>('/api/users/get_user?username='+username, options)
    .toPromise()
    .then(
      data => {
        localStorage.setItem('user-name', data?.alias!+'')  
        localStorage.setItem('username', username)  
      }
    )

    await this.http.get<IDayData>('/api/days/get_bussiness_date', options)
    .toPromise()
    .then(
      data => {
        localStorage.setItem('system-date', data?.bussinessDate!+'')        
      },
      error => {
        console.log(error)
      }
    )
   //localStorage.setItem('system-date', '2021-12-02')
  }

  public unloadUserSession(){
    localStorage.removeItem('username')
    localStorage.removeItem('user-name')
    localStorage.removeItem('system-date')
  }
}


