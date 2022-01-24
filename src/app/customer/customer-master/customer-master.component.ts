import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.scss']
})
export class CustomerMasterComponent implements OnInit, ICustomer {

  public noLocked     : boolean = true
  public nameLocked   : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  id                  : any
  no                  : string
  name                : string
  contactName         : string
  active              : boolean
  tin                 : string
  vrn                 : string
  creditLimit         : number
  invoiceLimit        : number
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

  customers           : ICustomer[] = []
  names     : string[] =[]

  constructor(private auth : AuthService, 
              private http :HttpClient, 
              private spinner : NgxSpinnerService) {
    this.id                  = null
    this.no                  = ''
    this.name                = ''
    this.contactName         = ''
    this.active              = true
    this.tin                 = ''
    this.vrn                 = ''
    this.creditLimit         = 0
    this.invoiceLimit        = 0
    this.creditDays          = 0
    this.physicalAddress     = ''
    this.postCode            = ''
    this.postAddress         = ''
    this.telephone           = ''
    this.mobile              = ''
    this.email               = ''
    this.fax                 = ''
    this.bankAccountName     = ''
    this.bankPhysicalAddress = ''
    this.bankPostAddress     = ''
    this.bankPostCode        = ''
    this.bankName            = ''
    this.bankAccountNo       = ''
  }

  ngOnInit(): void {
    this.getAll()
    this.loadCustomerNames()
  }
  
  async save() {
    /**
      * Create a single customer
      */
    //validate inputs
    if(this.validateInputs() == false){
      return
    }

    var data = {
      id                  : this.id,
      no                  : this.no,
      name                : this.name,
      contactName         : this.contactName,
      active              : this.active,
      tin                 : this.tin,
      vrn                 : this.vrn,
      creditLimit         : this.creditLimit,
      invoiceLimit        : this.invoiceLimit,
      creditDays          : this.creditDays,
      physicalAddress     : this.physicalAddress,
      postCode            : this.postCode,
      postAddress         : this.postAddress,
      telephone           : this.telephone,
      mobile              : this.mobile,
      email               : this.email,
      fax                 : this.fax,
      bankAccountName     : this.bankAccountName,
      bankPhysicalAddress : this.bankPhysicalAddress,
      bankPostAddress     : this.bankPostAddress,
      bankPostCode        : this.bankPostCode,
      bankName            : this.bankName,
      bankAccountNo       : this.bankAccountNo
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    if (this.id == null || this.id == ''){
      //create a new user
      this.spinner.show()
      await this.http.post(API_URL+'/customers/create', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.showCustomer(data)
          alert('Customer created successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create customer')
        }
      )   
    }else{
      //update an existing user
      this.spinner.show()
      await this.http.put(API_URL+'/customers/update', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          console.log(data)
          alert('Customer updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error);
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update customer')
        }
      )   
    }
  }
  showCustomer(customer : any){
    /**
     * Display customer details, takes a json customer object
     * Args: customer object
     */
    this.id                  = customer['id']
    this.no                  = customer['no']
    this.name                = customer['name']
    this.contactName         = customer['contactName']
    this.active              = customer['active']
    this.tin                 = customer['tin']
    this.vrn                 = customer['vrn']
    this.creditLimit         = customer['creditLimit']
    this.invoiceLimit        = customer['invoiceLimit']
    this.creditDays          = customer['creditDays']
    this.physicalAddress     = customer['physicalAddress']
    this.postCode            = customer['postCode']
    this.postAddress         = customer['postAddress']
    this.telephone           = customer['telephone']
    this.mobile              = customer['mobile']
    this.email               = customer['email']
    this.fax                 = customer['fax']
    this.bankAccountName     = customer['bankAccountName']
    this.bankPhysicalAddress = customer['bankPhysicalAddress']
    this.bankPostAddress     = customer['bankPostAddress']
    this.bankPostCode        = customer['bankPostCode']
    this.bankName            = customer['bankName']
    this.bankAccountNo       = customer['bankAccountNo']
  }
  validateInputs() : boolean{
    let valid : boolean = true
    if(this.name == ''){
      alert('Empty name not allowed, please fill in the username field')
      return false
    }
    return valid
  }
  clearFields(){
    
    /**
     * Clear all the fields
     */
     this.id                  = null
     this.no                  = ''
     this.name                = ''
     this.contactName         = ''
     this.tin                 = ''
     this.vrn                 = ''
     this.creditLimit         = 0
     this.invoiceLimit        = 0
     this.creditDays          = 0
     this.physicalAddress     = ''
     this.postCode            = ''
     this.postAddress         = ''
     this.telephone           = ''
     this.mobile              = ''
     this.email               = ''
     this.fax                 = ''
     this.bankAccountName     = ''
     this.bankPhysicalAddress = ''
     this.bankPostAddress     = ''
     this.bankPostCode        = ''
     this.bankName            = ''
     this.bankAccountNo       = ''
     this.unlockAll()
    if (this.id == null || this.id == '') {
      this.noLocked = true
    }
  }
  async getAll(): Promise<void> {
    this.customers = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }

    await this.http.get<ICustomer[]>(API_URL + '/customers', options)
      .toPromise()
      .then(
        data => {
          data?.forEach(
            element => {
              this.customers.push(element)
            }
          )
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load customers')
      })
    return
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    this.spinner.show
    await this.http.get(API_URL + '/customers/get?id=' + id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.showCustomer(data)
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
      this.name = ''
    }
    if (no != '') {
      this.spinner.show()
      await this.http.get(API_URL + '/customers/get_by_no?no=' + no, options)
        .pipe(finalize(() => this.spinner.hide()))
        .toPromise()
        .then(
          data => {
            this.showCustomer(data)
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
      await this.http.get(API_URL + '/customers/get_by_name?name=' + name, options)
        .pipe(finalize(() => this.spinner.hide()))
        .toPromise()
        .then(
          data => {
            this.showCustomer(data)
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
      alert('No customer selected, please select a customer to delete')
      return
    }
    if(!confirm('Confirm delete the selected customer. This action can not be undone')){
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.delete(API_URL+'/customers/delete?id='+this.id, options)
    .toPromise()
    .then(
      () => {
        this.clearFields()
        alert('Customer deleted succesifully')
        return true
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete customer profile')
        return false
      }
    )
  }

  unlockAll(){
    this.noLocked     = false 
    this.nameLocked   = false
    this.inputsLocked = false
  }

  lockAll(){
    this.noLocked     = true
    this.nameLocked   = true
    this.inputsLocked = true
  }

  async loadCustomerNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/customers/get_names', options)
    .toPromise()
    .then(
      data => {
        this.names = []
        data?.forEach(element => {
          this.names.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load product descriptions')
      }
    )
  }

  

}

export interface ICustomer {
  /**
   * Basic Inf
   */
  id          : any
  name        : string
  contactName : string 
  active      : boolean 
  tin         : string
  vrn         : string
  /**
   * Credit Inf
   */
  creditLimit  : number
  invoiceLimit : number
  creditDays   : number
  /**
   * Contact Inf
   */
  physicalAddress : string
  postCode        : string
  postAddress     : string
  telephone       : string
  mobile          : string
  email           : string
  fax             : string
  /**
   * Bank Inf
   */
  bankAccountName     : string
  bankPhysicalAddress : string
  bankPostAddress     : string
  bankPostCode        : string
  bankName            : string
  bankAccountNo       : string

  save()         : void
  getAll()       : void
  get(id : any)  : any
  getByNoOrName(no : string, name : string) : any
  delete()       : any
}