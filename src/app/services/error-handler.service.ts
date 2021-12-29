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
      displayMessage = displayMessage+'. Access denied.'
    }
    if(httpError.statusText == 'Unknown Error'){
      displayMessage = 'Operation failed. Unknown Error. Please check Connection'
    }
    alert(displayMessage)
  }
}
