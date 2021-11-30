import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username : string
  password : string

  

  constructor(private auth : AuthService, private http : HttpClient) {   
    this.username = ''
    this.password = ''
  }

  ngOnInit(): void {}
  
  loginUser(){
    this.auth.loginUser(this.username, this.password)
  }
  
}


