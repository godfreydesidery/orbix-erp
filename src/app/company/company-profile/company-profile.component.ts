import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, ICompanyProfile {

  id              : any;
  companyName     : string;
  contactName     : string;
  logo            : number;
  tin             : string;
  vrn             : string;
  physicalAddress : string;
  postCode        : string;
  postAddress     : string;
  telephone       : string;
  mobile          : string;
  email           : string;
  fax             : string;
  bankAccountName : string;
  bankPhysicalAddress: string;
  bankPostCode    : string;
  bankPostAddress : string;
  bankName        : string;
  bankAccountNo   : string;

  constructor(private http : HttpClient, private auth : AuthService) {
    this.id               = ''
    this.companyName      = ''
    this.contactName      = ''
    this.logo             = 0
    this.tin              = ''
    this.vrn              = ''
    this.physicalAddress  = ''
    this.postCode         = ''
    this.postAddress      = ''
    this.telephone        = ''
    this.mobile           = ''
    this.email            = ''
    this.fax              = ''
    this.bankAccountName  = ''
    this.bankPhysicalAddress = ''
    this.bankPostCode     = ''
    this.bankPostAddress  = ''
    this.bankName         = ''
    this.bankAccountNo    = ''
  }

  
  ngOnInit(): void {
    this.getCompanyProfile()
  }

  async getCompanyProfile() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ICompanyProfile>(API_URL+'/company_profile/get', options)
    .toPromise()
    .then(
      data => {
        this.id               = data?.id
        this.companyName      = data!.companyName
        this.contactName      = data!.contactName
        this.logo             = data!.logo
        this.tin              = data!.tin
        this.vrn              = data!.vrn
        this.physicalAddress  = data!.physicalAddress
        this.postCode         = data!.postCode
        this.postAddress      = data!.postAddress
        this.telephone        = data!.telephone
        this.mobile           = data!.mobile
        this.email            = data!.email
        this.fax              = data!.fax
        this.bankAccountName  = data!.bankAccountName
        this.bankPhysicalAddress      = data!.bankPhysicalAddress
        this.bankPostCode     = data!.bankPostCode
        this.bankPostAddress  = data!.bankPostAddress
        this.bankName         = data!.bankName
        this.bankAccountNo    = data!.bankAccountNo
        if(this.companyName == null){
          alert('Could not find company details')
        }
      }
    )
    .catch(
      () => {
        alert('Could not load company information')
      }
    )
  }
  async saveCompanyProfile() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var profile = {
      id               : this.id,
      companyName      : this.companyName,
      contactName      : this.contactName,
      logo             : this.logo,
      tin              : this.tin,
      vrn              : this.vrn,
      physicalAddress  : this.physicalAddress,
      postCode         : this.postCode,
      postAddress      : this.postAddress,
      telephone        : this.telephone,
      mobile           : this.mobile,
      email            : this.email,
      fax              : this.fax,
      bankAccountName  : this.bankAccountName,
      bankPhysicalAddress      : this.bankPhysicalAddress,
      bankPostCode     : this.bankPostCode,
      bankPostAddress  : this.bankPostAddress,
      bankName         : this.bankName,
      bankAccountNo    : this.bankAccountNo
    }
    await this.http.post<ICompanyProfile>(API_URL+'/company_profile/save', profile, options)
    .toPromise()
    .then(
      data => {
        this.id               = data?.id
        this.companyName      = data!.companyName
        this.contactName      = data!.contactName
        this.logo             = data!.logo
        this.tin              = data!.tin
        this.vrn              = data!.vrn
        this.physicalAddress  = data!.physicalAddress
        this.postCode         = data!.postCode
        this.postAddress      = data!.postAddress
        this.telephone        = data!.telephone
        this.mobile           = data!.mobile
        this.email            = data!.email
        this.fax              = data!.fax
        this.bankAccountName  = data!.bankAccountName
        this.bankPhysicalAddress      = data!.bankPhysicalAddress
        this.bankPostCode     = data!.bankPostCode
        this.bankPostAddress  = data!.bankPostAddress
        this.bankName         = data!.bankName
        this.bankAccountNo    = data!.bankAccountNo

        alert('Company details saved successifully')
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save company details')
      }
    )
  }


}

export interface ICompanyProfile{
  id              : any
  companyName     : string
  contactName     : string
  logo            : Byte
  tin             : string
  vrn             : string
  physicalAddress : string
  postCode        : string
  postAddress     : string
  telephone       : string
  mobile          : string
  email           : string
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
