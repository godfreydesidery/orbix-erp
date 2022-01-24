import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class EmployeeRegisterComponent implements OnInit {

  public noLocked     : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableSave   : boolean = false

  id         : any
  no         : string
  rollNo     : string
  firstName  : string
  secondName : string
  lastName   : string
  alias      : string
  address    : string
  telephone  : string
  email      : string
  active     : boolean 

  employees  : IEmployee[] = []

  aliases     : string[] = []

  constructor(private shortcut : ShortCutHandlerService,
              private auth : AuthService, 
              private http :HttpClient, 
              private spinner : NgxSpinnerService) {
    this.id         = ''
    this.no         = ''
    this.rollNo     = ''
    this.firstName  = ''
    this.secondName = ''
    this.lastName   = ''
    this.alias      = ''
    this.address    = ''
    this.telephone  = ''
    this.email      = ''
    this.active     = true


  }

  ngOnInit(): void {
    this.getAll()
    this.loadEmployeeNames()
  }
  
  async save() {
    /**
      * Create a single employee
      */
    //validate inputs
    if(this.validateInputs() == false){
      return
    }

    var data = {
      id         : this.id,
      no         : this.no,
      rollNo     :this.rollNo,
      firstName  : this.firstName,
      secondName : this.secondName,
      lastName   : this.lastName,
      alias      : this.alias,
      address    : this.address,
      telephone  : this.telephone,
      email      : this.email,
      active     : this.active
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    if (this.id == null || this.id == ''){
      //create a new user
      this.spinner.show()
      await this.http.post(API_URL+'/employees/create', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.showEmployee(data)
          alert('Employee created successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create employee')
        }
      )   
    }else{
      //update an existing user
      this.spinner.show()
      await this.http.put(API_URL+'/employees/update', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          console.log(data)
          alert('Employee updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error);
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update employee')
        }
      )   
    }
  }
  showEmployee(employee : any){
    this.id         = employee['id']
    this.no         = employee['no']
    this.rollNo     = employee['rollNo']
    this.firstName  = employee['firstName']
    this.secondName = employee['secondName']
    this.lastName   = employee['lastName']
    this.alias      = employee['alias']
    this.address    = employee['address']
    this.telephone  = employee['telephone']
    this.email      = employee['email']
    this.active     = employee['active']
  }
  validateInputs() : boolean{
    let valid : boolean = true  
    return valid
  }
  clearFields(){
    this.id         = ''
    this.no         = ''
    this.rollNo     = ''
    this.firstName  = ''
    this.secondName = ''
    this.lastName   = ''
    this.alias      = ''
    this.address    = ''
    this.telephone  = ''
    this.email      = ''
    this.active     = true
     this.unlockAll()
    if (this.id == null || this.id == '') {
      this.noLocked = true
    }
  }
  async getAll(): Promise<void> {
    this.employees = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }

    await this.http.get<IEmployee[]>(API_URL + '/employees', options)
      .toPromise()
      .then(
        data => {
          data?.forEach(
            element => {
              this.employees.push(element)
            }
          )
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load employees')
      })
    return
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    this.spinner.show
    await this.http.get(API_URL + '/employees/get?id=' + id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.showEmployee(data)
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
        }
      )
  }

  async getByNoOrName(no: string, name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    if (no != '') {
      this.alias = ''
    }
    if (no != '') {
      this.spinner.show()
      await this.http.get(API_URL + '/employees/get_by_no?no=' + no, options)
        .pipe(finalize(() => this.spinner.hide()))
        .toPromise()
        .then(
          data => {
            this.showEmployee(data)
          }
        )
        .catch(
          error => {
            console.log(error)
            ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
          }
        )
    } else {
      this.spinner.show()
      await this.http.get(API_URL + '/employees/get_by_name?name=' + name, options)
        .pipe(finalize(() => this.spinner.hide()))
        .toPromise()
        .then(
          data => {
            this.showEmployee(data)
          }
        )
        .catch(
          error => {
            console.log(error)
            ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
          }
        )
    }
  }

  async delete() {
    if(this.id == null || this.id == ''){
      alert('No employee selected, please select a employee to delete')
      return
    }
    if(!confirm('Confirm delete the selected employee. This action can not be undone')){
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.delete(API_URL+'/employees/delete?id='+this.id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.clearFields()
        alert('Employee deleted succesifully')
        this.getAll()
        return true
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete employee profile')
        return false
      }
    )
  }

  unlockAll(){
    this.noLocked     = false 
    this.inputsLocked = false
  }

  lockAll(){
    this.noLocked     = true
    this.inputsLocked = true
  }

  async loadEmployeeNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/employees/get_names', options)
    .toPromise()
    .then(
      data => {
        this.aliases = []
        data?.forEach(element => {
          this.aliases.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load employees')
      }
    )
  }
}

export interface IEmployee {
  id         : any
  no         : string
  rollNo     : string
  firstName  : string
  secondName : string
  lastName   : string
  alias      : string
  address    : string
  telephone  : string
  email      : string
  active     : boolean 
}
