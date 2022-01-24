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

  getAddress(){
    return [
      {text : 'Bumaco Holdings Ltd', fontSize : 12, bold : true},
      {text : 'Kinondoni, Dar es Salaam', fontSize : 9},
      {text : 'P.O. Box 200, Dar es Salaam', fontSize : 9},
      {text : 'Tel: 0712765360', fontSize : 9},
      {text : 'Email: desideryg@gmail.com', fontSize : 9, italic : true},
    ]
  }
}

export interface ICompany{
  logo : Byte[]
}        
