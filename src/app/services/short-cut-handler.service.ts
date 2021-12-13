import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from './error-handler.service';

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
    await this.http.post('/api/shortcuts/create?username='+username+'&name='+shortcut+'&link='+link, options)
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
}
