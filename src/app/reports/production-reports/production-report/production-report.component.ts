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
  selector: 'app-production-report',
  templateUrl: './production-report.component.html',
  styleUrls: ['./production-report.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class ProductionReportComponent implements OnInit {

  logo!    : any
  address  : any 

  from! : Date
  to!   : Date

  report : IProductionReport[] = []

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
  }
  
  

  refresh(){
    this.totalAmount = 0
    this.report.forEach(element => {
      this.totalAmount = this.totalAmount + element.amount
    })
  }


  async getProductionReport(from: Date, to: Date) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.access_token)
    }
    var args = {
      from : from,
      to   : to
    }
    this.spinner.show()
    await this.http.post<IProductionReport[]>(API_URL + '/reports/production_report', args, options)
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
    var title  = 'Production Report'
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
      ]
    ]    
    this.report.forEach((element) => {
      total = total + element.amount
      var detail = [
        {text : element.code.toString(), fontSize : 9, fillColor : '#ffffff'}, 
        {text : element.description.toString(), fontSize : 9, alignment : 'left', fillColor : '#ffffff'},
        {text : element.qty.toString(), fontSize : 9, alignment : 'left', fillColor : '#ffffff'},  
      ]
      report.push(detail)
    })
    var detailSummary = [
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'}, 
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'},
      {text : '', fontSize : 9, alignment : 'left', fillColor : '#CCCCCC'},  
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
                widths : [50, 250, 50],
                body : report
            }
        },                   
      ]     
    };
    pdfMake.createPdf(docDefinition).open(); 
  }
}

export interface IProductionReport {
  code        : string
  description : string
  qty         : number
  amount      : number
}

