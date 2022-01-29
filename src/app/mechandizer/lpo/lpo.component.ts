import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { DataService } from 'src/app/services/data.service';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-lpo',
  templateUrl: './lpo.component.html',
  styleUrls: ['./lpo.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class LpoComponent implements OnInit {

  public lpoNoLocked  : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  closeResult    : string = ''

  blank : boolean = false

  logo!              : any 
  
  id             : any;
  no             : string;
  supplier!      : ISupplier;
  supplierId     : any
  supplierCode!  : string
  supplierName!  : string
  validityDays   : number;
  status         : string;
  orderDate!: Date;
  validUntil!: Date;
  comments!      : string
  created        : string;
  approved       : string;
  printed        : string;
  lpoDetails     : ILpoDetail[];
  lpos           : ILpo[]

  total          : number

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

  address : any

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private spinner: NgxSpinnerService,
              private data : DataService) {
    this.id           = ''
    this.no           = ''
    this.validityDays = 30
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.printed      = ''
    this.lpoDetails   = []
    this.lpos         = []

    this.total        = 0

    this.detailId         = ''
    this.productId        = ''
    this.barcode          = ''
    this.code             = ''    
    this.description      = ''
    this.qty              = 0
    this.costPriceVatIncl = 0
    this.costPriceVatExcl = 0
    this.packSize         = 1

    this.descriptions     = []
  }

  async ngOnInit(): Promise<void> {
    this.address = await this.data.getAddress()
    this.loadLpos()
    this.loadSupplierNames()
    this.loadProductDescriptions()
    this.logo = await this.data.getLogo()
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
      this.spinner.show() 
      await this.http.post<ILpo>(API_URL+'/lpos/create', lpo, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.supplierId   = data!.supplier.id
          this.supplierCode = data!.supplier.code
          this.supplierName = data!.supplier.name
          this.validityDays = data!.validityDays
          this.orderDate    =  data!.orderDate
          this.validUntil   = data!.validUntil
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.printed      = data!.printed
          this.getDetails(data?.id)
          alert('LPO Created successifully')
          this.blank = true
          this.loadLpos()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save LPO')
        }
      )
    }else{
      this.spinner.show()
      await this.http.put<ILpo>(API_URL+'/lpos/update', lpo, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          console.log(data)
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

  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ILpo>(API_URL+'/lpos/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
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
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
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
    this.spinner.show()
    await this.http.get<ILpo>(API_URL+'/lpos/get_by_no?no='+no, options)
    .pipe(finalize(() => this.spinner.hide()))
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
  async approve(id: any) {
    if(!window.confirm('Confirm approval of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : this.id   
    }
    this.spinner.show()
    this.http.put(API_URL+'/lpos/approve', lpo, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadLpos()
        this.get(id)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not approve')
      }
    )
  }

  async print(id: any) {
    if(!window.confirm('Confirm printing of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : this.id   
    }
    this.spinner.show()
    await this.http.put(API_URL+'/lpos/print', lpo, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadLpos()
        this.get(id)
        this.exportToPdf()
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
    this.spinner.show()
    this.http.put(API_URL+'/lpos/cancel', lpo, options)
    .pipe(finalize(() => this.spinner.hide()))
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
  
  async saveDetail() {
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
      this.spinner.show()
      await this.http.post(API_URL+'/lpo_details/save', detail, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        () => {
          this.clearDetail()
          this.getDetails(this.id)
          if(this.blank == true){
            this.blank = false
            this.loadLpos()
          }
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

  async getDetails(id: any) {
    if(id == ''){
      return
    }
    this.lpoDetails = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ILpoDetail[]>(API_URL+'/lpo_details/get_by_lpo?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.lpoDetails.push(element)
        })
        this.refresh()
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load LPO')
      }
    ) 
  }
  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }
  deleteDetail(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.delete(API_URL+'/lpo_details/delete?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
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

    this.spinner.show()
    this.http.get<ILpo[]>(API_URL+'/lpos', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.lpos.push(element)
        })
      }
    )
  }

  async archive(id: any) {
    if(id == null || id == ''){
      window.alert('Please select LPO to archive')
      return
    }
    if(!window.confirm('Confirm archiving of the selected LPO')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var lpo = {
      id : id   
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/lpos/archive', lpo, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadLpos()
        alert('LPO archived successifully')
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
    if(!window.confirm('Confirm archiving LPOs. All RECEIVED LPOs will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/lpos/archive_all', null, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadLpos()
        alert('LPOs archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  unlockAll(){
    this.lpoNoLocked  = false
    this.inputsLocked = false   
  }

  lockAll(){
    this.lpoNoLocked  = true
    this.inputsLocked = true
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
    this.orderDate!
    this.validUntil!

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

  refresh(){
    this.total = 0
    this.lpoDetails.forEach(element => {
      this.total = this.total + element.costPriceVatIncl*element.qty
    })
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  searchProduct(barcode : string, code : string, description : string){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if(barcode != ''){
      //search by barcode
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
      .pipe(finalize(() => this.spinner.hide()))
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
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
      .pipe(finalize(() => this.spinner.hide()))
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
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
      .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    this.http.get<IProduct>(API_URL+'/products/get?id='+productId, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    this.http.get<ILpoDetail>(API_URL+'/lpo_details/get?id='+detailId, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    this.http.get<IProduct>(API_URL+'/lpo_details/get_by_product_id_and_lpo_id?product_id='+productId+'lpo_id='+this.id, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/suppliers/get_names', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/products/get_descriptions', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<ISupplier>(API_URL+'/suppliers/get_by_name?name='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
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

  exportToPdf = () => {
    if(this.id == '' || this.id == null){
      return
    }
    var header = ''
    var footer = ''
    var title  = 'Local Purchase Order'
    var logo : any = ''
    var total : number = 0
    if(this.logo == ''){
      logo = { text : '', width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }else{
      logo = {image : this.logo, width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }
    var report = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9},
        {text : 'Qty', fontSize : 9},
        {text : 'Price', fontSize : 9},
        {text : 'Total', fontSize : 9}
      ]
    ]    
    this.lpoDetails.forEach((element) => {
      total = total + element.qty*element.costPriceVatIncl
      var detail = [
        {text : element.product.code.toString(), fontSize : 9}, 
        {text : element.product.description.toString(), fontSize : 9},
        {text : element.qty.toString(), fontSize : 9},  
        {text : element.costPriceVatIncl.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'},
        {text : (element.qty*element.costPriceVatIncl).toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'},        
      ]
      report.push(detail)
    })
    var detailSummary = [
      {text : '', fontSize : 9}, 
      {text : '', fontSize : 9},
      {text : '', fontSize : 9},  
      {text : 'Total', fontSize : 9},
      {text : total.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'},        
    ]
    report.push(detailSummary)
    const docDefinition = {
      header: '',
      watermark : { text : title, color: 'blue', opacity: 0.1, bold: true, italics: false },
        content : [
          {
            columns : 
            [
              logo,
              {width : 10, columns : [[]]},
              {
                width : 300,
                columns : [
                  this.address
                ]
              },
            ]
          },
          '  ',
          '  ',
          {text : title, fontSize : 12, bold : true},
          '  ',
          {
            layout : 'noBorders',
            table : {
              widths : [75, 300],
              body : [
                [
                  {text : 'LPO No', fontSize : 9}, 
                  {text : this.no, fontSize : 9} 
                ],
                [
                  {text : 'Supplier', fontSize : 9}, 
                  {text : this.supplierName, fontSize : 9} 
                ],
                [
                  {text : 'Status', fontSize : 9}, 
                  {text : this.status, fontSize : 9} 
                ]
              ]
            },
          },
          '  ',
          {
            table : {
                headerRows : 1,
                widths : ['auto', 230, 'auto', 70, 80],
                body : report
            }
        },
        ' ',
        ' ',   
        ' ',
        ' ',
        ' ',
        'Verified ____________________________________', 
        ' ',
        ' ',
        'Approved __________________________________',             
      ]     
    };
    pdfMake.createPdf(docDefinition).open(); 
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
