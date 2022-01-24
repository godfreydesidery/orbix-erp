import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { IClass } from '../class/class.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, IDepartment {

  public inputsLocked      : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  id          : any;
  name        : string;
  dapartments : IDepartment[] = []

  constructor(private shortcut : ShortCutHandlerService, 
              private auth : AuthService, 
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
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
      this.spinner.show()
      await this.http.post<IDepartment>(API_URL+'/departments/create', department, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.showDepartment(data)     
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
      this.spinner.show()
      await this.http.put<IDepartment>(API_URL+'/departments/update', department, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.showDepartment(data) 
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
    this.spinner.show()
    await this.http.get<IDepartment[]>(API_URL+'/departments', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IDepartment>(API_URL+'/departments/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
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
  async getByName(name: string) {
    /**
     * Find a record by name
     */
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get(API_URL+'/departments/get_by_name?name='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
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
      this.spinner.show()
      await this.http.delete(API_URL+'/departments/delete?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
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
    this.unlockAll()
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

export interface IDepartment {
  id         : any
  name   : string
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}
