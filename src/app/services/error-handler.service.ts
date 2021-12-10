import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  public static showHttpErrorMessage(httpError : HttpErrorResponse, message : string, defaultMessage :  string) : void{
    if(message != ''){
      alert(message)
    }else{
      let errorCode = httpError['status']
      let errorMessage = httpError['error']
      let errorStatusText = httpError['statusText']
      if(typeof errorMessage === 'string'){
        if(errorMessage.includes('/')){
          alert(errorCode+': '+errorStatusText)
        }else{
          alert(errorMessage)
        }
      }else{
        alert(defaultMessage)
      }
    }
  }
}
