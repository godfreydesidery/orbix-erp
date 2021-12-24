import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { AuthService } from './auth.service';
import {trigger,state,style,animate,transition} from '@angular/animations'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'orbix-erp';

  public isLoggedIn = false

  constructor(private http  : HttpClient,
    private auth : AuthService,
    private router: Router){   
  }
   
  ngOnInit(): void {
    this.loadDay()
    var currentUser = null
    if(localStorage.getItem('current-user') != null){
      currentUser = localStorage.getItem('current-user')
    }

    if(currentUser != null){
      this.isLoggedIn = true
      this.router.navigate(['home'])
    }else{
      this.isLoggedIn = false
      this.router.navigate([''])
    }
  }

  async loadDay(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
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
  }
}
interface IDayData{
  bussinessDate : String
}
