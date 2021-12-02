import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { first } from 'rxjs/internal/operators/first';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading   : boolean  = false;
  submitted : boolean  = false;
  returnUrl : string   = '';
  error     : string   = '';

  username  : string
  password  : string

  constructor(
    private http :HttpClient,
    private auth : AuthService, 
    private router: Router, 
    private authService: AuthService) {  
    
    this.username = ''
    this.password = ''  

  }

  ngOnInit(): void {}

  async loginUser(){
    localStorage.removeItem('user-name')
    localStorage.removeItem('system-date')

    if(this.username == '' || this.password == ''){ 
      alert('Please fill in the required fields')
      return
    }
    await this.auth.loginUser(this.username, this.password)
      .pipe(first())
      .toPromise()
      .then(
        async data => {
          await this.auth.loadUserSession(this.username)
          console.log(data);
          console.log('Login success')
          window.location.reload()
        },
        error => {
          this.error = error
          this.loading = false
          console.log('Login failed')
          localStorage.removeItem('current-user')
          alert('Could not log in')
          return
        }
      )    
  }
  
  clearFields(){
    this.username = ''
    this.password = ''
  }

  

}

export interface User{
  firstName   : string
  secondName  : string
  lastName    : string
}




