import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-till-administration',
  templateUrl: './till-administration.component.html',
  styleUrls: ['./till-administration.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
})
export class TillAdministrationComponent implements OnInit, ITill {
  closeResult : string = ''
  
  public id           : any
  public     no       : string
  public computerName : string
  public active : boolean

  public tills : ITill[]
  
  
  constructor(
    private auth : AuthService,
    private http :HttpClient,
    private shortcut : ShortCutHandlerService, 
    private modalService: NgbModal,
    private spinner : NgxSpinnerService) {
    this.id           = ''
    this.no           = ''
    this.computerName = ''
    this.active       = false

    this.tills        = []
  }

  ngOnInit(): void {
    this.loadTills()
  }

  public async saveTill(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var till = {
      id           : this.id,
      no       : this.no,
      computerName : this.computerName,
      active       : this.active
    }
    if(this.id == null || this.id == ''){
      //save a new till
      this.spinner.show()
      await this.http.post<ITill>(API_URL+'/tills/create', till, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no       = data!.no
          this.computerName = data!.computerName
          this.active       = data!.active
          alert('Till created successifully')
          this.loadTills()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create till')
        }
      )

    }else{
      //update an existing till
      this.spinner.show()
      await this.http.put<ITill>(API_URL+'/tills/update', till, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no       = data!.no
          this.computerName = data!.computerName
          this.active       = data!.active
          alert('Till updated successifully')
          this.loadTills()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update till')
        }
      )
    }
  }

  private clearData(){
    this.id           = ''
    this.no       = ''
    this.computerName = ''
    this.active       = false
  }

  public async deleteTill(id : any){
    if(window.confirm('Confirm delete of the selected till') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      this.spinner.show()
      await this.http.delete(API_URL+'/tills/delete?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Till deleted succesifully')
          this.loadTills()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete till')
        }
      )
    }
  }

  public async activateTill(id : any, active : boolean){
    if(active == true){
      return
    }
    if(window.confirm('Activate Selected till') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      this.spinner.show()
      await this.http.post(API_URL+'/tills/activate?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          alert('Till activate succesifully')
          this.loadTills()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not activate till')
        }
      )
    }
  }

  public async deactivateTill(id : any, active : boolean){
    if(active == false){
      return
    }
    if(window.confirm('Deactivate Selected till') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      this.spinner.show()
      await this.http.post(API_URL+'/tills/deactivate?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          alert('Till deactivated succesifully')
          this.loadTills()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not activate till')
        }
      )
    }
  }

  async loadTills(){
    this.tills = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ITill[]>(API_URL+'/tills', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.tills.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load tills')
      }
    )
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any, id : string) {
    if(id == ''){
      this.clearData()
    }
    this.getTill(id)
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

  async getTill(key: string) {
    if(key == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ITill>(API_URL+'/tills/get?id='+key, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.no = data!.no
        this.computerName = data!.computerName
        this.active = data!.active
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

export interface ITill{
  id           : any
  no           : string
  computerName : string
  active       : boolean


  saveTill() : void
  deleteTill(id : any) : void

}
