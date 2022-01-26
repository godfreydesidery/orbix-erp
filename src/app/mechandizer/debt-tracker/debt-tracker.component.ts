import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-debt-tracker',
  templateUrl: './debt-tracker.component.html',
  styleUrls: ['./debt-tracker.component.scss']
})
export class DebtTrackerComponent implements OnInit {
  closeResult    : string = ''

  blank          : boolean = false
  
  id             : any
  employee!      : IEmployee
  employeeId     : any
  employeeNo!    : string
  employeeName!  : string
  employeeBalance! :number
  debts       : IDebt[]
  
  employeeNames  : string[] = []

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService,
              private spinner: NgxSpinnerService) {

    this.debts = [] 
  }

  ngOnInit(): void {
    this.loadEmployeeNames()
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  async loadEmployeeNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/employees/get_aliases', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.employeeNames = []
        data?.forEach(element => {
          this.employeeNames.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load employee names')
      }
    )
  }

  async searchEmployee(name: string) {
    if (name == '') {
      this.employeeId = ''
      this.employeeNo = ''
      this.employeeBalance = 0
      this.debts = []
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    this.spinner.show()
    await this.http.get<IEmployee>(API_URL+'/employees/get_by_alias?alias='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.employeeId = data?.id
        this.employeeNo = data!.no
        this.employeeBalance = data!.balance
        this.loadEmployeeDebts(this.employeeId)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('Employee not found')
        this.employeeId = ''
        this.employeeNo = ''
        this.employeeName = ''
      }
    )
  }

  async loadEmployeeDebts(employeeId : any){
    this.debts = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.hide()
    await this.http.get<IDebt[]>(API_URL+'/debts/employee?id='+employeeId, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        console.log(data)
        data?.forEach(element => {
          this.debts.push(element)
        })
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load debts')
    })
  }

  async allocate(employeeId : any, debtId : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.post<boolean>(API_URL+'/debt_allocations/allocate?employee_id='+employeeId+'&debt_id='+debtId, null, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.searchEmployee(this.employeeName)
        alert('Allocated successifully')
      }
    )
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not allocate')
    })
  }

}

interface IEmployee{
  id                  : any
  no                  : string
  name                : string
  contactName         : string
  active              : boolean
  tin                 : string
  vrn                 : string
  creditLimit         : number
  debtLimit        : number
  balance             : number
  creditDays          : number
  physicalAddress     : string
  postCode            : string
  postAddress         : string
  telephone           : string
  mobile              : string
  email               : string
  fax                 : string
  bankAccountName     : string
  bankPhysicalAddress : string
  bankPostAddress     : string
  bankPostCode        : string
  bankName            : string
  bankAccountNo       : string
}


interface IDebt{
  id           : any
  no           : string
  employee     : IEmployee
  status       : string
  comments     : string
  debtDate  : Date
  balance      : number
  validUntil   : Date
  created      : string
  approved     : string
}