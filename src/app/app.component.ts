import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { AuthService } from './auth.service';
import {trigger,state,style,animate,transition} from '@angular/animations'; 
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreModule} from '@ngrx/store';

const API_URL = environment.apiUrl;

interface AppState{
  message : string
}

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
   
  async ngOnInit(): Promise<void> {
    try{
      await this.loadDay()
    }catch(e:any){}    
    var currentUser = null
    if(localStorage.getItem('current-user') != null){
      currentUser = localStorage.getItem('current-user')
    }

    if(currentUser != null){
      this.isLoggedIn = true
      await this.router.navigate(['home'])
    }else{
      this.isLoggedIn = false
      await this.router.navigate([''])
    }
  }

  async loadDay(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IDayData>(API_URL+'/days/get_bussiness_date', options)
    .toPromise()
    .then(
      data => {
        localStorage.setItem('system-date', data?.bussinessDate!+'')        
      }
    )
    .catch(error => {})
  }
  
}
interface IDayData{
  bussinessDate : String
}

interface ISupplier{
  name : string
}
