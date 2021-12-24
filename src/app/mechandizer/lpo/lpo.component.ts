import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-lpo',
  templateUrl: './lpo.component.html',
  styleUrls: ['./lpo.component.scss'],animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class LpoComponent implements OnInit {
  closeResult : string = ''
  
  id             : any;
  no             : string;
  supplier!      : ISupplier;
  supplierCode!  : string
  supplierName!  : string
  validityDays   : number;
  status         : string;
  orderDate!     : Date;
  validUntil!    : Date;
  comments!      : string
  created        : string;
  approved       : string;
  printed        : string;
  lpoDetails     : ILpoDetail[];

  lpos           : ILpo[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal) {
    this.id           = ''
    this.no           = ''
    this.validityDays = 0
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.printed      = ''

    this.lpoDetails   = []

    this.lpos         = []
  }
  ngOnInit(): void {
    this.loadLpos()
  }
  
  save() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id           : this.id,
      orderDate    : this.orderDate,
      validityDays : this.validityDays,
      validUntil   : this.validUntil,
      supplier     : {code : this.supplierCode, name : this.supplierName},
      comments     : this.comments
    }
    if(this.id == null || this.id == ''){   
      this.http.post<ILpo>('/api/lpos/create', lpo, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.supplierCode = data!.supplier.code
          this.supplierName = data!.supplier.name
          this.validityDays = data!.validityDays
          this.orderDate    = data!.orderDate
          this.validUntil   = data!.validUntil
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.printed      = data!.printed
          this.getDetail(data?.id)
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save LPO')
        }
      )
    }else{
      this.http.put<ILpo>('/api/lpos/update', lpo, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.supplierCode = data!.supplier.code
          this.supplierName = data!.supplier.name
          this.validityDays = data!.validityDays
          this.orderDate    = data!.orderDate
          this.validUntil   = data!.validUntil
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.printed      = data!.printed
          this.getDetail(data?.id)
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update LPO')
        }
      )
    }
  }
  get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpo>('/api/lpos/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.id           = data?.id
        this.no           = data!.no
        this.supplierCode = data!.supplier.code
        this.supplierName = data!.supplier.name
        this.validityDays = data!.validityDays
        this.orderDate    = data!.orderDate
        this.validUntil   = data!.validUntil
        this.status       = data!.status
        this.comments     = data!.comments
        this.created      = data!.created
        this.approved     = data!.approved
        this.printed      = data!.printed
        this.getDetail(data?.id)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    )
  }
  getByNo(no: string) {
    if(no == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpo>('/api/lpos/get_by_no?no='+no, options)
    .toPromise()
    .then(
      data => {
        this.id           = data?.id
        this.no           = data!.no
        this.supplierCode = data!.supplier.code
        this.supplierName = data!.supplier.name
        this.validityDays = data!.validityDays
        this.orderDate    = data!.orderDate
        this.validUntil   = data!.validUntil
        this.status       = data!.status
        this.comments     = data!.comments
        this.created      = data!.created
        this.approved     = data!.approved
        this.printed      = data!.printed
        this.getDetail(data?.id)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    )
  }
  approve(id: any) {
    throw new Error('Method not implemented.');
  }
  delete(id: any) {
    throw new Error('Method not implemented.');
  }
  
  saveDetail(id: any) {
    throw new Error('Method not implemented.');
  }
  getDetail(id: any) {
    if(id == ''){
      return
    }
    this.lpoDetails = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpoDetail[]>('/api/lpo_details/get_by_lpo?id='+id, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.lpoDetails.push(element)
        })
        
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    )

    console.log(this.lpoDetails)
  }
  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }
  deleteDetail(id: any) {
    throw new Error('Method not implemented.');
  }

  loadLpos(){
    this.lpos = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpo[]>('/api/lpos', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.lpos.push(element)
        })
      }
    )
  }

  clear(){
    this.id           = ''
    this.no           = ''
    this.validityDays = 0
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.printed      = ''
    this.lpoDetails   = []
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any, id : string) {
    //if(id == ''){
      //this.clearData()
   // }
    //this.getTill(id)
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

}

interface ILpo{
  id           : any
  no           : string
  supplier     : ISupplier
  validityDays : number
  status       : string
  comments     : string
  orderDate    : Date
  validUntil   : Date
  created      : string
  approved     : string
  printed      : string
  lpoDetails   : ILpoDetail[]
}

interface ILpoDetail{
  detailId         : any
  qty              : number
  costPriceVatIncl : number
  costPriceVatExcl : number
  product          : IProduct
}

interface IProduct{
  code        : string
  description : string
  packSize    : number
}

interface ISupplier{
  code : string
  name : string
}
