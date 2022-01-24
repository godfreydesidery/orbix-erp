import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';

import { Workbook } from 'exceljs';
import { ISupplier } from 'src/app/supplier/supplier-master/supplier-master.component';
import { ICategory } from '../category/category.component';
import { IClass } from '../class/class.component';
import { IDepartment } from '../department/department.component';
import { ILevelOne } from '../group-level1/group-level1.component';
import { ILevelTwo } from '../group-level2/group-level2.component';
import { ILevelThree } from '../group-level3/group-level3.component';
import { ILevelFour } from '../group-level4/group-level4.component';
import { ISubCategory } from '../sub-category/sub-category.component';
import { ISubClass } from '../sub-class/sub-class.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
const fs = require('file-saver');

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-product-mass-manager',
  templateUrl: './product-mass-manager.component.html',
  styleUrls: ['./product-mass-manager.component.scss']
})
export class ProductMassManagerComponent implements OnInit {
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

  async exportProductToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('ProductSheet')
   
    worksheet.columns = [
      { header: 'CODE', key: 'CODE'},
      { header: 'BARCODE', key: 'BARCODE'},
      { header: 'DESCRIPTION', key: 'DESCRIPTION'},
      { header: 'SHORT_DESCRIPTION', key: 'SHORT_DESCRIPTION'},
      { header: 'COMMON_NAME', key: 'COMMON_NAME'},
      { header: 'DISCOUNT', key: 'DISCOUNT'},
      { header: 'VAT', key: 'VAT'},
      { header: 'PROFIT_MARGIN', key: 'PROFIT_MARGIN'},
      { header: 'COST_PRICE_VAT_INCL', key: 'COST_PRICE_VAT_INCL'},
      { header: 'COST_PRICE_VAT_EXCL', key: 'COST_PRICE_VAT_EXCL'},
      { header: 'SELLING_PRICE_VAT_INCL', key: 'SELLING_PRICE_VAT_INCL'},
      { header: 'SELLING_PRICE_VAT_EXCL', key: 'SELLING_PRICE_VAT_EXCL'},
      { header: 'UOM', key: 'UOM'},
      { header: 'PACK_SIZE', key: 'PACK_SIZE'},
      { header: 'STOCK', key: 'STOCK'},
      { header: 'MINIMUM_INVENTORY', key: 'MINIMUM_INVENTORY'},
      { header: 'MAXIMUM_INVENTORY', key: 'MAXIMUM_INVENTORY'},
      { header: 'DEFAULT_REORDER_QTY', key: 'DEFAULT_REORDER_QTY'},
      { header: 'DEFAULT_REORDER_LEVEL', key: 'DEFAULT_REORDER_LEVEL'},
      { header: 'ACTIVE', key: 'ACTIVE'},
      { header: 'SELLABLE', key: 'SELLABLE'},
      { header: 'INGREDIENTS', key: 'INGREDIENTS'},
      { header: 'SUPPLIER', key: 'SUPPLIER'},
      { header: 'DEPARTMENT', key: 'DEPARTMENT'},
      { header: 'CLASS', key: 'CLASS'},
      { header: 'SUB_CLASS', key: 'SUB_CLASS'},
      { header: 'CATEGORY', key: 'CATEGORY'},
      { header: 'SUB_CATEGORY', key: 'SUB_CATEGORY'},
      { header: 'LEVEL_ONE', key: 'LEVEL_ONE'},
      { header: 'LEVEL_TWO', key: 'LEVEL_TWO'},
      { header: 'LEVEL_THREE', key: 'LEVEL_THREE'},
      { header: 'LEVEL_FOUR', key: 'LEVEL_FOUR'}
    ];

    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct[]>(API_URL+'/products', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {         
          var supplierName    = ''
          var departmentName  = ''
          var className       = ''
          var subClassName    = ''
          var categoryName    = ''
          var subCategoryName = ''
          var levelOneName    = ''
          var levelTwoName    = ''
          var levelThreeName  = ''
          var levelFourName   = ''

          if(element.supplier != null){
            supplierName =element.supplier.name
          }
          if(element.department != null){
            departmentName =element.department.name
          }
          if(element.class_ != null){
            className =element.class_.name
          }
          if(element.subClass != null){
            subClassName =element.subClass.name
          }
          if(element.category != null){
            categoryName =element.category.name
          }
          if(element.subCategory != null){
            subCategoryName =element.subCategory.name
          }
          if(element.levelOne != null){
            levelOneName =element.levelOne.name
          }
          if(element.levelTwo != null){
            levelTwoName =element.levelTwo.name
          }
          if(element.levelThree != null){
            levelThreeName =element.levelThree.name
          }
          if(element.levelFour != null){
            levelFourName =element.levelFour.name
          }
          worksheet.addRow(
            {
              CODE                   : element.code,
              BARCODE                : element.barcode,
              DESCRIPTION            : element.description,
              SHORT_DESCRIPTION      : element.shortDescription,
              COMMON_NAME            : element.commonName,
              DISCOUNT               : element.discount,
              VAT                    : element.vat,
              PROFIT_MARGIN          : element.profitMargin,
              COST_PRICE_VAT_INCL    : element.costPriceVatIncl,
              COST_PRICE_VAT_EXCL    : element.costPriceVatExcl,
              SELLING_PRICE_VAT_INCL : element.sellingPriceVatIncl,
              SELLING_PRICE_VAT_EXCL : element.sellingPriceVatExcl,
              UOM                    : element.uom,
              PACK_SIZE              : element.packSize,
              STOCK                  : element.stock,
              MINIMUM_INVENTORY      : element.minimumInventory,
              MAXIMUM_INVENTORY      : element.maximumInventory,
              DEFAULT_REORDER_QTY    : element.defaultReorderQty,
              DEFAULT_REORDER_LEVEL  : element.defaultReorderLevel,
              ACTIVE                 : element.active,
              SELLABLE               : element.sellable,
              INGREDIENTS            : element.ingredients,
              SUPPLIER               : supplierName,
              DEPARTMENT             : departmentName,
              CLASS                  : className!,
              SUB_CLASS              : subClassName,
              CATEGORY               : categoryName,
              SUB_CATEGORY           : subCategoryName,
              LEVEL_ONE              : levelOneName,
              LEVEL_TWO              : levelTwoName,
              LEVEL_THREE            : levelThreeName,
              LEVEL_FOUR             : levelFourName
            },"n"
          )
        })
        this.spinner.hide()
      }
    )
    .catch(
      error => {
        console.log(error)
      }
    )
   
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ProductMaster.xlsx');
    })
   
  }

  exportTemplateToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('TemplateSheet')
   
    worksheet.columns = [
      { header: 'CODE', key: 'CODE'},
      { header: 'BARCODE', key: 'BARCODE'},
      { header: 'DESCRIPTION', key: 'DESCRIPTION'},
      { header: 'SHORT_DESCRIPTION', key: 'SHORT_DESCRIPTION'},
      { header: 'COMMON_NAME', key: 'COMMON_NAME'},
      { header: 'DISCOUNT', key: 'DISCOUNT'},
      { header: 'VAT', key: 'VAT'},
      { header: 'PROFIT_MARGIN', key: 'PROFIT_MARGIN'},
      { header: 'COST_PRICE_VAT_INCL', key: 'COST_PRICE_VAT_INCL'},
      { header: 'COST_PRICE_VAT_EXCL', key: 'COST_PRICE_VAT_EXCL'},
      { header: 'SELLING_PRICE_VAT_INCL', key: 'SELLING_PRICE_VAT_INCL'},
      { header: 'SELLING_PRICE_VAT_EXCL', key: 'SELLING_PRICE_VAT_EXCL'},
      { header: 'UOM', key: 'UOM'},
      { header: 'PACK_SIZE', key: 'PACK_SIZE'},
      { header: 'STOCK', key: 'STOCK'},
      { header: 'MINIMUM_INVENTORY', key: 'MINIMUM_INVENTORY'},
      { header: 'MAXIMUM_INVENTORY', key: 'MAXIMUM_INVENTORY'},
      { header: 'DEFAULT_REORDER_QTY', key: 'DEFAULT_REORDER_QTY'},
      { header: 'DEFAULT_REORDER_LEVEL', key: 'DEFAULT_REORDER_LEVEL'},
      { header: 'ACTIVE', key: 'ACTIVE'},
      { header: 'SELLABLE', key: 'SELLABLE'},
      { header: 'INGREDIENTS', key: 'INGREDIENTS'},
      { header: 'SUPPLIER', key: 'SUPPLIER'},
      { header: 'DEPARTMENT', key: 'DEPARTMENT'},
      { header: 'CLASS', key: 'CLASS'},
      { header: 'SUB_CLASS', key: 'SUB_CLASS'},
      { header: 'CATEGORY', key: 'CATEGORY'},
      { header: 'SUB_CATEGORY', key: 'SUB_CATEGORY'},
      { header: 'LEVEL_ONE', key: 'LEVEL_ONE'},
      { header: 'LEVEL_TWO', key: 'LEVEL_TWO'},
      { header: 'LEVEL_THREE', key: 'LEVEL_THREE'},
      { header: 'LEVEL_FOUR', key: 'LEVEL_FOUR'}
    ];
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ProductMasterTemplate.xlsx');
    })
   
  }
  
  clearProgress(){
    this.progressStatus = ''
    this.totalRecords   = 0
    this.currentRecord  = 0
  }

  uploadProductFile(evt: any) {
    var productData: [][]
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
      productData = (XLSX.utils.sheet_to_json(ws, { header: 1 }))

      this.progress = true
      if (this.validateProductMaster(productData) == true) {
        this.progressStatus = 'Uploading... please wait'
        this.uploadProducts(productData)
      } else {
        alert('Invalid product file')
      }
      this.progress = false

    }
    reader.readAsBinaryString(target.files[0])
  }

  updateProductFile(evt: any) {
    var productData: [][]
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
      productData = (XLSX.utils.sheet_to_json(ws, { header: 1 }))

      this.progress = true
      if (this.validateProductMaster(productData) == true) {
        this.progressStatus = 'Updating... please wait'
        this.updateProducts(productData)
      } else {
        alert('Invalid product file')
      }
      this.progress = false
    }
    reader.readAsBinaryString(target.files[0])
  }

  validateProductMaster(data : any [][]) : boolean{
    this.clearProgress()
    var rows            = data.length
    var cols            = data[0].length
    this.progressStatus = 'Validating product file'
    this.totalRecords   = rows
    var valid           = true

    //validate row header
    if( data[0][0] != 'CODE'                     ||
        data[0][1] != 'BARCODE'                  ||
        data[0][2] != 'DESCRIPTION'              ||
        data[0][3] != 'SHORT_DESCRIPTION'        ||
        data[0][4] != 'COMMON_NAME'              ||
        data[0][5] != 'DISCOUNT'                 ||
        data[0][6] != 'VAT'                      ||
        data[0][7] != 'PROFIT_MARGIN'            ||
        data[0][8] != 'COST_PRICE_VAT_INCL'      ||
        data[0][9] != 'COST_PRICE_VAT_EXCL'      ||
        data[0][10] != 'SELLING_PRICE_VAT_INCL'  ||
        data[0][11] != 'SELLING_PRICE_VAT_EXCL'  ||
        data[0][12] != 'UOM'                     ||
        data[0][13] != 'PACK_SIZE'               ||
        data[0][14] != 'STOCK'                   ||
        data[0][15] != 'MINIMUM_INVENTORY'       ||
        data[0][16] != 'MAXIMUM_INVENTORY'       ||
        data[0][17] != 'DEFAULT_REORDER_QTY'     ||
        data[0][18] != 'DEFAULT_REORDER_LEVEL'   ||  
        data[0][19] != 'ACTIVE'                  ||
        data[0][20] != 'SELLABLE'                ||
        data[0][21] != 'INGREDIENTS'             ||
        data[0][22] != 'SUPPLIER'                ||
        data[0][23] != 'DEPARTMENT'              ||
        data[0][24] != 'CLASS'                   ||
        data[0][25] != 'SUB_CLASS'               ||
        data[0][26] != 'CATEGORY'                ||
        data[0][27] != 'SUB_CATEGORY'            ||
        data[0][28] != 'LEVEL_ONE'               ||
        data[0][29] != 'LEVEL_TWO'               ||
        data[0][30] != 'LEVEL_THREE'             ||
        data[0][31] != 'LEVEL_FOUR'  
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
  
  async uploadProducts(dt : any [][]){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.clearProgress()
    var rows = dt.length
    var cols = dt[0].length
    this.progressStatus = 'Uploading product file'
    this.totalRecords = rows

    for(let i = 1; i < dt.length; i++) {
      this.currentRecord = i
      var product = {
        code                : dt[i][0],
        barcode             : dt[i][1],
        description         : dt[i][2],
        shortDescription    : dt[i][3],
        commonName          : dt[i][4],
        discount            : dt[i][5],
        vat                 : dt[i][6],
        profitMargin        : dt[i][7],
        costPriceVatIncl    : dt[i][8],
        costPriceVatExcl    : dt[i][9],
        sellingPriceVatIncl : dt[i][10],
        sellingPriceVatExcl : dt[i][11],
        uom                 : dt[i][12],
        packSize            : dt[i][13],
        stock               : dt[i][14],
        minimumInventory    : dt[i][15],
        maximumInventory    : dt[i][16],
        defaultReorderQty   : dt[i][17],
        defaultReorderLevel : dt[i][18],
        active              : dt[i][19],
        sellable            : dt[i][20],
        ingredients         : dt[i][21],
        supplier            : {name : dt[i][22]},
        department          : {name : dt[i][23]},
        class_              : {name : dt[i][24]},
        subClass            : {name : dt[i][25]},
        category            : {name : dt[i][26]},
        subCategory         : {name : dt[i][27]},
        levelOne            : {name : dt[i][28]},
        levelTwo            : {name : dt[i][29]},
        levelThree          : {name : dt[i][30]},
        levelFour           : {name : dt[i][31]}
      }

      if(dt[i][0] == undefined){
        alert('End of file reached')
        return
      }
      this.spinner.show()
      await this.http.post(API_URL+'/products/create', product, options)
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

  async updateProducts(dt : any [][]){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.clearProgress()
    var rows = dt.length
    var cols = dt[0].length
    this.progressStatus = 'Updating product file'
    this.totalRecords = rows

    for(let i = 1; i < dt.length; i++) {
      this.currentRecord = i
      var product = {
        code                : dt[i][0],
        barcode             : dt[i][1],
        description         : dt[i][2],
        shortDescription    : dt[i][3],
        commonName          : dt[i][4],
        discount            : dt[i][5],
        vat                 : dt[i][6],
        profitMargin        : dt[i][7],
        costPriceVatIncl    : dt[i][8],
        costPriceVatExcl    : dt[i][9],
        sellingPriceVatIncl : dt[i][10],
        sellingPriceVatExcl : dt[i][11],
        uom                 : dt[i][12],
        packSize            : dt[i][13],
        stock               : dt[i][14],
        minimumInventory    : dt[i][15],
        maximumInventory    : dt[i][16],
        defaultReorderQty   : dt[i][17],
        defaultReorderLevel : dt[i][18],
        active              : dt[i][19],
        sellable            : dt[i][20],
        ingredients         : dt[i][21],
        supplier            : {name : dt[i][22]},
        department          : {name : dt[i][23]},
        class_              : {name : dt[i][24]},
        subClass            : {name : dt[i][25]},
        category            : {name : dt[i][26]},
        subCategory         : {name : dt[i][27]},
        levelOne            : {name : dt[i][28]},
        levelTwo            : {name : dt[i][29]},
        levelThree          : {name : dt[i][30]},
        levelFour           : {name : dt[i][31]}
      }

      if(dt[i][0] == undefined){
        alert('End of file reached')
        return
      }
      this.spinner.show()
      await this.http.put(API_URL+'/products/update_by_code', product, options)
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

export interface IProduct {
  id                  : any
  barcode             : string
  code                : string
  description         : string
  shortDescription    : string
  commonName          : string
  sellable            : boolean
  active              : boolean
  ingredients         : string
  supplier            : ISupplier
  department          : IDepartment
  class_              : IClass
  subClass            : ISubClass
  category            : ICategory
  subCategory         : ISubCategory
  levelOne            : ILevelOne
  levelTwo            : ILevelTwo
  levelThree          : ILevelThree
  levelFour           : ILevelFour
  discount            : number
  vat                 : number
  profitMargin        : number
  costPriceVatIncl    : number
  costPriceVatExcl    : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number
  uom                 : string
  packSize            : number
  stock               : number
  minimumInventory    : number
  maximumInventory    : number
  defaultReorderLevel : number
  defaultReorderQty   : number
}