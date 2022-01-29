import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-debt-receipt',
  templateUrl: './debt-receipt.component.html',
  styleUrls: ['./debt-receipt.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class DebtReceiptComponent implements OnInit {

  public receiptNoLocked  : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  closeResult    : string = ''

  blank          : boolean = false

  logo!              : any
  address  : any 
  
  id             : any
  no             : string
  employee!      : IEmployee
  employeeId     : any
  employeeNo!    : string
  employeeName!  : string
  status         : string
  receiptDate!   : Date
  mode           : string
  amount         : number
  chequeNo       : string
  comments!      : string
  created        : string
  approved       : string

  receipts       : IDebtReceipt[]
 
  employeeNames  : string[] = []

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private data : DataService,
              private spinner: NgxSpinnerService) {
    this.id               = ''
    this.no               = ''
    this.status           = ''
    this.mode             = ''
    this.amount           = 0
    this.chequeNo         = ''
    this.comments         = ''
    this.created          = ''
    this.approved         = ''

    this.receipts         = []
    
  }

  async ngOnInit(): Promise<void> {
    this.logo = await this.data.getLogo() 
    this.address = await this.data.getAddress()
    this.loadReceipts()
    this.loadEmployeeNames()
  }
  
  async save() {
    if(this.employeeId == null || this.employeeId == ''){
      alert('Employee information missing')
      return
    }
    if(this.receiptDate == null){
      alert('Receipt date required')
      return
    } 
    if(this.mode == ''){
      alert('Payment mode required')
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var debt_receipt = {
      id           : this.id,
      receiptDate  : this.receiptDate,
      employee     : {no : this.employeeNo, name : this.employeeName},
      mode         : this.mode,
      chequeNo     : this.chequeNo,
      amount       : this.amount,
      comments     : this.comments
    }
    if(this.id == null || this.id == ''){ 
      this.spinner.show()  
      await this.http.post<IDebtReceipt>(API_URL+'/debt_receipts/create', debt_receipt, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no         
          this.status       = data!.status
          this.mode         = data!.mode
          this.amount       = data!.amount
          this.chequeNo     = data!.chequeNo
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Receipt Created successifully')
          this.blank = true
          this.loadReceipts()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save Receipt')
        }
      )
    }else{
      this.spinner.show()
      await this.http.put<IDebtReceipt>(API_URL+'/debt_receipts/update', debt_receipt, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.status       = data!.status
          this.mode         = data!.mode
          this.amount       = data!.amount
          this.chequeNo     = data!.chequeNo
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Receipt Updated successifully')
          this.loadReceipts()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update Receipt')
        }
      )
    }
  }

  get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IDebtReceipt>(API_URL+'/debt_receipts/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.lockAll()
        this.id           = data?.id
        this.no           = data!.no
        this.receiptDate  = data!.receiptDate
        this.employeeId   = data!.employee.id
        this.employeeNo   = data!.employee.no
        this.employeeName = data!.employee.alias
        this.status       = data!.status
        this.mode         = data!.mode
        this.amount       = data!.amount
        this.chequeNo     = data!.chequeNo
        this.comments     = data!.comments
        this.created      = data!.created
        this.approved     = data!.approved
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Receipt')
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
    this.spinner.show()
    this.http.get<IDebtReceipt>(API_URL+'/debt_receipts/get_by_no?no='+no, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.lockAll()
        this.id           = data?.id
        this.no           = data!.no 
        this.receiptDate  = data!.receiptDate
        this.employeeId   = data!.employee.id
        this.employeeNo   = data!.employee.no
        this.employeeName = data!.employee.alias 
        this.status       = data!.status
        this.mode         = data!.mode
        this.amount       = data!.amount
        this.chequeNo     = data!.chequeNo
        this.comments     = data!.comments
        this.created      = data!.created
        this.approved     = data!.approved
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Receipt')
      }
    )
  }

  approve(id: any) {
    if(!window.confirm('Confirm approval of the selected Receipt')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var receipt = {
      id : this.id   
    }
    this.spinner.show()
    this.http.put(API_URL+'/debt_receipts/approve', receipt, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadReceipts()
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
    if(!window.confirm('Confirm canceling of the selected Receipt')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var receipt = {
      id : this.id   
    }
    this.spinner.show()
    this.http.put(API_URL+'/debt_receipts/cancel', receipt, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadReceipts()
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
  
  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }

  loadReceipts(){
    this.receipts = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IDebtReceipt[]>(API_URL+'/debt_receipts', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.receipts.push(element)
        })
      }
    )
  }

  async archive(id: any) {
    if(id == null || id == ''){
      window.alert('Please select Receipt to archive')
      return
    }
    if(!window.confirm('Confirm archiving of the selected Receipt')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var receipt = {
      id : id   
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/debt_receipts/archive', receipt, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadReceipts()
        alert('Receipt archived successifully')
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
    if(!window.confirm('Confirm archiving Receipts. All PAID Receipts will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/debt_receipts/archive_all', null, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadReceipts()
        alert('Receipts archived successifully')
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
    this.receiptNoLocked  = false
    this.inputsLocked = false   
  }

  lockAll(){
    this.receiptNoLocked  = true
    this.inputsLocked = true
  }

  clear(){
    this.id           = ''
    this.no           = ''
    this.status       = ''
    this.mode         = ''
    this.amount       = 0
    this.chequeNo     = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.employeeNo = ''
    this.employeeName = ''
    this.receiptDate!
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any, productId: string, detailId: string) {
    if (this.employeeNo == '' || this.employeeNo == null) {
      alert('Please enter employee information')
      return
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  async searchEmployee(alias: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IEmployee>(API_URL+'/employees/get_by_alias?alias='+alias, options)
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
        this.employeeId = ''
        this.employeeNo = ''
        this.employeeName = ''
      }
    )
  }

  exportToPdf = () => {
    if(this.id == '' || this.id == null){
      return
    }
    var header = ''
    var footer = ''
    var title  = 'Debt Receipt'
    var logo : any = ''
    var total : number = 0
    if(this.logo == ''){
      logo = { text : '', width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }else{
      logo = {image : this.logo, width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }
    
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
            widths : [75, 200],
            body : [
              [
                {text : 'Receipt No', fontSize : 9}, 
                {text : this.no, fontSize : 9} 
              ],
              [
                {text : 'Receipt Date', fontSize : 9}, 
                {text : this.receiptDate, fontSize : 9} 
              ],
              [
                {text : 'Employee', fontSize : 9}, 
                {text : this.employeeName+'  ['+this.employeeNo+']', fontSize : 9} 
              ],
              [
                {text : 'Status', fontSize : 9}, 
                {text : this.status, fontSize : 9} 
              ],
              [
                {text : 'Mode of Payment', fontSize : 9}, 
                {text : this.mode, fontSize : 9} 
              ],
              [
                {text : 'Cheque No', fontSize : 9}, 
                {text : this.chequeNo, fontSize : 9} 
              ],
              [
                {text : 'Amount', fontSize : 9}, 
                {text : this.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right'} 
              ],
            ]
          },
        },
      ]     
    };
    pdfMake.createPdf(docDefinition).open()
  }
}

interface IDebtReceipt{
  id           : any
  no           : string
  employee     : IEmployee
  status       : string
  comments     : string
  receiptDate  : Date
  mode         : string
  amount       : number
  chequeNo     : string
  created      : string
  approved     : string
}

interface IEmployee{
  id                  : any
  no                  : string
  alias               : string
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

interface IEmployeeName{
  names : string[]
}