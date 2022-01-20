import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ShortCutHandlerService {

  constructor(private auth : AuthService, private http : HttpClient) { }

  public async createShortCut(shortcut : string, link : string){
    let username : string = ''
    if(localStorage.getItem('username') != null){
      username = localStorage.getItem('username')!
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.post(API_URL+'/shortcuts/create?username='+username+'&name='+shortcut+'&link='+link, options)
      .toPromise()
      .then(
        data => {
          if(data == true){
            alert('Shortcut created successifully')
          }else{
            alert('Could not create shortcut, shortcut already exist')
          } 
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create shortcut')
        }
      )
  }
  public async removeShortCut(shortcut : string){
    let username : string = ''
    if(localStorage.getItem('username') != null){
      username = localStorage.getItem('username')!
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.post(API_URL+'/shortcuts/remove?username='+username+'&name='+shortcut, options)
      .toPromise()
      .then(
        data => {
          if(data == true){
            alert('Shortcut removed successifully')
          }else{
            alert('Could not remove shortcut, shortcut does not exist')
          } 
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create shortcut')
        }
      )
  }
}
