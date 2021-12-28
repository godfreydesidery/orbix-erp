import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IUser } from 'src/app/models/user';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.component.html',
  styleUrls: ['./biometrics.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
})
export class BiometricsComponent implements OnInit {
  closeResult = ''

  public rollNo : string = ''
  public name   : string = ''


  public users           : IUser[] = []

  constructor(private auth : AuthService, private http : HttpClient, private modalService: NgbModal) {
    
   }

  ngOnInit(): void {
    this.getUsers()
  }

  async getUsers(){
    this.users = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IUser[]>(API_URL+'/users', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.users.push(element)
          }
        )
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load users')
    })
    return 
  }


  open(content: any, username : string) {
    this.getUser(username)

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async getUser(username: string) {

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IUser>(API_URL+'/users/get_user?username='+username, options)
    .toPromise()
    .then(
      data=>{
        this.rollNo = data!.rollNo
        this.name = data!.lastName+', '+data!.firstName
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }

  async saveBiometric(username : string){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.post(API_URL+'/users/save_biometric', options)
    .toPromise()
    .then(
      data=>{
        
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }
  
}
