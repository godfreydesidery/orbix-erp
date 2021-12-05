import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IRole } from 'src/app/models/role';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss']
})
export class RoleManagerComponent implements OnInit, IRole {
  searchKey : any
  id        : any;
  name      : string;
  granted   : boolean;
  active    : boolean

  public roles: IRole[]

  constructor(private http : HttpClient) {
    this.id = ''
    this.name = ''
    this.granted = false
    this.active = false
    this.roles = []
  }

  ngOnInit(): void {
    this.getRoles()
    console.log(this.roles)
  }
  
  async saveRole(): Promise<void> {
    /**
      * Create a single role
      */
    //validate inputs
    if(this.validateInputs() == false){
      return
    }
    let currentUser : {
      username       : string, 
      access_token   : string, 
      refresh_token  : string
    } = JSON.parse(localStorage.getItem('current-user')!)

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }
    if (this.id == null || this.id == ''){
      //create a new role
      await this.http.post('/api/roles/create', this.getRoleData(), options)
      .toPromise()
      .then(
        data => {
          this.showRole(data)
          console.log(data)
          this.roles = []
          this.getRoles()
          alert('Role created successifully')
        }
      )
      .catch(
        error => {
          console.log(error);
          alert('Could not create role')
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
          console.log(error);
          alert('Could not update role')
        }
      )   
    }
  }
  async getRoles() {
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
    .catch(error => {
      console.log(error)
    })
  }
  async getRole(key: string): Promise<any> {
    /**
     * Get a specified role
     */
     let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    this.searchKey = key
    this.clearFields()
    this.name = this.searchKey
    await this.http.get("api/roles/get_role?name="+this.searchKey, options)
    .toPromise()
    .then(
      data=>{
        this.showRole(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }
  deleteRole(): boolean {
    throw new Error('Method not implemented.');
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
  }

  clearFields(){
    /**
     * Clear all the fields
     */
    this.id   = ''
    this.name = ''
  }
}
