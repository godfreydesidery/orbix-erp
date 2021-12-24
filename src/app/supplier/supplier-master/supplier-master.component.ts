import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';

@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.scss']
})
export class SupplierMasterComponent implements OnInit, ISupplier {

  id                  : any
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

  constructor(private shortcut : ShortCutHandlerService, private http : HttpClient, private auth : AuthService) {
    this.id                  = ''
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
      await this.http.post('/api/suppliers/create', data, options)
      .toPromise()
      .then(
        data => {
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
      await this.http.put('/api/suppliers/update', data, options)
      .toPromise()
      .then(
        data => {
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
  clearFields(){
    
    /**
     * Clear all the fields
     */
     this.id                  = ''
     this.name                = ''
     this.contactName         = ''
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
  async getAll(): Promise<void> {
    this.suppliers = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ISupplier[]>('/api/suppliers', options)
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

    await this.http.get("api/suppliers/get?id="+id, options)
    .toPromise()
    .then(
      data=>{
        this.showSupplier(data)
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
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get("api/suppliers/get_by_name?name="+name, options)
    .toPromise()
    .then(
      data=>{
        this.showSupplier(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
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
    await this.http.delete('api/suppliers/delete?id='+this.id, options)
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
  getByName(name : string) : any
  delete() : any
}
