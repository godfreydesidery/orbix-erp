import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ] 
})
export class GrnComponent implements OnInit {

  closeResult    : string = ''
  
  id             : any;
  no             : string;
  grnDate        : Date;
  orderNo        : string
  invoiceNo      : string
  invoiceAmount  : number
  status         : string;
  comments!      : string
  created        : string;
  approved       : string;

  grnDetails     : IGrnDetail[]
  grns           : IGrn[]

  //detail
  detailId             : any
  qtyOrdered           : number
  qtyReceived          : number
  clientPriceVatIncl   : number
  clientPriceVatExcl   : number
  supplierPriceVatIncl : number
  supplierPriceVatExcl : number
  packSize             : number
  product!             : IProduct

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService : NgbModal) {
    this.id            = null
    this.no            = ''
    this.grnDate       = new Date()
    this.orderNo       = ''
    this.invoiceNo     = ''
    this.invoiceAmount = 0
    this.status        = ''
    this.comments      = ''
    this.created       = ''
    this.approved      = ''
    this.grnDetails    = []
    this.grns          = []

    /**
     * Detail
     */
    this.detailId             = ''
    this.qtyOrdered           = 0
    this.qtyReceived          = 0
    this.clientPriceVatIncl   = 0
    this.clientPriceVatExcl   = 0
    this.supplierPriceVatIncl = 0
    this.supplierPriceVatExcl = 0
    this.packSize             = 1
   

  }

  ngOnInit(): void {
    this.loadGrns()  
  }

  async save() {   
    if(this.grnDate == null){
      alert('Order date required')
      return
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    var grn = {
      id            : this.id,
      grnDate       : this.grnDate,
      invoiceNo     : this.invoiceNo,
      invoiceAmount : this.invoiceAmount,
      orderNo       : this.orderNo,
      lpo           : { no : this.orderNo},
      comments      : this.comments
    }
    if(this.id == null || this.id == ''){   
      await this.http.post<IGrn>(API_URL+'/grns/create', grn, options)
      .toPromise()
      .then(
        data => {
          this.show(data!)
          this.loadGrns()
          alert('GRN Created successifully')
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save GRN')
        }
      )
    }else{
      await this.http.put<IGrn>(API_URL+'/grns/update', grn, options)
      .toPromise()
      .then(
        data => {
          console.log(data)
          this.show(data!)
          this.loadGrns()
          alert('GRN Updated successifully')
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update GRN')
        }
      )
    }
  }

  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IGrn>(API_URL+'/grns/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.show(data!)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load GRN')
      }
    )
  }

  async getByNo(no: string) {
    if(no == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IGrn>(API_URL+'/grns/get_by_no?no='+no, options)
    .toPromise()
    .then(
      data => {
        this.show(data!)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load GRN')
      }
    )
  }

  show(data : IGrn){
    this.id           = data?.id
    this.no           = data!.no
    this.grnDate      = data!.grnDate
    this.orderNo      = data!.orderNo
    this.invoiceNo    = data!.invoiceNo
    this.invoiceAmount= data!.invoiceAmount
    this.status       = data!.status
    this.comments     = data!.comments
    this.created      = data!.created
    this.approved     = data!.approved
    this.grnDetails   = data!.grnDetails
  }

  async approve(id: any) {
    if(!window.confirm('Confirm approval of the selected GRN')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var grn = {
      id : id   
    }
    await this.http.put(API_URL+'/grns/approve', grn, options)
    .toPromise()
    .then(
      () => {
        this.loadGrns()
        this.get(id)
        alert('Received succesifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not approve')
      }
    )
  }

  async cancel(id: any) {
    if(!window.confirm('Confirm canceling of the selected GRN')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var grn = {
      id : id   
    }
    await this.http.put(API_URL+'/grns/cancel', grn, options)
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadGrns()
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not cancel')
      }
    )
  }

  async archive(id: any) {
    if(id == null || id == ''){
      window.alert('Please select GRN to archive')
      return
    }
    if(!window.confirm('Confirm archiving of the selected GRN')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var grn = {
      id : id   
    }
    await this.http.put<boolean>(API_URL+'/grns/archive', grn, options)
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadGrns()
        alert('GRN archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  async archiveAll() {
    if(!window.confirm('Confirm archiving GRNs. All RECEIVED GRNs will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    
    await this.http.put<boolean>(API_URL+'/grns/archive_all', null, options)
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadGrns()
        alert('GRNs archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  delete(id: any) {
    throw new Error('Method not implemented.');
  }
  
  async getDetailss(id: any) {
    if(id == ''){
      return
    }
    this.grnDetails = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IGrnDetail[]>(API_URL+'/grn_details/get_by_grn?id='+id, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.grnDetails.push(element)
        })
        
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    )
  }

  async getDetail(id : any){
    this.clearDetail()
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IGrnDetail>(API_URL+'/grn_details/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.detailId             = data?.id
        this.qtyOrdered           = data!.qtyOrdered
        this.qtyReceived          = data!.qtyReceived
        this.clientPriceVatIncl   = data!.clientPriceVatIncl
        this.clientPriceVatExcl   = data!.clientPriceVatExcl
        this.supplierPriceVatIncl = data!.supplierPriceVatIncl
        this.supplierPriceVatExcl = data!.supplierPriceVatExcl
        this.product              = data!.product
      }
    )
  }

  saveDetail(){
    /**
     * To save GRN detail,
     * First validate detail, if valid, save else, reject
     */
    if(this.detailId == null || this.detailId == ''){
      alert('Could not process. Detail not selected')
      return
    }   
    if(isNaN(this.supplierPriceVatIncl) || this.supplierPriceVatIncl < 0){
      alert('Invalid Cost price, cost price must be a positive number')
      return
    }
    if(isNaN(this.qtyReceived) || this.qtyReceived < 0){
      alert('Invalid Quantity, quantity must be a positive number')
      return
    }

     let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    var detail = {
      id                   : this.detailId,
      qtyOrdered           : this.qtyOrdered,
      qtyReceived          : this.qtyReceived,
      supplierPriceVatIncl : this.supplierPriceVatIncl,
      grn                  : {id : this.id}
    }

    this.http.post<IGrnDetail>(API_URL+'/grn_details/save', detail ,options)
    .toPromise()
    .then(
      () => {
        this.get(this.id)        
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save detail')
      }
    )

  }

  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }
  
  loadGrns(){
    this.grns = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    this.http.get<IGrn[]>(API_URL+'/grns', options)
    .toPromise()
    .then(
      data => {
        console.log(data)
        data?.forEach(element => {
          this.grns.push(element)
        })
      }
    )
  }

  clear(){
    this.id           = null
    this.no           = ''
    this.grnDate      = new Date()
    this.orderNo      = ''
    this.invoiceNo    = ''
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.grnDetails   = []
  }

  clearDetail(){
    this.detailId             = null
    this.qtyOrdered           = 0
    this.qtyReceived          = 0
    this.clientPriceVatIncl   = 0
    this.clientPriceVatExcl   = 0
    this.supplierPriceVatIncl = 0
    this.supplierPriceVatExcl = 0
    this.packSize             = 1
    this.product!
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any, id : any) {  
    this.getDetail(id)
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',  size: 'lg' }).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.clearDetail()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

interface IGrn{
  id            : any
  no            : string
  orderNo       : string
  lpo           : ILpo
  invoiceNo     : string
  invoiceAmount : number
  status        : string
  comments      : string
  grnDate       : Date
  created       : string
  approved      : string
  grnDetails    : IGrnDetail[]
}

interface IGrnDetail{
  id                   : any
  qtyOrdered           : number
  qtyReceived          : number
  clientPriceVatIncl   : number
  clientPriceVatExcl   : number
  supplierPriceVatIncl : number
  supplierPriceVatExcl : number
  product              : IProduct
}

interface ILpo{
  id           : any
  no           : string
}

interface IProduct{
  id               : any
  barcode          : string
  code             : string
  description      : string
  packSize         : number
  costPriceVatIncl : number
  costPriceVatExcl : number
}