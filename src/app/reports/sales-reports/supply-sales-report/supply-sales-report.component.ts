import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-supply-sales-report',
  templateUrl: './supply-sales-report.component.html',
  styleUrls: ['./supply-sales-report.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class SupplySalesReportComponent implements OnInit {

  logo!    : any
  address  : any 

  from! : Date
  to!   : Date

  supplierId     : any
  supplierCode!  : string
  supplierName!  : string

  supplierNames : string[] = []

  report : ISupplySalesReport[] = []

  totalAmount : number = 0
  totalDiscount : number = 0
  totalTax : number = 0


  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private spinner: NgxSpinnerService,
              private data : DataService) { }

  async ngOnInit(): Promise<void> {
    this.logo = await this.data.getLogo() 
    this.address = await this.data.getAddress()
    this.loadSupplierNames()
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

  refresh(){
    this.totalAmount = 0
    this.report.forEach(element => {
      this.totalAmount = this.totalAmount + element.amount
    })
  }


  async getSupplySalesReport(from: Date, to: Date, supplierName : string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    var args = {
      from : from,
      to   : to,
      supplier : {
        name : supplierName
      }
    }
    this.spinner.show()
    await this.http.post<ISupplySalesReport[]>(API_URL + '/reports/supply_sales_report', args, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          console.log(data)
          this.report = data!
          this.refresh()
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load report')
      })
  }
  exportToPdf = () => {
    var header = ''
    var footer = ''
    var title  = 'Supply Sales Report'
    var logo : any = ''
    var total : number = 0
    var discount : number = 0
    var tax : number = 0
    if(this.logo == ''){
      logo = { text : '', width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }else{
      logo = {image : this.logo, width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }
    var report = [
      [
        {text : 'Code', fontSize : 9, fillColor : '#bdc6c7'}, 
        {text : 'Description', fontSize : 9, fillColor : '#bdc6c7'},
        {text : 'Qty', fontSize : 9, fillColor : '#bdc6c7'},
        {text : 'Amount', fontSize : 9, fillColor : '#bdc6c7'},
      ]
    ]    
    this.report.forEach((element) => {
      total = total + element.amount
      var detail = [
        {text : element.code.toString(), fontSize : 9, fillColor : '#ffffff'}, 
        {text : element.description.toString(), fontSize : 9, alignment : 'left', fillColor : '#ffffff'},
        {text : element.qty.toString(), fontSize : 9, alignment : 'left', fillColor : '#ffffff'},  
        {text : element.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#ffffff'},
      ]
      report.push(detail)
    })
    var detailSummary = [
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'}, 
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'},
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'},  
      {text : this.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#CCCCCC'},        
    ]
    report.push(detailSummary)
    const docDefinition = {
      header: '',
      watermark : { text : '', color: 'blue', opacity: 0.1, bold: true, italics: false },
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
                  {text : 'From', fontSize : 9}, 
                  {text : this.from, fontSize : 9} 
                ],
                [
                  {text : 'To', fontSize : 9}, 
                  {text : this.to, fontSize : 9} 
                ],
                [
                  {text : 'Supplier', fontSize : 9}, 
                  {text : this.supplierName, fontSize : 9} 
                ],
              ]
            },
          },
          '  ',
          {
            layout : 'noBorders',
            table : {
                headerRows : 1,
                widths : [50, 250, 50, 100, 100],
                body : report
            }
        },                   
      ]     
    };
    pdfMake.createPdf(docDefinition).open(); 
  }
}

export interface ISupplySalesReport {
  supplier    : ISupplier
  code        : string
  description : string
  qty         : number
  amount      : number
}

export interface ISupplier{
  id   : any
  code : string
  name : string
}

