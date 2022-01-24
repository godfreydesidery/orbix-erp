import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';
const fs = require('file-saver');
import * as XLSX from 'xlsx';
import { ICategory } from '../category/category.component';
import { ISubCategory } from '../sub-category/sub-category.component';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-material-mass-manager',
  templateUrl: './material-mass-manager.component.html',
  styleUrls: ['./material-mass-manager.component.scss']
})
export class MaterialMassManagerComponent implements OnInit {
  data!          : [][]
  progress       : boolean 
  progressStatus : string 
  totalRecords   : number 
  currentRecord  : number
  
  constructor(private shortcut : ShortCutHandlerService,
              private auth : AuthService,
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
    this.progress       = false
    this.progressStatus = ''
    this.totalRecords   = 0
    this.currentRecord  = 0
  }

  ngOnInit(): void {
  }

  async exportMaterialToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('MaterialSheet')
   
    worksheet.columns = [
      { header: 'CODE', key: 'CODE'},
      { header: 'DESCRIPTION', key: 'DESCRIPTION'},
      { header: 'SHORT_DESCRIPTION', key: 'SHORT_DESCRIPTION'},
      { header: 'VAT', key: 'VAT'},
      { header: 'COST_PRICE_VAT_INCL', key: 'COST_PRICE_VAT_INCL'},
      { header: 'COST_PRICE_VAT_EXCL', key: 'COST_PRICE_VAT_EXCL'},
      { header: 'UOM', key: 'UOM'},
      { header: 'PACK_SIZE', key: 'PACK_SIZE'},
      { header: 'STOCK', key: 'STOCK'},
      { header: 'MINIMUM_INVENTORY', key: 'MINIMUM_INVENTORY'},
      { header: 'MAXIMUM_INVENTORY', key: 'MAXIMUM_INVENTORY'},
      { header: 'DEFAULT_REORDER_QTY', key: 'DEFAULT_REORDER_QTY'},
      { header: 'DEFAULT_REORDER_LEVEL', key: 'DEFAULT_REORDER_LEVEL'},
      { header: 'ACTIVE', key: 'ACTIVE'},
      { header: 'CATEGORY', key: 'CATEGORY'},
      { header: 'SUB_CATEGORY', key: 'SUB_CATEGORY'}
    ];

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IMaterial[]>(API_URL+'/materials', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        console.log(data)
        data?.forEach(element => {            
          var categoryName    = ''
          var subCategoryName = ''

          if(element.category != null){
            categoryName =element.category.name
          }
          if(element.subCategory != null){
            subCategoryName =element.subCategory.name
          }

          worksheet.addRow(
            {
              CODE                   : element.code,
              DESCRIPTION            : element.description,
              SHORT_DESCRIPTION      : element.shortDescription,
              VAT                    : element.vat,
              COST_PRICE_VAT_INCL    : element.costPriceVatIncl,
              COST_PRICE_VAT_EXCL    : element.costPriceVatExcl,
              UOM                    : element.uom,
              PACK_SIZE              : element.packSize,
              STOCK                  : element.stock,
              MINIMUM_INVENTORY      : element.minimumInventory,
              MAXIMUM_INVENTORY      : element.maximumInventory,
              DEFAULT_REORDER_QTY    : element.defaultReorderQty,
              DEFAULT_REORDER_LEVEL  : element.defaultReorderLevel,
              ACTIVE                 : element.active,
              CATEGORY               : categoryName,
              SUB_CATEGORY           : subCategoryName
            },"n"
          )
        })
      }
    )
    .catch(
      error => {
        console.log(error)
      }
    )
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'MaterialMaster.xlsx');
    })
   
  }

  exportTemplateToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('TemplateSheet')
   
    worksheet.columns = [
      { header: 'CODE', key: 'CODE'},
      { header: 'DESCRIPTION', key: 'DESCRIPTION'},
      { header: 'SHORT_DESCRIPTION', key: 'SHORT_DESCRIPTION'},
      { header: 'VAT', key: 'VAT'},
      { header: 'COST_PRICE_VAT_INCL', key: 'COST_PRICE_VAT_INCL'},
      { header: 'COST_PRICE_VAT_EXCL', key: 'COST_PRICE_VAT_EXCL'},
      { header: 'UOM', key: 'UOM'},
      { header: 'PACK_SIZE', key: 'PACK_SIZE'},
      { header: 'STOCK', key: 'STOCK'},
      { header: 'MINIMUM_INVENTORY', key: 'MINIMUM_INVENTORY'},
      { header: 'MAXIMUM_INVENTORY', key: 'MAXIMUM_INVENTORY'},
      { header: 'DEFAULT_REORDER_QTY', key: 'DEFAULT_REORDER_QTY'},
      { header: 'DEFAULT_REORDER_LEVEL', key: 'DEFAULT_REORDER_LEVEL'},
      { header: 'ACTIVE', key: 'ACTIVE'},   
      { header: 'CATEGORY', key: 'CATEGORY'},
      { header: 'SUB_CATEGORY', key: 'SUB_CATEGORY'}
    ];
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'MaterialMasterTemplate.xlsx');
    })
   
  }
  
  clearProgress(){
    this.progressStatus = ''
    this.totalRecords   = 0
    this.currentRecord  = 0
  }

  uploadMaterialFile(evt: any) {
    var materialData: [][]
    if (this.progress == true) {
      alert('Could not process, a mass operation going on')
      return
    }
    const target: DataTransfer = <DataTransfer>(evt.target)
    if (target.files.length !== 1) {
      alert("Cannot use multiple files")
      return
    }
    const reader: FileReader = new FileReader()
    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      materialData = (XLSX.utils.sheet_to_json(ws, { header: 1 }))

      this.progress = true
      if (this.validateMaterialMaster(materialData) == true) {
        this.progressStatus = 'Uploading... please wait'
        this.uploadMaterials(materialData)
      } else {
        alert('Invalid material file')
      }
      this.progress = false

    }
    reader.readAsBinaryString(target.files[0])
  }

  updateMaterialFile(evt: any) {
    var materialData: [][]
    if (this.progress == true) {
      alert('Could not process, a mass operation going on')
      return
    }
    const target: DataTransfer = <DataTransfer>(evt.target)
    if (target.files.length !== 1) {
      alert("Cannot use multiple files")
      return
    }
    const reader: FileReader = new FileReader()
    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      materialData = (XLSX.utils.sheet_to_json(ws, { header: 1 }))

      this.progress = true
      if (this.validateMaterialMaster(materialData) == true) {
        this.progressStatus = 'Updating... please wait'
        this.updateMaterials(materialData)
      } else {
        alert('Invalid material file')
      }
      this.progress = false
    }
    reader.readAsBinaryString(target.files[0])
  }

  validateMaterialMaster(data : any [][]) : boolean{
    this.clearProgress()
    var rows            = data.length
    var cols            = data[0].length
    this.progressStatus = 'Validating material file'
    this.totalRecords   = rows
    var valid           = true

    //validate row header
    if( data[0][0] != 'CODE'                     ||
        data[0][1] != 'DESCRIPTION'              ||
        data[0][2] != 'SHORT_DESCRIPTION'        ||
        data[0][3] != 'VAT'                      ||
        data[0][4] != 'COST_PRICE_VAT_INCL'      ||
        data[0][5] != 'COST_PRICE_VAT_EXCL'      ||
        data[0][6] != 'UOM'                      ||
        data[0][7] != 'PACK_SIZE'                ||
        data[0][8] != 'STOCK'                    ||
        data[0][9] != 'MINIMUM_INVENTORY'        ||
        data[0][10] != 'MAXIMUM_INVENTORY'       ||
        data[0][11] != 'DEFAULT_REORDER_QTY'     ||
        data[0][12] != 'DEFAULT_REORDER_LEVEL'   ||  
        data[0][13] != 'ACTIVE'                  ||
        data[0][14] != 'CATEGORY'                ||
        data[0][15] != 'SUB_CATEGORY'  
        )
    {
      valid = false
    }
    for(let i = 1; i < data.length; i++) {
      this.currentRecord = i
      //checks for empty code and name
      if( data[i][0] == '' ||
          data[i][2] == '' ||
          data[i][3] == ''      
        )
      {
        alert(i)
        valid = false
      }
    }
    this.clearProgress()
    return valid;
  }
  
  async uploadMaterials(dt : any [][]){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.clearProgress()
    var rows = dt.length
    var cols = dt[0].length
    this.progressStatus = 'Uploading material file'
    this.totalRecords = rows

    for(let i = 1; i < dt.length; i++) {
      this.currentRecord = i
      var material = {
        code                : dt[i][0],
        description         : dt[i][1],
        shortDescription    : dt[i][2],
        vat                 : dt[i][3],
        costPriceVatIncl    : dt[i][4],
        costPriceVatExcl    : dt[i][5],
        uom                 : dt[i][6],
        packSize            : dt[i][7],
        stock               : dt[i][8],
        minimumInventory    : dt[i][9],
        maximumInventory    : dt[i][10],
        defaultReorderQty   : dt[i][11],
        defaultReorderLevel : dt[i][12],
        active              : dt[i][13],      
        category            : {name : dt[i][14]},
        subCategory         : {name : dt[i][15]}
      }

      if(dt[i][0] == undefined){
        alert('End of file reached')
        return
      }
      this.spinner.show()
      await this.http.post(API_URL+'/materials/create', material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .catch(
        error => {
          console.log(error)
        }
      )
      }
    this.clearProgress()
  }

  async updateMaterials(dt : any [][]){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.clearProgress()
    var rows = dt.length
    var cols = dt[0].length
    this.progressStatus = 'Updating material file'
    this.totalRecords = rows

    for(let i = 1; i < dt.length; i++) {
      this.currentRecord = i
      var material = {
        code                : dt[i][0],
        description         : dt[i][1],
        shortDescription    : dt[i][2],
        vat                 : dt[i][3],
        costPriceVatIncl    : dt[i][4],
        costPriceVatExcl    : dt[i][5],
        uom                 : dt[i][6],
        packSize            : dt[i][7],
        stock               : dt[i][8],
        minimumInventory    : dt[i][9],
        maximumInventory    : dt[i][10],
        defaultReorderQty   : dt[i][11],
        defaultReorderLevel : dt[i][12],
        active              : dt[i][13],      
        category            : {name : dt[i][14]},
        subCategory         : {name : dt[i][15]}
      }

      if(dt[i][0] == undefined){
        alert('End of file reached')
        return
      }
      this.spinner.show()
      await this.http.put(API_URL+'/materials/update_by_code', material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .catch(
        error => {
          console.log(error)
        }
      )
      }
    this.clearProgress()
  }

  onFileChange(evt: any) {
    if (this.progress == true) {
      alert('Could not process, a mass operation going on')
      return
    }
    const target: DataTransfer = <DataTransfer>(evt.target)
    if (target.files.length !== 1) {
      alert("Cannot use multiple files")
      return
    }
    const reader: FileReader = new FileReader()
    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }))
      this.progress = true
      if (this.validateData(this.data) == true) {
        this.uploadData(this.data)
      }
      this.progress = false
    }
    reader.readAsBinaryString(target.files[0])
  }

  validateData(data :  [][]) : boolean{
    var valid = true
    for(let j = 0; j < data[0].length; j++){
      //validate the row header
    }
    for(let i = 1; i < data.length; i++) {
      for(let j = 0; j < data[i].length; j++) {
        //validate content
        //alert((data[i][j]))

      }
    }
    return valid;
  }
  uploadData(data : [][]){
    var object : any
    for(let i = 1; i < data.length; i++) {
      
    }
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}

export interface IMaterial {
  id                  : any
  code                : string
  description         : string
  shortDescription    : string
  packSize            : number
  active              : boolean
  category            : ICategory
  subCategory         : ISubCategory
  vat                 : number
  costPriceVatIncl    : number
  costPriceVatExcl    : number
  uom                 : string
  stock               : number
  minimumInventory    : number
  maximumInventory    : number
  defaultReorderLevel : number
  defaultReorderQty   : number
}