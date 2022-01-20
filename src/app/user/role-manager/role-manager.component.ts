import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IRole } from 'src/app/models/role';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
})
export class RoleManagerComponent implements OnInit, IRole {

  public nameLocked : boolean = true

  enableSearch : boolean = false
  enableSave   : boolean = false
  enableDelete : boolean = false

  searchKey : any
  id        : any;
  name      : string;
  granted   : boolean;
  active    : boolean

  public roles : IRole[]

  constructor(private http : HttpClient, 
    private auth : AuthService,
    private spinner : NgxSpinnerService) {
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
      this.spinner.show()
      await this.http.post(API_URL+'/roles/create', this.getRoleData(), options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.nameLocked = true
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
      this.spinner.show()
      await this.http.put(API_URL+'/roles/update', this.getRoleData(), options)
      .pipe(finalize(() => this.spinner.hide()))
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

    await this.http.get<IRole[]>(API_URL+'/roles', options)
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
    await this.http.get(API_URL+'/roles/get_role?name='+this.searchKey, options)
    .toPromise()
    .then(
      data=>{
        this.nameLocked = true
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

  async deleteRole(id: string): Promise<any> {
    if (!window.confirm('Confirm deletion of the selected role')) {
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    await this.http.delete<IRole[]>(API_URL + '/roles/delete?id=' + id, options)
      .toPromise()
      .then(data => {
        this.id = ''
        this.name = ''
        this.roles = []
        this.nameLocked = true
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
    this.nameLocked = false
  }

  edit(){
    this.nameLocked = false
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
