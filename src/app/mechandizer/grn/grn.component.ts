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
  supplier!      : ISupplier;
  supplierId     : any
  supplierCode!  : string
  supplierName!  : string
  validityDays   : number;
  status         : string;
  orderDate     : Date;
  validUntil    : Date;
  comments!      : string
  created        : string;
  approved       : string;
  printed        : string;
  lpoDetails     : ILpoDetail[];
  lpos           : ILpo[]

  supplierNames : string[] = []

  //detail
  detailId         : any
  barcode          : string
  productId        : any
  code             : string
  description      : string
  qty              : number
  costPriceVatIncl : number
  costPriceVatExcl : number
  packSize         : number

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal) {
      this.id           = ''
      this.no           = ''
      this.orderDate = new Date()
      this.validUntil = new Date()
      this.validityDays = 30
      this.status       = ''
      this.comments     = ''
      this.created      = ''
      this.approved     = ''
      this.printed      = ''
      this.lpoDetails   = []
      this.lpos         = []


      this.detailId         = ''
      this.productId        = ''
      this.barcode          = ''
      this.code             = ''    
      this.description      = ''
      this.qty              = 0
      this.costPriceVatIncl = 0
      this.costPriceVatExcl = 0
      this.packSize         = 1

      this.descriptions = []
    }

  ngOnInit(): void {
    this.loadLpos()
    this.loadSupplierNames()
    this.loadProductDescriptions()
  }

  async save() {
    if(this.supplierId == null || this.supplierId == ''){
      alert('Supplier information missing')
      return
    }
    if(this.orderDate == null){
      alert('Order date required')
      return
    }
    if (this.validityDays <= 0){
      alert('Please enter validity days')
      return
    }
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
      await this.http.post<ILpo>(API_URL+'/lpos/create', lpo, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.supplierId   = data!.supplier.id
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
          this.getDetails(data?.id)
          alert('LPO Created successifully')
          this.loadLpos()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save LPO')
        }
      )
    }else{
      await this.http.put<ILpo>(API_URL+'/lpos/update', lpo, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.supplierId   = data!.supplier.id
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
          this.getDetails(data?.id)
          alert('LPO Updated successifully')
          this.loadLpos()
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
    this.http.get<ILpo>(API_URL+'/lpos/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.id           = data?.id
        this.no           = data!.no
        this.supplierId   = data!.supplier.id
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
        this.getDetails(data?.id)
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
    this.http.get<ILpo>(API_URL+'/lpos/get_by_no?no='+no, options)
    .toPromise()
    .then(
      data => {
        this.id           = data?.id
        this.no           = data!.no
        this.supplierId   = data!.supplier.id
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
        this.getDetails(data?.id)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    )
  }
  approve(id: any) {
    if(!window.confirm('Confirm approval of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : this.id   
    }
    this.http.put(API_URL+'/lpos/approve', lpo, options)
    .toPromise()
    .then(
      () => {
        this.loadLpos()
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not approve')
      }
    )
  }

  print(id: any) {
    if(!window.confirm('Confirm printing of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : this.id   
    }
    this.http.put(API_URL+'/lpos/print', lpo, options)
    .toPromise()
    .then(
      () => {
        this.loadLpos()
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not print')
      }
    )
  }
  cancel(id: any) {
    if(!window.confirm('Confirm canceling of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : this.id   
    }
    this.http.put(API_URL+'/lpos/cancel', lpo, options)
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadLpos()
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not cancel')
      }
    )
  }
  delete(id: any) {
    throw new Error('Method not implemented.');
  }
  
  saveDetail() {
    if(this.supplierId == null || this.supplierId == ''){
      alert('Please enter supplier information')
      return
    }
    if(this.id == '' || this.id == null){
      /**
       * First Create a new LPO
       */
      alert('LPO not available, the system will create a new LPO')
      this.save()
    }else{
      /**
       * Enter LPO Detail
       */
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }   
      var detail = {
        lpo : {id : this.id},
        product : {id : this.productId, code : this.code},
        qty : this.qty,
        costPriceVatIncl : this.costPriceVatIncl,
        costPriceVatExcl : this.costPriceVatExcl
      }
      this.http.post(API_URL+'/lpo_details/save', detail, options)
      .toPromise()
      .then(
        () => {
          this.clearDetail()
          this.getDetails(this.id)
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save detail')
        }
      )
    }
  }

  getDetails(id: any) {
    if(id == ''){
      return
    }
    this.lpoDetails = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpoDetail[]>(API_URL+'/lpo_details/get_by_lpo?id='+id, options)
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
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.delete(API_URL+'/lpo_details/delete?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.getDetails(this.id)
      }
    )
    .catch(
      error => {ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not remove detail')
      }
    )
  }

  loadLpos(){
    this.lpos = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ILpo[]>(API_URL+'/lpos', options)
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
    this.validityDays = 30
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.printed      = ''
    this.lpoDetails   = []
    this.supplierCode = ''
    this.supplierName = ''
    this.orderDate    = new Date()
    this.validUntil   = new Date()

  }

  clearDetail(){
    this.detailId         = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.qty              = 0
    this.costPriceVatIncl = 0
    this.costPriceVatExcl = 0
    this.packSize         = 1
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any, productId : any, detailId :any) {
    if(this.supplierCode == '' || this.supplierCode == null){
      alert('Please enter supplier information')
      return
    }  
    if(productId != ''){
      this.searchDetail(productId, detailId)
    }
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  searchProduct(barcode : string, code : string, description : string){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if(barcode != ''){
      //search by barcode
      this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.code = data!.code
          this.description = data!.description
          this.costPriceVatIncl = data!.costPriceVatIncl
          this.costPriceVatExcl = data!.costPriceVatExcl
          this.packSize = data!.packSize
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }else if(code != ''){
      this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.code = data!.code
          this.description = data!.description
          this.costPriceVatIncl = data!.costPriceVatIncl
          this.costPriceVatExcl = data!.costPriceVatExcl
          this.packSize = data!.packSize
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }else{
      //search by description
      this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.code = data!.code
          this.description = data!.description
          this.costPriceVatIncl = data!.costPriceVatIncl
          this.costPriceVatExcl = data!.costPriceVatExcl
          this.packSize = data!.packSize
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }
  }

  searchDetail(productId : any, detailId :any){    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/products/get?id='+productId, options)
    .toPromise()
    .then(
      data => {
        this.productId = data!.id
        this.barcode = data!.barcode
        this.code = data!.code
        this.description = data!.description
        this.packSize = data!.packSize
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product')
    })

    this.http.get<ILpoDetail>(API_URL+'/lpo_details/get?id='+detailId, options)
    .toPromise()
    .then(
      data => {
        this.detailId = data!.id
        this.costPriceVatIncl = data!.costPriceVatIncl
        this.costPriceVatExcl = data!.costPriceVatExcl
        this.qty = data!.qty
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load detail information')
    })
  }

  getDetailByProductIdAndLpoId(productId : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/lpo_details/get_by_product_id_and_lpo_id?product_id='+productId+'lpo_id='+this.id, options)
    .toPromise()
    .then(
      data => {
        this.barcode = data!.barcode
        this.code = data!.code
        this.description = data!.description
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product')
    })
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

  async loadSupplierNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/suppliers/get_names', options)
    .toPromise()
    .then(
      data => {
        this.supplierNames = []
        data?.forEach(element => {
          this.supplierNames.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load suppliers names')
      }
    )
  }

  async loadProductDescriptions(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/products/get_descriptions', options)
    .toPromise()
    .then(
      data => {
        this.descriptions = []
        data?.forEach(element => {
          this.descriptions.push(element)
        })
        console.log(data)
      },
      error => {
        console.log(error)
        alert('Could not load product descriptions')
      }
    )
  }

  async searchSupplier(name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ISupplier>(API_URL+'/suppliers/get_by_name?name='+name, options)
    .toPromise()
    .then(
      data=>{
        this.supplierId = data?.id
        this.supplierCode = data!.code
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('Supplier not found')
        this.supplierId = ''
        this.supplierCode = ''
        this.supplierName = ''
      }
    )
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
  id               : any
  qty              : number
  costPriceVatIncl : number
  costPriceVatExcl : number
  product          : IProduct
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

interface ISupplier{
  id   : string
  code : string
  name : string
}

interface ISupplierName{
  names : string[]
}
