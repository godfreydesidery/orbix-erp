import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  companyId       : any;
  companyName     : string;
  contactName     : string;
  tin             : string;
  vrn             : string;
  physicalAddress : string;
  postCode        : string;
  postAddress     : string;
  telephone       : string;
  mobile          : string;
  email           : string;
  website         : string
  fax             : string;
  bankAccountName : string;
  bankPhysicalAddress: string;
  bankPostCode    : string;
  bankPostAddress : string;
  bankName        : string;
  bankAccountNo   : string;

  constructor(private http : HttpClient, 
              private auth : AuthService, 
              private sanitizer: DomSanitizer,
              private spinner : NgxSpinnerService) {
    this.companyId        = ''
    this.companyName      = ''
    this.contactName      = ''
    this.tin              = ''
    this.vrn              = ''
    this.physicalAddress  = ''
    this.postCode         = ''
    this.postAddress      = ''
    this.telephone        = ''
    this.mobile           = ''
    this.email            = ''
    this.website          = ''
    this.fax              = ''
    this.bankAccountName  = ''
    this.bankPhysicalAddress = ''
    this.bankPostCode     = ''
    this.bankPostAddress  = ''
    this.bankName         = ''
    this.bankAccountNo    = ''
  }

  async getLogo() : Promise<string> {
    var logo : any = ''
    await this.http.get<ICompany>(API_URL+'/company_profile/get_logo')
    .toPromise()
    .then(
      res => {
        var retrieveResponse : any = res
        var base64Data = retrieveResponse.logo
        logo = 'data:image/png;base64,'+base64Data
      }
    )
    .catch(error => {
      console.log(error)
    }) 
    return logo
  }

  async getCompanyProfile() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ICompanyProfile>(API_URL+'/company_profile/get', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.companyId        = data?.id
        this.companyName      = data!.companyName
        this.contactName      = data!.contactName
        this.tin              = data!.tin
        this.vrn              = data!.vrn
        this.physicalAddress  = data!.physicalAddress
        this.postCode         = data!.postCode
        this.postAddress      = data!.postAddress
        this.telephone        = data!.telephone
        this.mobile           = data!.mobile
        this.email            = data!.email
        this.website          = data!.website
        this.fax              = data!.fax
        this.bankAccountName  = data!.bankAccountName
        this.bankPhysicalAddress = data!.bankPhysicalAddress
        this.bankPostCode     = data!.bankPostCode
        this.bankPostAddress  = data!.bankPostAddress
        this.bankName         = data!.bankName
        this.bankAccountNo    = data!.bankAccountNo              
      }
    )
    .catch(
      (error) => {
        console.log(error)
      }
    )
  }

  async getAddress(){
    await this.getCompanyProfile()
    var cName = this.companyName
    var cPhysicalAddress = this.physicalAddress
    var cPostalAddress = 'P.O. Box '+this.postCode+' '+this.postAddress
    var cTelephone = 'Tel: '+this.telephone
    var cMobile = 'Mob: '+this.mobile
    var cFax = 'Fax: '+this.fax
    var cEmail = 'Email: '+this.email
    var cWebsite = this.website
    
    var address = [
      {text : cName, fontSize : 12, bold : true},
      {text : cPhysicalAddress, fontSize : 9},
      {text : cPostalAddress, fontSize : 9},
      {text : cTelephone, fontSize : 9},
      {text : cEmail, fontSize : 9, italic : true},
      {text : cWebsite, fontSize : 9, italic : true}
    ]
    return address
  }
}

export interface ICompany{
  logo : Byte[]
} 

export interface ICompanyProfile{
  id              : any
  companyName     : string
  retrievedImage  : any
  contactName     : string
  logo            : Byte[]
  tin             : string
  vrn             : string
  physicalAddress : string
  postCode        : string
  postAddress     : string
  telephone       : string
  mobile          : string
  email           : string
  website         : string
  fax             : string
  bankAccountName : string
  bankPhysicalAddress : string
  bankPostCode    : string
  bankPostAddress : string
  bankName        : string
  bankAccountNo   : string

  getCompanyProfile() : void
  saveCompanyProfile() : void
}
