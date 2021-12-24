import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { IClass } from '../class/class.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, IDepartment {
  id          : any;
  name        : string;
  dapartments : IDepartment[] = []

  constructor(private shortcut : ShortCutHandlerService, 
              private auth : AuthService, 
              private http : HttpClient) {
    this.id   = ''
    this.name = ''
  }
  
  ngOnInit(): void {
    this.getAll()
  }

  async save(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var department = {
      id   : this.id,
      name : this.name
    }
    if(this.id == null || this.id == ''){
      /**
       * Save a new record
       */
      await this.http.post<IDepartment>('/api/departments/create', department, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name         
          alert('Department created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create department')
        }
      )

    }else{
      /**
       * Update an existing record
       */
      await this.http.put<IDepartment>('/api/departments/update', department, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name 
          alert('Department updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update department')
        }
      )
    }
  }
  async getAll() {
    /**
     * Get all records
     */
    this.dapartments = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IDepartment[]>('/api/departments', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.dapartments.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load departments')
      }
    )
  }
  async get(id: any) {
    /**
     * Get a single record
     */
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IDepartment>("api/departments/get?id="+id, options)
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.name = data!.name
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )

  }
  async getByName(name: string) {
    /**
     * Find a record by name
     */
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get("api/departments/get_by_name?name="+name, options)
    .toPromise()
    .then(
      data=>{
        this.showDepartment(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }

  showDepartment(department : any){
    /**
     * Display record data
     */
    this.id   = department['id']
    this.name = department['name']
  }

  async delete(id : any) {
    if(window.confirm('Confirm delete of the selected department') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      await this.http.delete('/api/departments/delete?id='+id, options)
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Department deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete department')
        }
      )
    }
  }

  clearData(){
    /**
     * Clear displayed record data
     */
    this.id   = ''
    this.name = ''
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface IDepartment {
  id         : any
  name   : string
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}
