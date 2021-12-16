import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IRole } from 'src/app/models/role';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss']
})
export class RoleManagerComponent implements OnInit, IRole {

  lockedName : boolean = true

  enableSearch : boolean = false
  enableSave   : boolean = false
  enableDelete : boolean = false

  searchKey : any
  id        : any;
  name      : string;
  granted   : boolean;
  active    : boolean

  public roles : IRole[]

  constructor(private http : HttpClient, private auth : AuthService) {
    this.id      = ''
    this.name    = ''
    this.granted = false
    this.active  = false
    this.roles   = []
  }

  ngOnInit(): void {
    this.getRoles()
  }
  
  async saveRole(): Promise<void> {
    /**
      * Create a single role
      */
    if(this.validateInputs() == false){//validate inputs
      return
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if (this.id == null || this.id == ''){
      //create a new role
      await this.http.post('/api/roles/create', this.getRoleData(), options)
      .toPromise()
      .then(
        data => {
          this.lockedName = true
          this.showRole(data)
          console.log(data)
          this.roles = []
          this.getRoles()
          alert('Role created successifully')
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create role')
        }
      )   
    }else{
      //update an existing role
      await this.http.put('/api/roles/update', this.getRoleData(), options)
      .toPromise()
      .then(
        data => {
          console.log(data)
          this.roles = []
          this.getRoles()
          alert('Role updated successifully')
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update role')
        }
      )   
    }
  }

  async getRoles() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
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
  
  async getRole(key: string): Promise<any> {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    this.searchKey = key
    this.clearFields()
    this.name = this.searchKey
    await this.http.get("api/roles/get_role?name="+this.searchKey, options)
    .toPromise()
    .then(
      data=>{
        this.lockedName = true
        this.showRole(data)
      }
    )
    .catch(
      error=>{
        console.log(error) 
        this.name = ''       
        ErrorHandlerService.showHttpErrorMessage(error, '', 'No matching role')
      }
    )
  }

  async deleteRole(id : string) : Promise<any>{
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.delete<IRole[]>("api/roles/delete?id="+id, options)
    .toPromise()
    .then(data => {
      this.id    = ''
      this.name  = ''
      this.roles = []
      this.lockedName = true
      this.getRoles()
    })
    .catch(
      error => {
        console.log(error)        
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete role')
        return false
      }
    )
    return true
  }

  validateInputs() : boolean{
    let valid : boolean = true
    //validate rolename
    if(this.name == ''){
      alert('Empty name not allowed, please fill in the name field')
      return false
    }
    return valid
  }

  getRoleData(): any {
    return {
      id   : this.id,
      name : this.name
    }
  }

  showRole(role : any){
    /**
     * Display role details, takes a json user object
     * Args: role object
     */
    this.id   = role['id']
    this.name = role['name'] 
    this.enableDelete = true   
  }

  clearFields(){
    /**
     * Clear all the fields
     */
    this.id   = ''
    this.name = ''
    this.enableSave = true
    this.enableDelete = false
    this.lockedName = false
  }

  edit(){
    this.lockedName = false
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
