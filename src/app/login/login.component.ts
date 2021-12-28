import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { first } from 'rxjs/internal/operators/first';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted : boolean  = false;
  returnUrl : string   = '';

  status : string = ''

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

  ngOnInit(): void {
    this.status = ''
    console.log(API_URL)
  }

  async loginUser(){
    localStorage.removeItem('user-name')
    localStorage.removeItem('system-date')

    if(this.username == '' || this.password == ''){ 
      alert('Please fill in the required fields')
      return
    }
    this.status = 'Loading... Please wait.'
    await this.auth.loginUser(this.username, this.password)
      .pipe(first())
      .toPromise()
      .then(
        async data => {
          this.status = 'Loading User... Please wait.'
          await this.auth.loadUserSession(this.username)
          this.status = 'Authenticated'
          console.log(data);
          console.log('Login success')
          window.location.reload()
        }
      )
      .catch(error => {
        this.status = ''
        console.log(error)
        localStorage.removeItem('current-user')
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Invalid username and password')
        return
      })    
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