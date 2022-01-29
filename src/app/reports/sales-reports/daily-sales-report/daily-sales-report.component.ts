import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { DataService } from 'src/app/services/data.service';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-daily-sales-report',
  templateUrl: './daily-sales-report.component.html',
  styleUrls: ['./daily-sales-report.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class DailySalesReportComponent implements OnInit {

  logo!    : any
  address  : any 

  from! : Date
  to!   : Date

  report : IDailySalesReport[] = []

  totalAmount : number = 0
  totalDiscount : number = 0
  totalTax : number = 0

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService,
              private spinner: NgxSpinnerService,
              private data : DataService) { }

  async ngOnInit(): Promise<void> {
    this.logo = await this.data.getLogo() 
    this.address = await this.data.getAddress()
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  refresh(){
    this.totalAmount = 0
    this.totalDiscount = 0
    this.totalTax = 0
    this.report.forEach(element => {
      this.totalAmount = this.totalAmount + element.amount
      this.totalDiscount = this.totalDiscount + element.discount
      this.totalTax = this.totalTax + element.tax
    })
  }


  async getDailySalesReport(from: Date, to: Date) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    var args = {
      from : from,
      to   : to
    }
    this.spinner.show()
    await this.http.post<IDailySalesReport[]>(API_URL + '/reports/daily_sales_report', args, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
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
    var title  = 'Daily Sales Report'
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
        {text : 'Date', fontSize : 9, fillColor : '#bdc6c7'}, 
        {text : 'Amount', fontSize : 9, fillColor : '#bdc6c7'},
        {text : 'Discount', fontSize : 9, fillColor : '#bdc6c7'},
        {text : 'Tax', fontSize : 9, fillColor : '#bdc6c7'},
      ]
    ]    
    this.report.forEach((element) => {
      total = total + element.amount
      discount = discount + element.discount
      tax = tax + element.tax
      var detail = [
        {text : element.date.toString(), fontSize : 9, fillColor : '#ffffff'}, 
        {text : element.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#ffffff'},
        {text : element.discount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#ffffff'},  
        {text : element.tax.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#ffffff'},
      ]
      report.push(detail)
    })
    var detailSummary = [
      {text : 'Total', fontSize : 9, fillColor : '#CCCCCC'}, 
      {text : total.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#CCCCCC'},
      {text : discount.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#CCCCCC'},  
      {text : tax.toLocaleString('en-US', { minimumFractionDigits: 2 }), fontSize : 9, alignment : 'right', fillColor : '#CCCCCC'},        
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
              ]
            },
          },
          '  ',
          {
            layout : 'noBorders',
            table : {
                headerRows : 1,
                widths : [100, 100, 100, 100, 100],
                body : report
            }
        },                   
      ]     
    };
    pdfMake.createPdf(docDefinition).open(); 
  }
}

export interface IDailySalesReport {
  date     : Date
  amount   : number
  discount : number
  tax      : number
}
