import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const pdfMakeX = require('pdfmake/build/pdfmake.js');
const pdfFontsX = require('pdfmake-unicode/dist/pdfmake-unicode.js');
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;
import * as pdfMake from 'pdfmake/build/pdfmake';
import { DataService } from 'src/app/services/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class PackingListComponent implements OnInit {

  public pclNoLocked  : boolean = true
  public inputsLocked : boolean = true
  public valuesLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  logo!              : any 
  closeResult        : string = ''
  disablePriceChange : any = false

  blank          : boolean = false
  
  id             : any
  no             : string
  customer!      : ICustomer
  customerId     : any
  customerNo!    : string
  customerName!  : string
  employee!     : IEmployee
  employeeId    : any
  employeeNo!   : string
  employeeName! : string
  status         : string
  issueDate!     : Date
  comments!      : string
  created        : string
  approved       : string
  posted         : string
  packingListDetails : IPackingListDetail[]
  packingLists       : IPackingList[]

  total            : number

  totalPreviousReturns : number
  totalAmountIssued    : number
  totalAmountPacked    : number
  totalSales           : number
  totalOffered         : number
  totalReturns         : number
  totalDamages         : number
  totalDeficit         : number

  totalDiscounts       : number
  totalExpenditures     : number
  totalBank            : number
  totalCash            : number

  customerNames  : string[] = []
  employeeNames  : string[] = []

  //detail
  detailId            : any
  barcode             : string
  productId           : any
  code                : string
  description         : string
  
  previousReturns     : number
  qtyIssued           : number
  totalPacked         : number
  qtySold             : number
  qtyOffered          : number
  qtyReturned         : number
  qtyDamaged          : number   
  costPriceVatIncl    : number
  costPriceVatExcl    : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private data : DataService,
              private spinner: NgxSpinnerService) {
    this.id               = ''
    this.no               = ''
    this.status           = ''
    this.comments         = ''
    this.created          = ''
    this.approved         = ''
    this.posted           = ''
    this.packingListDetails   = []
    this.packingLists         = []

    this.total            = 0

    this.totalPreviousReturns = 0
    this.totalAmountIssued    = 0
    this.totalAmountPacked    = 0
    this.totalSales           = 0
    this.totalOffered         = 0
    this.totalReturns         = 0
    this.totalDamages         = 0
    this.totalDeficit         = 0

    this.totalDiscounts       = 0
    this.totalExpenditures     = 0
    this.totalBank            = 0
    this.totalCash            = 0

    this.detailId            = ''
    this.barcode             = ''
    this.code                = ''    
    this.description         = ''
    this.previousReturns     = 0
    this.qtyIssued           = 0
    this.totalPacked         = 0
    this.qtySold             = 0
    this.qtyOffered          = 0
    this.qtyReturned         = 0
    this.qtyDamaged          = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0

    this.descriptions        = []
  }

  async ngOnInit(): Promise<void> {
    this.loadPackingLists()
    this.loadCustomerNames()
    this.loadEmployeeNames()
    this.loadProductDescriptions()
    this.logo = await this.data.getLogo()
  }

  async save() {   
    if(this.issueDate == null){
      alert('Issue date required')
      return
    } 
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var packingList = {
      id           : this.id,
      issueDate  : this.issueDate,
      customer     : {no : this.customerNo, name : this.customerName},
      employee     : {no : this.employeeNo, alias : this.employeeName},
      comments     : this.comments
    }
    if(this.id == null || this.id == ''){  
      this.spinner.show() 
      await this.http.post<IPackingList>(API_URL+'/packing_lists/create', packingList, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id                   = data?.id
          this.no                   = data!.no         
          this.status               = data!.status
          this.comments             = data!.comments
          this.created              = data!.created
          this.approved             = data!.approved
          this.posted               = data!.posted
          this.totalPreviousReturns = data!.totalPreviousReturns
          this.totalAmountIssued    = data!.totalAmountIssued
          this.totalAmountPacked    = data!.totalAmountPacked
          this.totalSales           = data!.totalSales
          this.totalOffered         = data!.totalOffered
          this.totalReturns         = data!.totalReturns
          this.totalDamages         = data!.totalDamages
          this.totalDeficit         = data!.totalDeficit
          this.totalDiscounts       = data!.totalDiscounts
          this.totalExpenditures     = data!.totalExpenditures
          this.totalBank            = data!.totalBank
          this.totalCash            = data!.totalCash
          this.get(this.id)
          alert('Packing List created successifully')
          this.blank = true
          this.loadPackingLists()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save Packing List')
        }
      )
    }else{
      this.spinner.show()
      await this.http.put<IPackingList>(API_URL+'/packing_lists/update', packingList, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id                   = data?.id
          this.no                   = data!.no
          this.status               = data!.status
          this.comments             = data!.comments
          this.created              = data!.created
          this.approved             = data!.approved
          this.posted               = data!.posted
          this.totalPreviousReturns = data!.totalPreviousReturns
          this.totalAmountIssued    = data!.totalAmountIssued
          this.totalAmountPacked    = data!.totalAmountPacked
          this.totalSales           = data!.totalSales
          this.totalOffered         = data!.totalOffered
          this.totalReturns         = data!.totalReturns
          this.totalDamages         = data!.totalDamages
          this.totalDeficit         = data!.totalDeficit
          this.totalDiscounts       = data!.totalDiscounts
          this.totalExpenditures     = data!.totalExpenditures
          this.totalBank            = data!.totalBank
          this.totalCash            = data!.totalCash
          this.get(this.id)
          alert('Packing List updated successifully')
          this.loadPackingLists()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update Packing List')
        }
      )
    }
  }

  refresh(){
    if(this.status == 'APPROVED'){
      this.valuesLocked = false
    }else{
      this.valuesLocked = true
    }
  }

  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IPackingList>(API_URL+'/packing_lists/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.id              = data?.id
        this.no              = data!.no
        this.issueDate       = data!.issueDate
        this.customerId      = data!.customer.id
        this.customerNo      = data!.customer.no
        this.customerName    = data!.customer.name
        this.employeeId     = data!.employee.id
        this.employeeNo     = data!.employee.no
        this.employeeName   = data!.employee.alias
        this.status               = data!.status
        this.comments             = data!.comments
        this.created              = data!.created
        this.approved             = data!.approved
        this.posted               = data!.posted
        this.totalPreviousReturns = data!.totalPreviousReturns
        this.totalAmountIssued    = data!.totalAmountIssued
        this.totalAmountPacked    = data!.totalAmountPacked
        this.totalSales           = data!.totalSales
        this.totalOffered         = data!.totalOffered
        this.totalReturns         = data!.totalReturns
        this.totalDamages         = data!.totalDamages
        this.totalDeficit         = data!.totalDeficit
        this.totalDiscounts       = data!.totalDiscounts
        this.totalExpenditures     = data!.totalExpenditures
        this.totalBank            = data!.totalBank
        this.totalCash            = data!.totalCash
        this.refresh()
        this.packingListDetails   = data!.packingListDetails
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Packing List')
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
    await this.http.get<IPackingList>(API_URL+'/packing_lists/get_by_no?no='+no, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.id            = data?.id
        this.no            = data!.no 
        this.issueDate     = data!.issueDate
        this.customerId    = data!.customer.id
        this.customerNo    = data!.customer.no
        this.customerName  = data!.customer.name  
        this.employeeId     = data!.employee.id
        this.employeeNo     = data!.employee.no
        this.employeeName   = data!.employee.alias
        this.status               = data!.status
        this.comments             = data!.comments
        this.created              = data!.created
        this.approved             = data!.approved
        this.posted               = data!.posted
        this.totalPreviousReturns = data!.totalPreviousReturns
        this.totalAmountIssued    = data!.totalAmountIssued
        this.totalAmountPacked    = data!.totalAmountPacked
        this.totalSales           = data!.totalSales
        this.totalOffered         = data!.totalOffered
        this.totalReturns         = data!.totalReturns
        this.totalDamages         = data!.totalDamages
        this.totalDeficit         = data!.totalDeficit
        this.totalDiscounts       = data!.totalDiscounts
        this.totalExpenditures    = data!.totalExpenditures
        this.totalBank            = data!.totalBank
        this.totalCash            = data!.totalCash
        this.refresh()
        this.packingListDetails   = data!.packingListDetails
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Packing List')
      }
    )
  }

  async approve(id: any) {
    if(!window.confirm('Confirm approval of the selected Packing List')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var pcl = {
      id                   : this.id,   
      totalPreviousReturns : this.totalPreviousReturns, 
      totalAmountIssued    : this.totalAmountIssued,   
      totalAmountPacked    : this.totalAmountPacked,   
      totalSales           : this.totalSales,           
      totalOffered         : this.totalOffered,         
      totalReturns         : this.totalReturns,         
      totalDamages         : this.totalDamages,         
      totalDeficit         : this.totalDeficit,         
      totalDiscounts       : this.totalDiscounts,       
      totalExpenditures    : this.totalExpenditures,     
      totalBank            : this.totalBank,            
      totalCash            : this.totalCash         
    }
    this.spinner.show()
    await this.http.put(API_URL+'/packing_lists/approve', pcl, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadPackingLists()
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

  async post(id: any) {
    if(!window.confirm('Confirm posting of the selected Packing List')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var pcl = {
      id                   : this.id,   
      totalPreviousReturns : this.totalPreviousReturns, 
      totalAmountIssued    : this.totalAmountIssued,   
      totalAmountPacked    : this.totalAmountPacked,   
      totalSales           : this.totalSales,           
      totalOffered         : this.totalOffered,         
      totalReturns         : this.totalReturns,         
      totalDamages         : this.totalDamages,         
      totalDeficit         : this.totalDeficit,         
      totalDiscounts       : this.totalDiscounts,       
      totalExpenditures    : this.totalExpenditures,     
      totalBank            : this.totalBank,            
      totalCash            : this.totalCash
    }
    this.spinner.show()
    await this.http.put(API_URL+'/packing_lists/post', pcl, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadPackingLists()
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

  async cancel(id: any) {
    if(!window.confirm('Confirm canceling of the selected Packing List')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var pcl = {
      id : this.id   
    }
    this.spinner.show()
    await this.http.put(API_URL+'/packing_lists/cancel', pcl, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadPackingLists()
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
       * First Create a new Packing List
       */
      alert('Packing List not available, the system will create a new Packing List')
      this.save()
    }else{
      /**
       * Enter Packing List Detail
       */
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }   
      var detail = {
        packingList         : {id : this.id},
        product             : {id : this.productId, code : this.code},
        previousReturns     : this.previousReturns,
        qtyIssued           : this.qtyIssued,
        totalPacked         : this.totalPacked,
        qtySold             : this.qtySold,
        qtyOffered          : this.qtyOffered,
        qtyReturned         : this.qtyReturned,
        qtyDamaged          : this.qtyDamaged,  
        costPriceVatIncl    : this.costPriceVatIncl,
        costPriceVatExcl    : this.costPriceVatExcl,
        sellingPriceVatIncl : this.sellingPriceVatIncl,
        sellingPriceVatExcl : this.sellingPriceVatExcl
      }
      this.spinner.show()
      await this.http.post(API_URL+'/packing_list_details/save', detail, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        () => {
          this.clearDetail()
          this.get(this.id)
          if(this.blank == true){
            this.blank = false
            this.loadPackingLists()
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

  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }

  deleteDetail(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.delete(API_URL+'/packing_list_details/delete?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
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

  loadPackingLists(){
    this.packingLists = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IPackingList[]>(API_URL+'/packing_lists', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.packingLists.push(element)
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
    var pcl = {
      id : id   
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/packing_lists/archive', pcl, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadPackingLists()
        alert('Packing List archived successifully')
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
    if(!window.confirm('Confirm archiving Packing Lists. All Posted  and debt free documents will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/packing_lists/archive_all', null, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadPackingLists()
        alert('All Posted and Debt free archived successifully')
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
    this.pclNoLocked  = false
    this.inputsLocked = false
    this.valuesLocked = true   
  }

  lockAll(){
    this.pclNoLocked  = true
    this.inputsLocked = true
  }

  clear(){
    this.id                   = ''
    this.no                   = ''
    this.status               = ''
    this.comments             = ''
    this.created              = ''
    this.approved             = ''
    this.posted               = ''
    this.packingListDetails   = []
    this.customerNo           = ''
    this.customerName         = ''
    this.employeeNo           = ''
    this.employeeName         = ''
    this.issueDate!
    this.totalPreviousReturns = 0
    this.totalAmountIssued    = 0
    this.totalAmountPacked    = 0
    this.totalSales           = 0
    this.totalOffered         = 0
    this.totalReturns         = 0
    this.totalDamages         = 0
    this.totalDeficit         = 0
    this.totalDiscounts       = 0
    this.totalExpenditures    = 0
    this.totalBank            = 0
    this.totalCash            = 0
  }

  clearDetail(){
    this.detailId            = null
    this.barcode             = ''
    this.code                = ''
    this.description         = ''
    this.previousReturns     = 0
    this.qtyIssued           = 0
    this.totalPacked         = 0
    this.qtySold             = 0
    this.qtyOffered          = 0
    this.qtyReturned         = 0
    this.qtyDamaged          = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
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
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
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
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product')
    })
    this.spinner.show()
    this.http.get<IPackingListDetail>(API_URL+'/packing_list_details/get?id='+detailId, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.detailId = data!.id
        this.sellingPriceVatIncl = data!.sellingPriceVatIncl
        this.sellingPriceVatExcl = data!.sellingPriceVatExcl
        this.previousReturns     = data!.previousReturns
        this.qtyIssued           = data!.qtyIssued
        this.totalPacked         = data!.totalPacked
        this.qtySold             = data!.qtySold
        this.qtyOffered          = data!.qtyOffered
        this.qtyReturned         = data!.qtyReturned
        this.qtyDamaged          = data!.qtyDamaged
        this.costPriceVatIncl    = data!.costPriceVatIncl
        this.costPriceVatExcl    = data!.costPriceVatExcl
        this.sellingPriceVatIncl = data!.sellingPriceVatIncl
        this.sellingPriceVatExcl = data!.sellingPriceVatExcl
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load detail information')
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
    this.disablePriceChange = true
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
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/customers/get_names', options)
    .pipe(finalize(() => this.spinner.hide()))
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

  async loadEmployeeNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/employees/get_aliases', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.employeeNames = []
        data?.forEach(element => {
          this.employeeNames.push(element)
        })
      },
      error => {
        console.log(error)
        alert('Could not load employee names')
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
      },
      error => {
        console.log(error)
        alert('Could not load product descriptions')
      }
    )
  }

  async searchCustomer(name: string) {
    if(name == ''){
      this.customerId = ''
      this.customerNo = ''
      this.customerName = ''
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ICustomer>(API_URL+'/customers/get_by_name?name='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
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

  async searchEmployee(name: string) {
    if(name == ''){
      this.employeeId   = ''
      this.employeeNo   = ''
      this.employeeName = ''
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ICustomer>(API_URL+'/employees/get_by_alias?alias='+name, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.employeeId = data?.id
        this.employeeNo = data!.no
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('Employee not found')
        this.employeeId   = ''
        this.employeeNo   = ''
        this.employeeName = ''
      }
    )
  }

  async calculateTotalPacked(){
    this.totalPacked =  +this.previousReturns + +this.qtyIssued
  }

  calculateTotalDeficit(){
    this.totalDeficit = +this.totalSales - (+this.totalExpenditures + +this.totalDiscounts + +this.totalBank + +this.totalCash)
  }

  enablePriceChange(){
    this.disablePriceChange = false
  }

  exportToPdf = () => {
    var header = ''
    var footer = ''
    var title  = ''
    var logo : any = ''
    var address : any = ''
    if(this.status == 'PENDING' || this.status == 'APPROVED' || this.status == 'CANCELED'){
      title = 'Packing List and Returns'
    }else{
      title = 'Sales and Returns'
    }
    if(this.logo == ''){
      logo = { text : '', width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }else{
      logo = {image : this.logo, width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }
    address = this.data.getAddress()
    var report = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9}, 
        {text : 'Price', fontSize : 9}, 
        {text : 'Returns', fontSize : 9}, 
        {text : 'Issued', fontSize : 9}, 
        {text : 'Total', fontSize : 9}, 
        {text : 'Sold', fontSize : 9}, 
        {text : 'Offered', fontSize : 9}, 
        {text : 'Returned', fontSize : 9}, 
        {text : 'Damaged', fontSize : 9}
      ]
    ]   
    this.packingListDetails.forEach((element) => {
      var detail = [
        {text : element.product.code.toString(), fontSize : 9}, 
        {text : element.product.description.toString(), fontSize : 9}, 
        {text : element.sellingPriceVatIncl.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'}, 
        {text : element.previousReturns.toString(), fontSize : 9}, 
        {text : element.qtyIssued.toString(), fontSize : 9}, 
        {text : element.totalPacked.toString(), fontSize : 9}, 
        {text : element.qtySold.toString(), fontSize : 9}, 
        {text : element.qtyOffered.toString(), fontSize : 9}, 
        {text : element.qtyReturned.toString(), fontSize : 9}, 
        {text : element.qtyDamaged.toString(), fontSize : 9}
      ]
      report.push(detail)
    })
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
                  address
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
                  {text : 'Issue No', fontSize : 9}, 
                  {text : this.no, fontSize : 9} 
                ],
                [
                  {text : 'Issue Date', fontSize : 9}, 
                  {text : this.issueDate, fontSize : 9} 
                ],
                [
                  {text : 'Sales Officer', fontSize : 9}, 
                  {text : this.employeeName, fontSize : 9} 
                ],
                [
                  {text : 'Customer', fontSize : 9}, 
                  {text : this.customerName, fontSize : 9} 
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
                widths : ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto',],
                body : report
            }
        },
        ' ',
        ' ',
        {text : 'Summary', fontSize : 10, bold : true},
        {
          layout: 'lightHorizontalLines',
          table : {
            widths : [100, 200],
            body : [
              [
                {text : 'Issue No', fontSize : 9}, 
                {text : this.no, fontSize : 9} 
              ],
              [
                {text : 'Total Packed', fontSize : 9}, 
                {text : this.totalAmountPacked.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Sales', fontSize : 9}, 
                {text : this.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Offer/Giveaway', fontSize : 9}, 
                {text : this.totalOffered.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Returns', fontSize : 9}, 
                {text : this.totalReturns.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Damages', fontSize : 9}, 
                {text : this.totalDamages.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Discounts', fontSize : 9}, 
                {text : this.totalDiscounts.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Expenditures', fontSize : 9}, 
                {text : this.totalExpenditures.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Bank', fontSize : 9}, 
                {text : this.totalBank.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Cash', fontSize : 9}, 
                {text : this.totalCash.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
              [
                {text : 'Total Deficit', fontSize : 9}, 
                {text : this.totalDeficit.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ]
            ]
          }         
        },
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

interface IPackingList{
  id                 : any
  no                 : string
  customer           : ICustomer
  employee           : IEmployee
  status             : string
  comments           : string
  issueDate          : Date
  created            : string
  approved           : string
  posted             : string
  packingListDetails : IPackingListDetail[]

  totalPreviousReturns : number
  totalAmountIssued    : number
  totalAmountPacked    : number
  totalSales           : number
  totalOffered         : number
  totalReturns         : number
  totalDamages         : number

  totalDiscounts       : number
  totalExpenditures     : number
  totalBank            : number
  totalCash            : number

  totalDeficit         : number
}

interface IPackingListDetail{
  id                  : any
  previousReturns     : number
  qtyIssued           : number
  totalPacked         : number
  qtySold             : number
  qtyOffered          : number
  qtyReturned         : number
  qtyDamaged          : number   
  costPriceVatIncl    : number
  costPriceVatExcl    : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number
  product             : IProduct
}

interface IProduct{
  id               : any
  barcode          : string
  code             : string
  description      : string
  packSize         : number
  costPriceVatIncl : number
  costPriceVatExcl : number
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

interface IEmployee{
  id                  : any
  no                  : string
  alias                : string
}