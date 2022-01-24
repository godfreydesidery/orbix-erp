import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { ISupplier } from 'src/app/supplier/supplier-master/supplier-master.component';
import { environment } from 'src/environments/environment';
import { ICategory } from '../category/category.component';
import { IClass } from '../class/class.component';
import { IDepartment } from '../department/department.component';
import { ILevelOne } from '../group-level1/group-level1.component';
import { ILevelTwo } from '../group-level2/group-level2.component';
import { ILevelThree } from '../group-level3/group-level3.component';
import { ILevelFour } from '../group-level4/group-level4.component';
import { IProduct } from '../product-master/product-master.component';
import { ISubCategory } from '../sub-category/sub-category.component';
import { ISubClass } from '../sub-class/sub-class.component';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-product-inquiry',
  templateUrl: './product-inquiry.component.html',
  styleUrls: ['./product-inquiry.component.scss']
})
export class ProductInquiryComponent implements OnInit {

  public barcodeLocked     : boolean = true
  public codeLocked        : boolean = true
  public descriptionLocked : boolean = true
  public inputsLocked      : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  id                  : any
  barcode             : string
  code                : string
  description         : string
  shortDescription    : string
  commonName          : string
  sellable            : boolean
  active              : boolean
  supplier!           : ISupplier
  department!         : IDepartment
  class_!             : IClass
  subClass!           : ISubClass
  category!           : ICategory
  subCategory!        : ISubCategory
  levelOne!           : ILevelOne
  levelTwo!           : ILevelTwo
  levelThree!         : ILevelThree
  levelFour!          : ILevelFour
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

  supplierName    : string
  departmentName  : string
  className       : string
  subClassName    : string
  categoryName    : string
  subCategoryName : string
  levelOneName    : string
  levelTwoName    : string
  levelThreeName  : string
  levelFourName   : string

  descriptions : string[]
  supplierNames    : string[]
  departmentNames  : string[]
  classNames       : string[]
  subClassNames    : string[]
  categoryNames    : string[]
  subCategoryNames : string[]
  levelOneNames    : string[]
  levelTwoNames    : string[]
  levelThreeNames  : string[]
  levelFourNames   : string[]


  

  constructor(private shortcut : ShortCutHandlerService,
              private auth : AuthService,
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
    this.id               = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.shortDescription = ''
    this.commonName       = ''
    this.sellable         = false
    this.active           = false
    this.supplier
    this.department
    this.class_
    this.subClass
    this.category
    this.subCategory
    this.levelOne
    this.levelTwo
    this.levelThree
    this.levelFour
    this.discount            = 0
    this.vat                 = 0
    this.profitMargin        = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0
    this.uom                 = ''
    this.packSize            = 1
    this.stock               = 0        
    this.minimumInventory    = 0     
    this.maximumInventory    = 0     
    this.defaultReorderLevel = 0   
    this.defaultReorderQty   = 0    

    this.supplierName    = ''
    this.departmentName  = ''
    this.className       = ''
    this.subClassName    = ''
    this.categoryName    = ''
    this.subCategoryName = ''
    this.levelOneName    = ''
    this.levelTwoName    = ''
    this.levelThreeName  = ''
    this.levelFourName   = ''

    this.descriptions     = []
    this.supplierNames    = []  
    this.departmentNames  = []
    this.classNames       = []
    this.subClassNames    = []  
    this.categoryNames    = []
    this.subCategoryNames = []
    this.levelOneNames    = []
    this.levelTwoNames    = []
    this.levelThreeNames  = []
    this.levelFourNames   = [] 
  }
  
  ngOnInit(): void {
    this.loadProductDescriptions()
  }

  search(){
    if(this.barcode != ''){
      this.getByBarcode(this.barcode)
    }else if(this.code != ''){
      this.getByCode(this.code)
    }else if(this.description != ''){
      this.getByDescription(this.description)
    }else{
      alert('Please enter a search key')
    }
  }

  async get(id: any): Promise<void> {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct>(API_URL+'/products/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product not found')
      }
    )
  }
  async getByBarcode(barcode: string): Promise<void> {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product not found')
      }
    )
  }
  async getByCode(code: string): Promise<void> {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product not found')
      }
    )
  }
  async getByDescription(description: string): Promise<void> {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product not found')
      }
    )
  }
  
  show(data: any): void {
    try{
    this.id                  = data['id']
    this.barcode             = data['barcode']
    this.code                = data['code']
    this.description         = data['description']
    this.shortDescription    = data['shortDescription']
    this.commonName          = data['commonName']
    this.sellable            = data['sellable']
    this.active              = data['active']
    this.discount            = data['discount']
    this.vat                 = data['vat']
    this.profitMargin        = data['profitMargin']
    this.costPriceVatIncl    = data['costPriceVatIncl']
    this.costPriceVatExcl    = data['costPriceVatExcl']
    this.sellingPriceVatIncl = data['sellingPriceVatIncl']
    this.sellingPriceVatExcl = data['sellingPriceVatExcl']
    this.uom                 = data['uom']
    this.packSize            = data['packSize']
    this.stock               = data['stock']            
    this.minimumInventory    = data['minimumInventory']   
    this.maximumInventory    = data['maximumInventory']
    this.defaultReorderLevel = data['defaultReorderLevel']
    this.defaultReorderQty   = data['defaultReorderQty'] 
    this.supplierName        = data['supplier']?.name
    this.departmentName      = data['department']?.name
    this.className           = data['class_']?.name
    this.subClassName        = data['subClass']?.name
    this.categoryName        = data['category']?.name
    this.subCategoryName     = data['subCategory']?.name
    this.levelOneName        = data['levelOne']?.name
    this.levelTwoName        = data['levelTwo']?.name
    this.levelThreeName      = data['levelThree']?.name
    this.levelFourName       = data['levelFour']?.name
    }catch(e : any){console.log(e)}

  }
  clear(): void {
    this.id               = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.shortDescription = ''
    this.commonName       = ''
    this.sellable         = false
    this.active           = false
    this.discount            = 0
    this.vat                 = 0
    this.profitMargin        = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0
    this.uom                 = ''
    this.packSize            = 1
    this.stock               = 0        
    this.minimumInventory    = 0
    this.maximumInventory    = 0
    this.defaultReorderLevel = 0
    this.defaultReorderQty   = 0

    this.supplierName    = ''
    this.departmentName  = ''
    this.className       = ''
    this.subClassName    = ''
    this.categoryName    = ''
    this.subCategoryName = ''
    this.levelOneName    = ''
    this.levelTwoName    = ''
    this.levelThreeName  = ''
    this.levelFourName   = ''

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
        console.log(data)
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

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}