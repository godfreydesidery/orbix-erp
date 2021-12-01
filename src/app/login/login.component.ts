import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private auth : AuthService, private router: Router, private authService: AuthService) {  
    
    this.username = ''
    this.password = ''  

  }

  ngOnInit(): void {

  }
  
  loginUser(){

    localStorage.removeItem('user-name')
    localStorage.removeItem('system-date')

    if(this.username == '' || this.password == ''){ 
      alert('Please fill in the required fields')
      return
    }
    this.auth.loginUser(this.username, this.password)
    .pipe(first())
    .subscribe(
    (data) => {
      localStorage.setItem('user-name', 'Godfrey Desidery') // load these details from server instead
      localStorage.setItem('system-date', '2021-12-01')
      console.log(data)
      console.log('Login success')
      window.location.reload()  
    },
    error => {
        this.error = error;
        this.loading = false;
        console.log('Login failed')
        localStorage.removeItem('current-user')
        alert('Could not log in')
    })
    
  }
  
  clearFields(){
    this.username = ''
    this.password = ''
  }

}


