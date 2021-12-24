import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { IDepartment } from '../department/department.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, IClass {

  id              : any
  name            : string
  classes!        : IClass[];
  departmentName  : string
  departmentNames : string[] = []
  department!     : IDepartment

  constructor(private shortcut : ShortCutHandlerService, 
              private auth : AuthService, 
              private http : HttpClient) {
    this.id             = ''
    this.name           = ''
    this.departmentName = ''
  }

  ngOnInit(): void {
    this.loadDepartmentNames()
    this.getAll()
  }
  
  async save() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var class_ = {
      id   : this.id,
      name : this.name,
      department : {
        name : this.departmentName
      }
    }
    if(this.id == null || this.id == ''){
      /**
       * Save new record
       */
      await this.http.post<IClass>('/api/classes/create', class_, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name
          alert('Class created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create class')
        }
      )

    }else{
      /**
       * Update an existing record
       */
      await this.http.put<IClass>('/api/classes/update', class_, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name 
          alert('Class updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update class')
        }
      )
    }
  }
  async getAll(){
    /**
     * Get all records
     */
    this.classes = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IClass[]>('/api/classes', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.classes.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load classes')
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

    await this.http.get<IClass>("api/classes/get?id="+id, options)
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.name = data!.name
        this.departmentName = data!.department.name
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
     * Get a single record by name
     */
     let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IClass>("api/classes/get_by_name?name="+name, options)
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.name = data!.name
        this.departmentName = data!.department.name
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }
  async delete(id : any) {
    /**
     * Delete a single record by id
     */
    if(window.confirm('Confirm delete of the selected class') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      await this.http.delete('/api/classes/delete?id='+id, options)
      .toPromise()
      .then(
        () => {
          alert('Class deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete class')
        }
      )
    }
  }

  

  clearData(){
    /**
     * Clear displayed data
     */
    this.id = ''
    this.name = ''
    this.departmentName = ''
  }

  async loadDepartmentNames(){
    /**
     * Gets a list of all department names
     */
    this.departmentNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IDepartment[]>('/api/departments', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.departmentNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load departments')
      }
    )
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}


export interface IClass {
  id         : any
  name   : string
  department : IDepartment
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}
