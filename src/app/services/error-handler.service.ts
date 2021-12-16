import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  public static showHttpErrorMessage(httpError : HttpErrorResponse, message : string, defaultMessage :  string) : void{
    var displayMessage = ''
    if(message != ''){
      displayMessage = message
    }else{
      let errorCode = httpError['status']
      let errorMessage = httpError['error']
      let errorStatusText = httpError['statusText']
      if(typeof errorMessage === 'string'){
        if(errorMessage.includes('/')){
          displayMessage = errorStatusText
        }else{
          displayMessage = errorMessage       
        }
      }else{
        displayMessage = defaultMessage
      }
    }
    if(httpError.statusText == 'Forbidden'){
      displayMessage = 'Access denied. '+displayMessage
    }
    alert(displayMessage)
  }
}
