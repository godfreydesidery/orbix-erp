import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user';
import { IRole } from 'src/app/models/role';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

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

  public users           : IUser[]
 
  constructor(private http : HttpClient, private auth : AuthService) {
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
    this.users           = []
  }  
  getUserData(): any {
    var userRoles : IRole[] = []
    this.roles.forEach(role => { //Get the roles
      if(role.granted == true){
        userRoles.push(role)
      }
    })
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
      roles       : userRoles
    }
  }
  
  ngOnInit(): void {
    this.getUsers()
    this.getRoles()
  }

  async saveUser(){
    /**
      * Create a single user
      */
    //validate inputs
    if(this.validateInputs() == false){
      return
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if (this.id == null || this.id == ''){
      //create a new user
      await this.http.post('/api/users/create', this.getUserData(), options)
      .toPromise()
      .then(
        data => {
          this.showUser(data)
          alert('User created successifully')
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create user')
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
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update user')
        }
      )   
    }
    
  }
 
  async getRoles(){
   /**
    * Get all the roles
    */
    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
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
    .catch(error => {
      console.log(error)
    })
  }

  async getUsers(){
    this.users = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IUser[]>('/api/users', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.users.push(element)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })
    return 
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
        console.log(error)        
        alert('No matching record')
      }
    )
  }

  async deleteUser(){
    if(this.id == null || this.id == ''){
      alert('No user selected, please select a user to delete')
      return
    }
    if(!confirm('Confirm delete the selected user. This action can not be undone')){
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.delete('api/users/delete?id='+this.id, options)
    .toPromise()
    .then(
      () => {
        this.clearFields()
        alert('Record deleted succesifully')
        return true
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete user profile')
        return false
      }
    )
  }

  showUser(user : any){
    /**
     * Display user details, takes a json user object
     * Args: user object
     */
    this.id         = user['id']
    this.username   = user['username']
    this.rollNo     = user['rollNo']
    this.firstName  = user['firstName']
    this.secondName = user['secondName']
    this.lastName   = user['lastName']
    this.alias      = user['alias']
    this.active     = user['active']
    this.showUserRoles(this.roles, user['roles'])
  }

  showUserRoles(roles : IRole[], userRoles : IRole[]){
    /**
     * Display user roles, the roles for that particular user are checked
     * args: roles-global user roles, userRoles-roles for a specific user
     */
    //first uncheck all roles
    this.clearRoles()
    //Now, check the respective  roles
    userRoles.forEach(userRole => {
      roles.forEach(role => {        
        if(role.name === userRole.name){
          role.granted = true
        }
      })
    })
    this.roles = roles
  }

  clearRoles(){
    /**
     * Uncheck all the roles
     */
    this.roles.forEach(role => {
      role.granted = false
    })
  }

  

  validateInputs() : boolean{
    let valid : boolean = true
    //validate username
    if(this.username == ''){
      alert('Empty username not allowed, please fill in the username field')
      return false
    }

    //validate passwords
    if(this.id == null || this.id == ''){
      if(this.password == ''){
        alert('Empty password not allowed for new user')
        return false
      }
      if(this.password != this.confirmPassword){
        alert('Password and Password confirmation do not match')
        return false
      }
    }else{
      if(this.password != this.confirmPassword && (this.password != '' || this.confirmPassword != '')){
        alert('Password and Password confirmation do not match')
        return false
      }
    }
    return valid
  }

  clearFields(){
    /**
     * Clear all the fields
     */
    this.id               = ''
    this.username         = ''
    this.password         = ''
    this.confirmPassword  = ''
    this.rollNo           = ''
    this.firstName        = ''
    this.secondName       = ''
    this.lastName         = ''
    this.alias            = ''
    this.active           = false
    this.clearRoles()
    this.enableSave = true
  }
}