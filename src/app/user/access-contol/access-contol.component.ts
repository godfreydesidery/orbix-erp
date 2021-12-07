import { KeyValue } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Pipe} from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IObject } from 'src/app/models/object';
import { IOperation } from 'src/app/models/operation';
import { IRole } from 'src/app/models/role';

@Component({
  selector: 'app-access-contol',
  templateUrl: './access-contol.component.html',
  styleUrls: ['./access-contol.component.scss']
})
export class AccessContolComponent implements OnInit {

  public object       : string
  public operation    : string
  public objects      : string[]
  public operations   : string[]
  public roles        : string[]
  public privileges   : {[key : string] : string[]}
  public selectedRole : string
  public selectedRoleMessage : string

  keys = []

  objectKeys = Object.keys;

  constructor(
    private http : HttpClient,
    private auth :AuthService
    ) {
    this.object       = ''
    this.operation    = ''
    this.objects      = []
    this.operations   = []
    this.roles        = []
    this.privileges   = {
      'GRN' : [],
      'LPO' : [],
      'PRODUCT' : [],
      'REPORT' : []
    }

    this.selectedRole = ''
    this.selectedRoleMessage = 'Select role to update'
    
  }

  ngOnInit(): void {
    this.getAllObjects()
    this.getAllOperations()
    this.getRoles()
  }

  async getAllObjects(){
    /**
     * Get all the objects
     */
     let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<string[]>('/api/objects', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.objects.push(element)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })

  }

  async getAllOperations(){
    /**
     * Get all the operations
     */
     let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<string[]>('/api/operations', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.operations.push(element)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })
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
            this.roles.push(element.name)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })
  }

  selectRole(role : string){
    if(role != ''){
      this.selectedRoleMessage = 'Update priviledges for '+role
    }else{
      this.selectedRoleMessage = 'Select role to update'
    }
  }

  loadPrivileges(role : string){

  }

  addOrRemovePrivilege(action : any, object : string, operation : string){
    if(action.target.checked == true){
      this.addPrivilege(object, operation)
    }else{
      this.removePrivilege(object, operation)
    }
    console.log(this.privileges)
  }

  addPrivilege(object : string, operation : string){
    for (const [key, value] of Object.entries(this.privileges)) {
      if(key == object){
        let present : boolean = false
        if(value.length == 0){
          value.push(operation)
          present = true
        }
        value.forEach(element => {
          if(element == operation){
            present = true
          }
        })
        if(present == false){
          value.push(operation)
        }
      }
    }
  }

  removePrivilege(object : string, operation : string){
    for (const [key, value] of Object.entries(this.privileges)) {
      if(key == object){
        var i = -1
        value.forEach(element => {
          if(element == operation){
            value.splice(i, 1)
            return
          }
        })
      }
    }
  }


}


