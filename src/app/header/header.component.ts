import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public userName    : string
  public systemDate  : string

  constructor(private router: Router) {
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

  ngOnInit(): void {}

  public logOut() : any{
    localStorage.removeItem('current-user')
    alert('You have logged out!')
    this.router.navigate([''])
    window.location.reload()
  }
}
