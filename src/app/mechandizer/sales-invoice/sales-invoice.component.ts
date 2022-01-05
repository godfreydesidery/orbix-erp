import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class SalesInvoiceComponent implements OnInit {
  closeResult    : string = ''

  blank          : boolean = false
  
  id             : any
  no             : string
  customer!      : ICustomer
  customerId     : any
  customerNo!    : string
  customerName!  : string
  status         : string
  invoiceDate    : Date
  comments!      : string
  created        : string
  approved       : string
  invoiceDetails : ISalesInvoiceDetail[]
  invoices       : ISalesInvoice[]

  customerNames  : string[] = []

  //detail
  detailId            : any
  barcode             : string
  productId           : any
  code                : string
  description         : string
  qty                 : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal) {
    this.id               = ''
    this.no               = ''
    this.invoiceDate      = new Date()
    this.status           = ''
    this.comments         = ''
    this.created          = ''
    this.approved         = ''
    this.invoiceDetails   = []
    this.invoices         = []

    this.detailId            = ''
    this.barcode             = ''
    this.code                = ''    
    this.description         = ''
    this.qty                 = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0

    this.descriptions        = []
  }

  ngOnInit(): void {
    this.loadInvoices()
    this.loadCustomerNames()
    this.loadProductDescriptions()
  }
  
  async save() {
    if(this.customerId == null || this.customerId == ''){
      alert('Customer information missing')
      return
    }
    if(this.invoiceDate == null){
      alert('Invoice date required')
      return
    } 
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var sales_invoices = {
      id           : this.id,
      invoiceDate  : this.invoiceDate,
      customer     : {no : this.customerNo, name : this.customerName},
      comments     : this.comments
    }
    if(this.id == null || this.id == ''){   
      await this.http.post<ISalesInvoice>(API_URL+'/sales_invoices/create', sales_invoices, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no         
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Invoice Created successifully')
          this.blank = true
          this.loadInvoices()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save Invoice')
        }
      )
    }else{
      await this.http.put<ISalesInvoice>(API_URL+'/sales_invoices/update', sales_invoices, options)
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Invoice Updated successifully')
          this.loadInvoices()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update Invoice')
        }
      )
    }
  }

  get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ISalesInvoice>(API_URL+'/sales_invoices/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.id             = data?.id
        this.no             = data!.no
        this.customerId     = data!.customer.id
        this.customerNo     = data!.customer.no
        this.customerName   = data!.customer.name
        this.status         = data!.status
        this.comments       = data!.comments
        this.created        = data!.created
        this.approved       = data!.approved
        this.invoiceDetails = data!.salesInvoiceDetails
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Invoice')
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
    this.http.get<ISalesInvoice>(API_URL+'/sales_invoices/get_by_no?no='+no, options)
    .toPromise()
    .then(
      data => {
        this.id           = data?.id
        this.no           = data!.no 
        this.customerId   = data!.customer.id
        this.customerNo   = data!.customer.no
        this.customerName = data!.customer.name  
        this.status       = data!.status
        this.comments     = data!.comments
        this.created      = data!.created
        this.approved     = data!.approved
        this.invoiceDetails = data!.salesInvoiceDetails
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Invoice')
      }
    )
  }

  approve(id: any) {
    if(!window.confirm('Confirm approval of the selected Invoice')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var invoice = {
      id : this.id   
    }
    this.http.put(API_URL+'/sales_invoices/approve', invoice, options)
    .toPromise()
    .then(
      () => {
        this.loadInvoices()
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

  cancel(id: any) {
    if(!window.confirm('Confirm canceling of the selected Invoice')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var invoice = {
      id : this.id   
    }
    this.http.put(API_URL+'/sales_invoices/cancel', invoice, options)
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadInvoices()
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
    if(this.customerId == null || this.customerId == ''){
      alert('Please enter customer information')
      return
    }
    if(this.id == '' || this.id == null){
      /**
       * First Create a new Invoice
       */
      alert('Invoice not available, the system will create a new Invoice')
      this.save()
    }else{
      /**
       * Enter Invoice Detail
       */
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }   
      var detail = {
        salesInvoice : {id : this.id},
        product : {id : this.productId, code : this.code},
        qty : this.qty,
        sellingPriceVatIncl : this.sellingPriceVatIncl,
        sellingPriceVatExcl : this.sellingPriceVatExcl
      }
      await this.http.post(API_URL+'/sales_invoice_details/save', detail, options)
      .toPromise()
      .then(
        () => {
          this.clearDetail()
          this.get(this.id)
          if(this.blank == true){
            this.blank = false
            this.loadInvoices()
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

  getDetailss(id: any) {
    if(id == ''){
      return
    }
    this.invoiceDetails = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ISalesInvoiceDetail[]>(API_URL+'/sales_invoice_details/get_by_invoice?id='+id, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.invoiceDetails.push(element)
        })
        
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Invoice')
      }
    )

    console.log(this.invoiceDetails)
  }

  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }

  deleteDetail(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.delete(API_URL+'/sales_invoice_details/delete?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.get(this.id)
      }
    )
    .catch(
      error => {ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not remove detail')
      }
    )
  }

  loadInvoices(){
    this.invoices = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<ISalesInvoice[]>(API_URL+'/sales_invoices', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.invoices.push(element)
        })
      }
    )
  }

  async archive(id: any) {
    if(id == null || id == ''){
      window.alert('Please select Invoice to archive')
      return
    }
    if(!window.confirm('Confirm archiving of the selected Invoice')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var invoice = {
      id : id   
    }
    await this.http.put<boolean>(API_URL+'/sales_invoices/archive', invoice, options)
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadInvoices()
        alert('Invoice archived successifully')
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
    if(!window.confirm('Confirm archiving Invoices. All PAID Invoices will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    
    await this.http.put<boolean>(API_URL+'/sales_invoices/archive_all', null, options)
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadInvoices()
        alert('Invoices archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  clear(){
    this.id           = ''
    this.no           = ''
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.invoiceDetails   = []
    this.customerNo = ''
    this.customerName = ''
    this.invoiceDate    = new Date()
  }

  clearDetail(){
    this.detailId         = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.qty              = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0
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
      this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.code = data!.code
          this.description = data!.description
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
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
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
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
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
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
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product')
    })

    this.http.get<ISalesInvoiceDetail>(API_URL+'/sales_invoice_details/get?id='+detailId, options)
    .toPromise()
    .then(
      data => {
        this.detailId = data!.id
        this.sellingPriceVatIncl = data!.sellingPriceVatIncl
        this.sellingPriceVatExcl = data!.sellingPriceVatExcl
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
    this.http.get<IProduct>(API_URL+'/sales_invoice_details/get_by_product_id_and_invoice_id?product_id='+productId+'sales_invoice_id='+this.id, options)
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

  open(content : any, productId : string, detailId : string) {
    if(this.customerNo == '' || this.customerNo == null){
      alert('Please enter customer information')
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

  async loadCustomerNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<string[]>(API_URL+'/customers/get_names', options)
    .toPromise()
    .then(
      data => {
        this.customerNames = []
        data?.forEach(element => {
          this.customerNames.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load customer names')
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

  async searchCustomer(name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ICustomer>(API_URL+'/customers/get_by_name?name='+name, options)
    .toPromise()
    .then(
      data=>{
        this.customerId = data?.id
        this.customerNo = data!.no
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('Customer not found')
        this.customerId = ''
        this.customerNo = ''
        this.customerName = ''
      }
    )
  }
}

interface ISalesInvoice{
  id           : any
  no           : string
  customer     : ICustomer
  status       : string
  comments     : string
  invoiceDate  : Date
  validUntil   : Date
  created      : string
  approved     : string
  salesInvoiceDetails   : ISalesInvoiceDetail[]
}

interface ISalesInvoiceDetail{
  id               : any
  qty              : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number
  product          : IProduct
}

interface IProduct{
  id               : any
  barcode          : string
  code             : string
  description      : string
  packSize         : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number
}

interface ICustomer{
  id                  : any
  no                  : string
  name                : string
  contactName         : string
  active              : boolean
  tin                 : string
  vrn                 : string
  creditLimit         : number
  invoiceLimit        : number
  creditDays          : number
  physicalAddress     : string
  postCode            : string
  postAddress         : string
  telephone           : string
  mobile              : string
  email               : string
  fax                 : string
  bankAccountName     : string
  bankPhysicalAddress : string
  bankPostAddress     : string
  bankPostCode        : string
  bankName            : string
  bankAccountNo       : string
}

interface ICustomerName{
  names : string[]
}
