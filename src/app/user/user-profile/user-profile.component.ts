import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user';
import { IRole } from 'src/app/models/role';

interface IiRole{
  name: string 
  granted: boolean 
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, IUser {

  public id              : any
  public username        : string
  public password        : string
  public confirmPassword : string
  public rollNo          : string
  public firstName       : string
  public secondName      : string
  public lastName        : string
  public alias           : string
  public active          : number

  public roles           : IRole[]
 
  constructor(private http : HttpClient) {
    this.id              = ''
    this.username        = ''
    this.password        = ''
    this.confirmPassword = ''
    this.rollNo          = ''
    this.firstName       = ''
    this.secondName      = ''
    this.lastName        = ''
    this.alias           = ''
    this.active          = 1
    this.roles           = []
  }  
  
  ngOnInit(): void {
    this.getRoles()
  }
 
  async saveUser(){
    if(this.id == '' || this.id == null){
      alert('New user')
    }else{
      alert('Existing user')
    }
    /**
      * Create a single user
      */
    var user = {
      id         : this.id,
      username   : this.username,
      password   : this.password,
      rollNo     : this.rollNo,
      firstName  : this.firstName,
      secondName : this.secondName,
      lastName   : this.lastName,
      alias      : this.alias,
      active     : this.active,
      roles      : this.roles
    }

    let currentUser : {
      username       : string, 
      access_token   : string, 
      refresh_token  : string
    } = JSON.parse(localStorage.getItem('current-user')!)

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.post('/api/users/save', user, options)
    .toPromise()
    .then(
      data => {
        console.log(data)
        alert('New user created successifully')
      }
    )
    .catch(
      error => {
        console.log(error);
      }
    )   
  }
 
  async getRoles(){
   /**
    * Get all the roles
    */
    let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<IRole[]>('/api/roles', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.roles.push(element)
          }
        )
      }
    )
  }

  getUsers(): IUser[] {
    throw new Error('Method not implemented.');
  }
  getUser(username: string): IUser {
    throw new Error('Method not implemented.');
  }
  deleteUser(): boolean {
    throw new Error('Method not implemented.');
  }

}