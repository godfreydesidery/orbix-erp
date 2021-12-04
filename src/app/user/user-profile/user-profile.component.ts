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

  public searchKey       : any
  public id              : any
  public username        : string
  public password        : string
  public confirmPassword : string
  public rollNo          : string
  public firstName       : string
  public secondName      : string
  public lastName        : string
  public alias           : string
  public active          : boolean

  public roles           : IRole[]
 
  constructor(private http : HttpClient) {
    this.searchKey       = ''
    this.id              = ''
    this.username        = ''
    this.password        = ''
    this.confirmPassword = ''
    this.rollNo          = ''
    this.firstName       = ''
    this.secondName      = ''
    this.lastName        = ''
    this.alias           = ''
    this.active          = true
    this.roles           = []
  }  
  getUserData(): any {
    return {
      id          : this.id,
      username    : this.username,
      password    : this.password,
      rollNo      : this.rollNo,
      firstName   : this.firstName,
      secondName  : this.secondName,
      lastName    : this.lastName,
      alias       : this.alias,
      active      : this.active,
      roles       : this.roles
    }
  }
  
  ngOnInit(): void {
    this.getRoles()
  }

  async saveUser(){
    /**
      * Create a single user
      */
    let currentUser : {
      username       : string, 
      access_token   : string, 
      refresh_token  : string
    } = JSON.parse(localStorage.getItem('current-user')!)

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }
    if (this.id == null || this.id == ''){
      //create a new user
      await this.http.post('/api/users/create', this.getUserData(), options)
      .toPromise()
      .then(
        data => {
          console.log(data)
          alert('User created successifully')
        }
      )
      .catch(
        error => {
          console.log(error);
          alert('Could not create user')
        }
      )   
    }else{
      //update an existing user
      await this.http.put('/api/users/update', this.getUserData(), options)
      .toPromise()
      .then(
        data => {
          console.log(data)
          alert('User updated successifully')
        }
      )
      .catch(
        error => {
          console.log(error);
          alert('Could not update user')
        }
      )   
    }
    
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
  async getUser(key: string) {
    this.searchKey = key
    this.clearFields()
    this.username = this.searchKey
    await this.http.get("api/users/get_user?username="+this.searchKey)
    .toPromise()
    .then(
      data=>{
        this.showUser(data)
      }
    )
    .catch(
      error=>{
        alert('No matching record')
      }
    )
  }
  deleteUser(): boolean {
    throw new Error('Method not implemented.');
  }

  showUser(user : any){
    this.id         = user['id']
    this.username   = user['username']
    this.rollNo     = user['rollNo']
    this.firstName  = user['firstName']
    this.secondName = user['secondName']
    this.lastName   = user['lastName']
    this.alias      = user['alias']
    this.active     = user['active']
    this.roles.forEach(role => {
      user['roles'].array.forEach((userRole: IRole) => {
        if(userRole == role){
          role.granted = true
        }
      });
    });
  }

  showUserRoles(roles : IRole[], userRoles : IRole[]){
    //to show the user roles
    roles.forEach(role => {
      userRoles.forEach(userRole => {
        if(role.granted==false){

        }
      })
    });
  }

  clearFields(){
    this.id         = ''
    this.username   = ''
    this.rollNo     = ''
    this.firstName  = ''
    this.secondName = ''
    this.lastName   = ''
    this.alias      = ''
    this.active     = false
    this.getRoles()
  }
}