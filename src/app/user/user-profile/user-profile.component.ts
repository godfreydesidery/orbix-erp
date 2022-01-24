import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user';
import { IRole } from 'src/app/models/role';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

const API_URL = environment.apiUrl;

interface IiRole{
  name: string 
  granted: boolean 
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})

export class UserProfileComponent implements OnInit, IUser {
  public usernameLocked     : boolean = true
  public passwordLocked     : boolean = true
  public passwordConfLocked : boolean = true
  public rollNoLocked       : boolean = true
  public firstNameLocked    : boolean = true
  public secondNameLocked   : boolean = true
  public lastNameLocked     : boolean = true
  public aliasLocked        : boolean = true

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

  /**
   * 
   * @param http 
   * @param auth 
   */

 
  constructor(private http : HttpClient, 
              private auth : AuthService, 
              private spinner: NgxSpinnerService) {
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
      this.spinner.show()  
      await this.http.post(API_URL+'/users/create', this.getUserData(), options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.showUser(data)
          alert('User created successifully')
          this.getUsers()
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
      this.spinner.show()
      await this.http.put(API_URL+'/users/update', this.getUserData(), options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          console.log(data)
          alert('User updated successifully')
          this.getUsers()
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
    this.spinner.show()
    await this.http.get<IRole[]>(API_URL+'/roles', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IUser[]>(API_URL+'/users', options)
    .pipe(finalize(() => this.spinner.hide()))
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
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load users')
    })
    return 
  }
  
  async getUser(key: string) {
    this.searchKey = key
    this.clearFields()
    this.username = this.searchKey

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get(API_URL+'/users/get_user?username='+this.searchKey, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.showUser(data)
        this.lockInputs()
      }
    )
    .catch(
      error=>{
        console.log(error)        
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested user could not be found')
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
    this.spinner.show()
    await this.http.delete(API_URL+'/users/delete?id='+this.id, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    if(this.firstName == '' || this.lastName == '' || this.alias == ''){
      alert('First name, last name and alias are required fields')
      return false
    }
    return valid
  }

  clearFields(){
    if(!this.grant(['USER-CREATE'])){
      alert('Access denied')
      return
    }
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

  unlockInputs(){
    this.usernameLocked      = false
    this.passwordLocked      = false
    this.passwordConfLocked  = false
    this.rollNoLocked        = false
    this.firstNameLocked     = false
    this.secondNameLocked    = false
    this.lastNameLocked      = false
    this.aliasLocked         = false
  }

  lockInputs(){
    this.usernameLocked      = true
    this.passwordLocked      = true
    this.passwordConfLocked  = true
    this.rollNoLocked        = true
    this.firstNameLocked     = true
    this.secondNameLocked    = true
    this.lastNameLocked      = true
    this.aliasLocked         = true
  }

  public grant(privilege : string[]) : boolean{
    /**
     * Allows a user to perform an action if the user has that privilege
     */
    var granted : boolean = false
    privilege.forEach(
      element => {
        if(this.auth.checkPrivilege(element)){
          granted = true
        }
      }
    )
    return granted
    
  }
}