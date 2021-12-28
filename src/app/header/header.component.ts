import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public userName    : string
  public systemDate  : string

  constructor(private router: Router,
    private auth : AuthService) {

    if(localStorage.getItem('user-name') != null){
      this.userName = localStorage.getItem('user-name')!
    }else{
      this.userName = ''
    }
    if(localStorage.getItem('system-date') != null){
      this.systemDate = localStorage.getItem('system-date')!
    }else{
      this.systemDate = ''
    }  
  }

  ngOnInit(): void {
    if(localStorage.getItem('user-name') == null){
      
    }
  }
    
  public async logOut() : Promise<any>{
    localStorage.removeItem('current-user')
    alert('You have logged out!')
    await this.router.navigate([''])
    window.location.reload()
  }
}
