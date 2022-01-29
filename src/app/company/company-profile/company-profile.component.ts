import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';


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
  logo            : Byte[];
  tin             : string;
  vrn             : string;
  physicalAddress : string;
  postCode        : string;
  postAddress     : string;
  telephone       : string;
  mobile          : string;
  email           : string;
  website         : string;
  fax             : string;
  bankAccountName : string;
  bankPhysicalAddress: string;
  bankPostCode    : string;
  bankPostAddress : string;
  bankName        : string;
  bankAccountNo   : string;

  logoUrl     : any

  constructor(private http : HttpClient, 
              private auth : AuthService, 
              private sanitizer: DomSanitizer, 
              private spinner : NgxSpinnerService) {
    this.id               = ''
    this.companyName      = ''
    this.contactName      = ''
    this.logo             = []
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

    this.logoUrl = ''
  }

  
  ngOnInit(): void {
    this.getCompanyProfile()
    this.getLogo()
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
        this.website          = data!.website
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
      (error) => {
        console.log(error)
        alert('Could not load company information')
      }
    )
    this.getLogo()
  }

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};


  async saveCompanyProfile() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var profile = {
      id               : this.id,
      companyName      : this.companyName,
      contactName      : this.contactName,
      //logo             : this.logo,
      tin              : this.tin,
      vrn              : this.vrn,
      physicalAddress  : this.physicalAddress,
      postCode         : this.postCode,
      postAddress      : this.postAddress,
      telephone        : this.telephone,
      mobile           : this.mobile,
      email            : this.email,
      website          : this.website,
      fax              : this.fax,
      bankAccountName  : this.bankAccountName,
      bankPhysicalAddress      : this.bankPhysicalAddress,
      bankPostCode     : this.bankPostCode,
      bankPostAddress  : this.bankPostAddress,
      bankName         : this.bankName,
      bankAccountNo    : this.bankAccountNo
    }
    this.spinner.show()
    await this.http.post<ICompanyProfile>(API_URL+'/company_profile/save', profile, options)
    .pipe(finalize(() => this.spinner.hide()))
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
        this.website          = data!.website
        this.fax              = data!.fax
        this.bankAccountName  = data!.bankAccountName
        this.bankPhysicalAddress      = data!.bankPhysicalAddress
        this.bankPostCode     = data!.bankPostCode
        this.bankPostAddress  = data!.bankPostAddress
        this.bankName         = data!.bankName
        this.bankAccountNo    = data!.bankAccountNo
        try{
          this.onUpload()
        }catch(e : any){}
        alert('Company details saved successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save company details')
      }
    )
    this.getLogo()
  }


  selectedFile!: File;
  retrievedImage!: any;
  base64Data: any;
  retrieveResponse: any;
  message!: string;
  imageName: any;
  //Gets called when the user selects an image
  public onFileChanged(event : any) {
    //Select File
    this.selectedFile = event.target.files[0];
  }
  //Gets called when the user clicks on submit to upload the image
  onUpload() {   
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    console.log(this.selectedFile);
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('logo', this.selectedFile, this.selectedFile.name);
    //Make a call to the Spring Boot Application to save the image
    this.spinner.show()
    this.http.post(API_URL+'/company_profile/save_logo', uploadImageData, options)
    .pipe(finalize(() => this.spinner.hide()))
      .subscribe(() => {
        alert('Upload succesiful')
      },
      error =>{
        alert('Upload failed')
      });
  }
  //Gets called when the user clicks on retieve image button to get the image from back end
  async getLogo() {
  //Make a call to Sprinf Boot to get the Image Bytes.
  this.spinner.show()
  await this.http.get(API_URL+'/company_profile/get_logo')
  .pipe(finalize(() => this.spinner.hide()))
  .toPromise()
    .then(
      res => {
        this.retrieveResponse = res
        this.base64Data = this.retrieveResponse.logo
        this.retrievedImage = 'data:image/png;base64,'+this.base64Data
        console.log(this.retrievedImage)
      }
    )
    .catch(error => {
      console.log(error)
    })    
  }
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

export interface ILogo{
  logo : Blob
}