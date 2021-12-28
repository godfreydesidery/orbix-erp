import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
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
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit, IProduct {

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
              private http : HttpClient) {
    this.id               = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.shortDescription = ''
    this.commonName       = ''
    this.sellable         = true
    this.active           = true
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
    this.loadSupplierNames()
    this.loadDepartmentNames()
    this.loadCategoryNames()
    this.loadLevelOneNames()
    this.loadLevelTwoNames()
    this.loadLevelThreeNames()
    this.loadLevelFourNames()
  }

  async save() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var product = {
      id                  : this.id,
      barcode             : this.barcode,
      code                : this.code,
      description         : this.description,
      shortDescription    : this.shortDescription,
      commonName          : this.commonName,
      sellable            : this.sellable,
      active              : this.active,
      supplier            : { name : this.supplierName},
      department          : { name : this.departmentName},
      class_              : { name : this.className},
      subClass            : { name : this.subClassName},
      category            : { name : this.categoryName},
      subCategory         : { name : this.subCategoryName},
      levelOne            : { name : this.levelOneName},
      levelTwo            : { name : this.levelTwoName},
      levelThree          : { name: this.levelThreeName },
      levelFour           : { name : this.levelFourName},
      discount            : this.discount,
      vat                 : this.vat,
      profitMargin        : this.profitMargin,
      costPriceVatIncl    : this.costPriceVatIncl,
      costPriceVatExcl    : this.costPriceVatExcl,
      sellingPriceVatIncl : this.sellingPriceVatIncl,
      sellingPriceVatExcl : this.sellingPriceVatExcl,
      uom                 : this.uom,
      packSize            : this.packSize,
      stock               : this.stock,                  
      minimumInventory    : this.minimumInventory,     
      maximumInventory    : this.maximumInventory,   
      defaultReorderLevel : this.defaultReorderLevel, 
      defaultReorderQty   : this.defaultReorderQty    
    }

    if(this.id == null || this.id == ''){
      /**
       * Save a new record
       */
      await this.http.post<IProduct>(API_URL+'/products/create', product, options)
      .toPromise()
      .then(
        data => {
          alert('Product created successifully')
          this.clear()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create product')
        }
      )

    }else{
      /**
       * Update an existing record
       */
      await this.http.put<IProduct>(API_URL+'/products/update', product, options)
      .toPromise()
      .then(
        data => {
          
          alert('Sub Class updated successifully')
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update sub class')
        }
      )
    }

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

  get(id: any): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/products/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product could not be found')
      }
    )
  }
  getByBarcode(barcode: string): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product could not be found')
      }
    )
  }
  getByCode(code: string): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
    .toPromise()
    .then(
      data => {
        console.log(data)
        this.show(data)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product could not be found')
      }
    )
  }
  getByDescription(description: string): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
    .toPromise()
    .then(
      data => {
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Product could not be found')
      }
    )
  }
  delete(id: any): void {
    if(!window.confirm('Confirm deleting the selected product')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.delete(API_URL+'/products/delete?id='+id, options)
    .toPromise()
    .then(
      () => {
        alert('Record deleted successifully')
        this.clear()
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete product')
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
    this.sellable         = true
    this.active           = true
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

  loadSupplierNames(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.subCategoryNames = []
    this.http.get<string[]>(API_URL+'/suppliers/get_names', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.supplierNames.push(element)
        })
      }
    )
    .catch(
      error => {
        console.log(error)
      }
    )
  }

  async loadDepartmentNames(){
    /**
     * Gets a list of department names
     */
    this.departmentNames = []
    this.classNames = []
    this.subClassNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IDepartment[]>(API_URL+'/departments', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.departmentNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load departments')
      }
    )
  }

  async loadClassNames(departmentName : string){
    /**
     * Gets a list of class names
     */
    this.classNames = []
    this.subClassNames = []
    if(departmentName == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IClass[]>(API_URL+'/classes/get_by_department_name?department_name='+departmentName, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.classNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load classes')
      }
    )
  }

  async loadSubClassNames(className : string){
    /**
     * Gets a list of class names
     */
    this.subClassNames = []
    if(className == ''){
      return
    }
    
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ISubClass[]>(API_URL+'/sub_classes/get_by_class_name?class_name='+className, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.subClassNames.push(element.name)
         
        })
        console.log(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load sub classes')
      }
    )
  }

  async loadCategoryNames(){
    /**
     * Gets a list of category names
     */
    this.categoryNames = []
    this.subCategoryNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ICategory[]>(API_URL+'/categories', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.categoryNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load categories')
      }
    )
  }

  async loadSubCategoryNames(categoryName : string){
    /**
     * Gets a list of sub category names
     */
    this.subCategoryNames = []
    if(categoryName == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ISubCategory[]>(API_URL+'/sub_categories/get_by_category_name?category_name='+categoryName, options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.subCategoryNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load sub categories')
      }
    )
  }

  async loadLevelOneNames(){
    /**
     * Gets a list of group names
     */
    this.levelOneNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelOne[]>(API_URL+'/group_level_ones', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelOneNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  async loadLevelTwoNames(){
    /**
     * Gets a list of groups names
     */
    this.levelTwoNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelTwo[]>(API_URL+'/group_level_twos', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelTwoNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  async loadLevelThreeNames(){
    /**
     * Gets a list of groups names
     */
    this.levelThreeNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelThree[]>(API_URL+'/group_level_threes', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelThreeNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  async loadLevelFourNames(){
    /**
     * Gets a list of groups names
     */
    this.levelFourNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelFour[]>(API_URL+'/group_level_fours', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelFourNames.push(element.name)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface IProduct{
  id                  : any
  barcode             : string
  code                : string
  description         : string
  shortDescription    : string
  commonName          : string
  sellable            : boolean
  active              : boolean
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
  

  save() : void
  get(id : any) : void
  getByBarcode(barcode : string) : void
  getByCode(code : string) : void
  getByDescription(description : string) : void
  delete(id : any) : void
  show(data : any) : void
  clear() : void
}
