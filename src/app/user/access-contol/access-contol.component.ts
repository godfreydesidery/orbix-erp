import { animate, state, style, transition, trigger } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { KeyValue } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Pipe} from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IObject } from 'src/app/models/object';
import { IOperation } from 'src/app/models/operation';
import { IPrivilege } from 'src/app/models/privilege';
import { IRole } from 'src/app/models/role';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-access-contol',
  templateUrl: './access-contol.component.html',
  styleUrls: ['./access-contol.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
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
  public keys = []
  objectKeys = Object.keys
  public privilegeToRole! : {
    role      : string
    privilege : {
      object     : string
      operations : string[]
    }
  }

  constructor(
      private http : HttpClient,
      private auth :AuthService) {
    this.object       = ''
    this.operation    = ''
    this.objects      = []
    this.operations   = []
    this.roles        = []
    this.privileges   = {}
    this.selectedRole = ''
    this.selectedRoleMessage = 'Select role to update'
  }

  ngOnInit(): void {
    //this.getAllObjects()
    //this.getAllOperations()
    this.getRoles()
    this.loadPrivModel()
  }

  async getAllObjects(){
    this.objects    = []
    this.privileges = {}
    /**
     * Get all the objects
     */   
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<string[]>(API_URL+'/objects', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.privileges[element] = []
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
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<string[]>(API_URL+'/operations', options)
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
 
    await this.http.get<IRole[]>(API_URL+'/roles', options)
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
      this.selectedRole = role
      this.selectedRoleMessage = 'Update priviledges for '+role
      this.loadPrivileges(role)
    }else{
      this.selectedRole = ''
      this.selectedRoleMessage = 'Select role to update'
    }
  }

  async loadPrivileges(role : string){
    this.getAllObjects()
    /**
     * Get all the privileges
     */
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
 
    await this.http.get<IPrivilege[]>(API_URL+'/privileges?role='+role, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.addPrivilege(element.object, element.operation)
        })
      }
    )
    .catch(error => {
      console.log(error)
    })
  }

  addOrRemovePrivilege(action : any, object : string, operation : string){
    if(this.selectedRole == ''){
      alert('Please select role')
      return
    }
    if(action.target.checked == true){
      this.addPrivilege(object, operation)
    }else if(action.target.checked == false){
      this.removePrivilege(object, operation)
    }
  }

  clearPrivileges(){
    this.privileges = {}
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

  privilegeChecked(object_ : string, operation_ : string){
    var present = false
    for (const [key] of Object.entries(this.privileges)){
      if(key === object_){
        this.privileges[key].forEach(element => {
          if(element === operation_){
            present = true
          }
        })
      }   
    } 
    return present 
  }

  async addPrivilegeToRole(role : string){
    if(role == null || role == ''){
      alert('Please select Role')
      return
    }
    var accessForm : AccessForm = new AccessForm
    accessForm.role = role
    var privileges = this.privileges
    var privilegeForms = new Array<PrivilegeForm>()
    for (const [key] of Object.entries(privileges)){
      var privilegeForm = new PrivilegeForm()
      privilegeForm.object = key
      privilegeForm.operations = this.privileges[key]
      privilegeForms.push(privilegeForm)
    }
    accessForm.privileges = privilegeForms
    console.log(accessForm)
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.post(API_URL+'/privileges/addtorole', accessForm, options)
    .toPromise()
    .then(
      data => {
        console.log(data)
        alert('Updated successifully')
      }
    )
    .catch(
      error => {
        console.log(error);
        alert('Could not update role')
      }
    )   
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

  loadPrivModel() : boolean{
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    this.http.get<IIPrivilege[]>(API_URL+'/load_privilege_model', options)
    .toPromise()
    .then(
      data => {
        this.privModels = data!
      }
    )
    .catch(error => {
      console.log(error)
    })
    return false
  }

  privModels : IIPrivilege[] = []
 

}

export class AccessForm{
  role : string
  privileges : PrivilegeForm[]

  constructor(){
    this.role = ''
    this.privileges =new Array<PrivilegeForm>()
  }
}

export class PrivilegeForm{
  object : string
  operations : string[]

  constructor(){
    this.object = ''
    this.operations = []
  }
}

export interface IIPrivilege{
  object     : string
  operations : string[]
}