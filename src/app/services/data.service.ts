import { HttpClient } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http : HttpClient, private auth : AuthService, private sanitizer: DomSanitizer) { }



  public async getLogo(){
    //Make a call to Sprinf Boot to get the Image Bytes.
  await this.http.get<ICompany>(API_URL+'/company_profile/get_logo')
  .toPromise()
    .then(
      res => {
        var retrieveResponse : any
        var base64Data : any
        var retrievedImage : any
        retrieveResponse = res
        base64Data = retrieveResponse.logo
        retrievedImage = 'data:image/png;base64,'+base64Data
        return retrievedImage
      }
    )
    .catch(() => {
      return ''
    }) 
  }
}

export interface ICompany{
  logo : Byte[]
}        
