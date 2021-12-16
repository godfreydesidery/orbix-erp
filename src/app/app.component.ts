import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { AuthService } from './auth.service';

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
}
