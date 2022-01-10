import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class AllocationComponent implements OnInit {

  closeResult    : string = ''

  blank          : boolean = false
  
  id             : any
  customer!      : ICustomer
  customerId     : any
  customerNo!    : string
  customerName!  : string
  customerBalance! :number
  invoices       : ISalesInvoice[]
  
  customerNames  : string[] = []

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService) {

    this.invoices = [] 
  }

  ngOnInit(): void {
    this.loadCustomerNames()
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  async loadCustomerNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/customers/get_names', options)
    .toPromise()
    .then(
      data => {
        this.customerNames = []
        data?.forEach(element => {
          this.customerNames.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load customer names')
      }
    )
  }

  async searchCustomer(name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ICustomer>(API_URL+'/customers/get_by_name?name='+name, options)
    .toPromise()
    .then(
      data=>{
        this.customerId = data?.id
        this.customerNo = data!.no
        this.customerBalance = data!.balance
        this.loadCustomerInvoices(this.customerId)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('Customer not found')
        this.customerId = ''
        this.customerNo = ''
        this.customerName = ''
      }
    )
  }

  async loadCustomerInvoices(customerId : any){
    this.invoices = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ISalesInvoice[]>(API_URL+'/sales_invoices/customer?id='+customerId, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.invoices.push(element)
        })
      }
    )
  }

  async allocate(customerId : any, invoiceId : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.post<boolean>(API_URL+'/allocations/allocate?customer_id='+customerId+'&sales_invoice_id='+invoiceId, null, options)
    .toPromise()
    .then(
      () => {
        this.loadCustomerInvoices(this.customerId)
        alert('Allocated successifully')
      }
    )
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not allocate')
    })
  }

}

interface ICustomer{
  id                  : any
  no                  : string
  name                : string
  contactName         : string
  active              : boolean
  tin                 : string
  vrn                 : string
  creditLimit         : number
  invoiceLimit        : number
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


interface ISalesInvoice{
  id           : any
  no           : string
  customer     : ICustomer
  status       : string
  comments     : string
  invoiceDate  : Date
  balance      : number
  validUntil   : Date
  created      : string
  approved     : string
}
