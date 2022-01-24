import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.scss']
})
export class SupplierMasterComponent implements OnInit, ISupplier {

  public codeLocked   : boolean = true
  public nameLocked   : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  id                  : any
  code                : string
  name                : string
  contactName         : string
  active              : boolean
  tin                 : string
  vrn                 : string
  termsOfContract     : string
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

  suppliers : ISupplier[] = []
  names     : string[] =[]

  constructor(private shortcut : ShortCutHandlerService, 
              private http : HttpClient, 
              private auth : AuthService, 
              private spinner : NgxSpinnerService) {
    this.id                  = ''
    this.code                = ''
    this.name                = ''
    this.contactName         = ''
    this.active              = true
    this.tin                 = ''
    this.vrn                 = ''
    this.termsOfContract     = ''
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
    this.loadSupplierNames()
  }

  async save() {
    /**
      * Create a single supplier
      */
    //validate inputs
    if(this.validateInputs() == false){
      return
    }

    var data = {
      id                  : this.id,
      code                : this.code,
      name                : this.name,
      contactName         : this.contactName,
      active              : this.active,
      tin                 : this.tin,
      vrn                 : this.vrn,
      termsOfContract     : this.termsOfContract,
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
      await this.http.post(API_URL+'/suppliers/create', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          this.showSupplier(data)
          alert('Supplier created successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create supplier')
        }
      )   
    }else{
      //update an existing user
      this.spinner.show()
      await this.http.put(API_URL+'/suppliers/update', data, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
          console.log(data)
          alert('Supplier updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          console.log(error);
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update supplier')
        }
      )   
    }
  }

  showSupplier(supplier : any){
    /**
     * Display customer details, takes a json customer object
     * Args: customer object
     */
    this.id                  = supplier['id']
    this.code                = supplier['code']
    this.name                = supplier['name']
    this.contactName         = supplier['contactName']
    this.active              = supplier['active']
    this.tin                 = supplier['tin']
    this.vrn                 = supplier['vrn']
    this.termsOfContract     = supplier['termsOfContract']
    this.physicalAddress     = supplier['physicalAddress']
    this.postCode            = supplier['postCode']
    this.postAddress         = supplier['postAddress']
    this.telephone           = supplier['telephone']
    this.mobile              = supplier['mobile']
    this.email               = supplier['email']
    this.fax                 = supplier['fax']
    this.bankAccountName     = supplier['bankAccountName']
    this.bankPhysicalAddress = supplier['bankPhysicalAddress']
    this.bankPostAddress     = supplier['bankPostAddress']
    this.bankPostCode        = supplier['bankPostCode']
    this.bankName            = supplier['bankName']
    this.bankAccountNo       = supplier['bankAccountNo']
  }
  validateInputs() : boolean{
    let valid : boolean = true
    if(this.name == ''){
      alert('Empty name not allowed, please fill in the name field')
      return false
    }
    return valid
  }
  clearFields() {
    /**
     * Clear all the fields
     */
    this.id = ''
    this.code = ''
    this.name = ''
    this.contactName = ''
    this.tin = ''
    this.vrn = ''
    this.termsOfContract = ''
    this.physicalAddress = ''
    this.postCode = ''
    this.postAddress = ''
    this.telephone = ''
    this.mobile = ''
    this.email = ''
    this.fax = ''
    this.bankAccountName = ''
    this.bankPhysicalAddress = ''
    this.bankPostAddress = ''
    this.bankPostCode = ''
    this.bankName = ''
    this.bankAccountNo = ''
    this.unlockAll()
    if (this.id == null || this.id == '') {
      this.codeLocked = true
    }
  }
  async getAll(): Promise<void> {
    this.suppliers = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ISupplier[]>(API_URL+'/suppliers', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.suppliers.push(element)
          }
        )
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load suppliers')
    })
    return 
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get(API_URL+'/suppliers/get?id='+id, options)
    .toPromise()
    .then(
      data=>{
        this.lockAll()
        this.showSupplier(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
      }
    )
  }
  async getByCodeOrName(code : string, name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if(code != ''){
      this.name = ''
    }
    if(code != ''){
      await this.http.get(API_URL+'/suppliers/get_by_code?code='+code, options)
      .toPromise()
      .then(
        data=>{
          this.lockAll()
          this.showSupplier(data)
        }
      )
      .catch(
        error=>{
          console.log(error)        
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
        }
      )
    }else{
      await this.http.get(API_URL+'/suppliers/get_by_name?name='+name, options)
      .toPromise()
      .then(
        data=>{
          this.lockAll()
          this.showSupplier(data)
        }
      )
      .catch(
        error=>{
          console.log(error)        
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested record could not be found')
        }
      )
    }
  }
  async delete() {
    if(this.id == null || this.id == ''){
      alert('No supplier selected, please select a supplier to delete')
      return
    }
    if(!confirm('Confirm delete the selected supplier. This action can not be undone')){
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.delete(API_URL+'/suppliers/delete?id='+this.id, options)
    .toPromise()
    .then(
      () => {
        this.clearFields()
        this.getAll()
        alert('Supplier deleted succesifully')
        return true
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete supplier profile')
        return false
      }
    )
  }

  async loadSupplierNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/suppliers/get_names', options)
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

  unlockAll(){
    this.codeLocked   = false 
    this.nameLocked   = false
    this.inputsLocked = false
  }

  lockAll(){
    this.codeLocked   = true
    this.nameLocked   = true
    this.inputsLocked = true
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}

export interface ISupplier {
  /**
   * Basic Inf
   */
  id         : any
  code : string
  name   : string
  contactName   : string 
  active : boolean 
  tin : string
  vrn : string
  /**
   * Contract Inf
   */
  termsOfContract : string
  /**
   * Contact Inf
   */
  physicalAddress : string
  postCode : string
  postAddress : string
  telephone : string
  mobile : string
  email : string
  fax : string
  /**
   * Bank Inf
   */
  bankAccountName : string
  bankPhysicalAddress : string
  bankPostAddress : string
  bankPostCode : string
  bankName : string
  bankAccountNo : string

  save() : void
  getAll() : void
  get(id : any) : any
  getByCodeOrName(code : string, name : string) : any
  delete() : any
}
