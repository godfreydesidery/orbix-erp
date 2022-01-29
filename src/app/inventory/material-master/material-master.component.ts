import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { ISupplier } from 'src/app/supplier/supplier-master/supplier-master.component';
import { ICategory } from '../category/category.component';
import { ISubCategory } from '../sub-category/sub-category.component';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

const API_URL = environment.apiUrl;



@Component({
  selector: 'app-material-master',
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss']
})
export class MaterialMasterComponent implements OnInit {

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
  active              : boolean
  category!           : ICategory
  subCategory!        : ISubCategory
  vat                 : number
  costPriceVatIncl    : number
  costPriceVatExcl    : number
  stock               : number
  uom                 : string
  minimumInventory    : number
  maximumInventory    : number
  defaultReorderLevel : number
  defaultReorderQty   : number

  categoryName    : string
  subCategoryName : string
  
  categoryNames    : string[]
  subCategoryNames : string[]

  materials  : IMaterial[]

  descriptions : string[] = []

  constructor(private shortcut : ShortCutHandlerService,
              private auth : AuthService,
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
    this.id               = ''
    this.barcode          = ''
    this.code             = ''
    this.description      = ''
    this.shortDescription = ''
    this.active           = true
    this.category
    this.subCategory
    this.vat                 = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
    this.stock               = 0   
    this.uom                 = ''     
    this.minimumInventory    = 0     
    this.maximumInventory    = 0     
    this.defaultReorderLevel = 0   
    this.defaultReorderQty   = 0 

    this.categoryName    = ''
    this.subCategoryName = ''

    this.categoryNames    = []
    this.subCategoryNames = []

    this.materials = []
  }
 
  ngOnInit(): void {
    this.loadCategoryNames()
    this.loadMaterials()
    this.loadMaterialDescriptions()
  }

  async loadMaterials(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.materials = []
    this.spinner.show()
    await this.http.get<IMaterial[]>(API_URL+'/materials', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(data => {
      data?.forEach(element => {
        var material = {
          id                  : element!.id,
          code                : element!.code,
          description         : element!.description,
          shortDescription    : element!.shortDescription,
          uom                 : element!.uom
        }
        this.materials.push(material)
      })     
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load materials')
    })

  }

  async save() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material = {
      id                  : this.id,
      barcode             : this.barcode,
      code                : this.code,
      description         : this.description,
      shortDescription    : this.shortDescription,
      active              : this.active,
      category            : { name : this.categoryName},
      subCategory         : { name : this.subCategoryName},
      vat                 : this.vat,
      costPriceVatIncl    : this.costPriceVatIncl,
      costPriceVatExcl    : this.costPriceVatExcl,
      stock               : this.stock,   
      uom                 : this.uom,               
      minimumInventory    : this.minimumInventory,     
      maximumInventory    : this.maximumInventory,   
      defaultReorderLevel : this.defaultReorderLevel, 
      defaultReorderQty   : this.defaultReorderQty  
    }

    if(this.id == null || this.id == ''){
      /**
       * Save a new record
       */
      this.spinner.show()
      await this.http.post<IMaterial>(API_URL+'/materials/create', material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.loadMaterials()
          alert('Material created successifully')
          this.clear()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create material')
        }
      )

    }else{
      /**
       * Update an existing record
       */
      this.spinner.show()
      await this.http.put<IMaterial>(API_URL+'/materials/update', material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          
          alert('Material updated successifully')
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update material')
        }
      )
    }

  }

  search(){
    if(this.code != ''){
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
    this.spinner.show()
    this.http.get<IMaterial>(API_URL+'/materials/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.lockAll()
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Material not found')
      }
    )
  }
  
  getByCode(code: string): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IMaterial>(API_URL+'/materials/get_by_code?code='+code, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.lockAll()
        this.show(data)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Material not found')
      }
    )
  }
  getByDescription(description: string): void {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IMaterial>(API_URL+'/materials/get_by_description?description='+description, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.lockAll()
        this.show(data)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Requested Material not found')
      }
    )
  }
  delete(id: any): void {
    if(!window.confirm('Confirm deleting the selected material')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.delete(API_URL+'/materials/delete?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        alert('Record deleted successifully')
        this.clear()
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete material')
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
    this.active              = data['active']
    this.vat                 = data['vat']
    this.costPriceVatIncl    = data['costPriceVatIncl']
    this.costPriceVatExcl    = data['costPriceVatExcl']
    this.stock               = data['stock']
    this.uom                 = data['uom']            
    this.minimumInventory    = data['minimumInventory']   
    this.maximumInventory    = data['maximumInventory']
    this.defaultReorderLevel = data['defaultReorderLevel']
    this.defaultReorderQty   = data['defaultReorderQty'] 
    this.categoryName        = data['category'].name
    this.subCategoryName     = data['subCategory'].name
    }catch(e : any){}

  }
  clear(): void {
    this.id                  = ''
    this.code                = ''
    this.description         = ''
    this.shortDescription    = ''
    this.active              = true
    this.vat                 = 0
    this.costPriceVatIncl    = 0
    this.costPriceVatExcl    = 0
    this.stock               = 0  
    this.uom                 = ''      
    this.minimumInventory    = 0
    this.maximumInventory    = 0
    this.defaultReorderLevel = 0
    this.defaultReorderQty   = 0

    this.categoryName    = ''
    this.subCategoryName = ''

    this.unlockAll()
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
    this.spinner.show()
    await this.http.get<ICategory[]>(API_URL+'/categories', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<ISubCategory[]>(API_URL+'/sub_categories/get_by_category_name?category_name='+categoryName, options)
    .pipe(finalize(() => this.spinner.hide()))
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

  async loadMaterialDescriptions(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<string[]>(API_URL+'/materials/get_descriptions', options)
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
        alert('Could not load material descriptions')
      }
    )
  }

  unlockAll(){
    this.barcodeLocked     = false
    this.codeLocked        = false 
    this.descriptionLocked = false
    this.inputsLocked      = false
    if(!(this.id == null || this.id == '')){
      this.codeLocked = true
    }
  }

  lockAll(){
    this.barcodeLocked     = true
    this.codeLocked        = true 
    this.descriptionLocked = true
    this.inputsLocked      = true
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface IMaterial{
  id               : any
  code             : string
  description      : string
  shortDescription : string
  uom              : string
}