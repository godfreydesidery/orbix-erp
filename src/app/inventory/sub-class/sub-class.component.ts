import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { IClass } from '../class/class.component';
import { IDepartment } from '../department/department.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-sub-class',
  templateUrl: './sub-class.component.html',
  styleUrls: ['./sub-class.component.scss']
})
export class SubClassComponent implements OnInit, ISubClass {

  public inputsLocked      : boolean = true

  id              : any
  name            : string
  subClasses!     : ISubClass[];
  className       : string
  departmentName  : string
  classNames      : string[] = []
  departmentNames : string[] = []
  class_!         : IClass
  department!     : IDepartment

  constructor(private shortcut : ShortCutHandlerService, 
              private auth : AuthService, 
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
    this.id             = ''
    this.name           = ''
    this.className      = ''
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
    var subClass = {
      id   : this.id,
      name : this.name,
      class_ : {
        name : this.className
      }
    }
    if(this.id == null || this.id == ''){
      /**
       * Save a new record
       */
      this.spinner.show()
      await this.http.post<ISubClass>(API_URL+'/sub_classes/create', subClass, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name
          
          alert('Sub Class created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create sub class')
        }
      )

    }else{
      /**
       * Update an existing record
       */
      this.spinner.show()
      await this.http.put<ISubClass>(API_URL+'/sub_classes/update', subClass, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.id   = data?.id
          this.name = data!.name 
          alert('Sub Class updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update sub class')
        }
      )
    }
  }
  async getAll(){
    /**
     * 'Get all the records
     */
    this.subClasses = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ISubClass[]>(API_URL+'/sub_classes', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.subClasses.push(element)
        })
        console.log(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load sub classes')
      }
    )
  }
  async get(id: any) {
    /**
     * Get a single record by id
     */
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ISubClass>(API_URL+'/sub_classes/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
        this.id = data?.id
        this.name = data!.name
        this.departmentName = data!.class_.department.name
        this.className = data!.class_.name 
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
    this.spinner.show()
    await this.http.get<ISubClass>(API_URL+'/sub_classes/get_by_name?name='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
        this.id             = data?.id
        this.name           = data!.name
        this.className      = data!.class_.name
        this.departmentName = data!.class_.department.name
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
     * Delete selected record by id
     */
    if(window.confirm('Confirm delete of the selected class') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      this.spinner.show()
      await this.http.delete(API_URL+'/sub_classes/delete?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Sub Class deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete sub class')
        }
      )
    }
  }

  

  clearData(){
    /**
     * Clear displayable data
     */
    this.id             = ''
    this.name           = ''
    this.className      = ''
    this.departmentName = ''
    this.unlockAll()
  }

  async loadDepartmentNames(){
    /**
     * Gets a list of department names
     */
    this.departmentNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IDepartment[]>(API_URL+'/departments', options)
    .pipe(finalize(() => this.spinner.hide()))
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

  async loadClassNames(departmentName : string){
    /**
     * Gets a list of class names
     */
    this.classNames = []
    this.className = ''
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IClass[]>(API_URL+'/classes/get_by_department_name?department_name='+departmentName, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.classNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load classes')
      }
    )
  }

  unlockAll(){
    this.inputsLocked      = false   
  }

  lockAll(){
    this.inputsLocked      = true
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}
export interface ISubClass {
  id     : any
  name   : string
  class_ : IClass
  
  save()                   : void
  getAll()                 : void
  get(id : any)            : any
  getByName(name : string) : any
  delete(id : any)         : any
}
