import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-product-material-ratio',
  templateUrl: './product-material-ratio.component.html',
  styleUrls: ['./product-material-ratio.component.scss']
})
export class ProductMaterialRatioComponent implements OnInit {

  id        : any
  product!  : IProduct
  material! : IMaterial
  ratio     : number

  productId          : any
  barcode            : string
  productCode        : string
  productDescription : string
  productQty         : number
  productUom         : string

  materialId          : any
  materialCode        : string
  materialDescription : string

  materialQty : number
  materialUom : string



  productDescriptions  : string[] = []
  materialDescriptions : string[] = []

  ratios : IProductMaterialRatio[] = []

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService,
              private spinner: NgxSpinnerService) {

      this.id    = null
      this.ratio = 0

      this.productId          = null
      this.barcode            = ''
      this.productCode        = ''
      this.productDescription = ''
      this.productQty         = 0
      this.productUom         = ''

      this.materialId          = null
      this.materialCode        = ''
      this.materialDescription = ''
      this.materialQty         = 0
      this.materialUom         = ''
    }

  ngOnInit(): void {
    this.loadProductDescriptions()
    this.loadMaterialDescriptions()
    this.loadRatios()
  }

  new(){
    this.id                  = null
    this.productId           = null
    this.barcode             = ''
    this.productCode         = ''
    this.productDescription  = ''
    this.productQty          = 0
    this.productUom          = ''
    this.materialId          = null
    this.materialCode        = ''
    this.materialDescription = ''
    this.materialQty         = 0
    this.materialUom         = ''
  }

  async save(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    if(this.materialQty <= 0 || this.productQty <= 0){
      alert('Invalid values in product and or material quantities')
      return
    }
    this.ratio = this.materialQty / this.productQty
    
    var ratio :IProductMaterialRatio  = {
      id      : this.id,
      product : {
        id          : this.productId,
        barcode     : this.barcode,
        code        : this.productCode,
        description : this.productDescription,
        uom         : this.productUom
      },
      material : {
        id          : this.materialId,
        code        : this.materialCode,
        description : this.materialDescription,
        uom         : this.materialUom
      },
      ratio    : this.ratio
    }
    if(this.id == null || this.id == ''){
      this.spinner.show()
      await this.http.post(API_URL+'/product_material_ratios/create', ratio, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(data => {
        this.loadRatios()
        alert('Ratio  created successifully')
      })
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'could not create ratio')
      })
      
    }else{
      this.spinner.show()
      await this.http.put(API_URL+'/product_material_ratios/update', ratio, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(data => {
        this.loadRatios()
        alert('Ratio  updated successifully')
      })
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'could not update ratio')
      })
    }
  }

  searchProduct(barcode : string, code : string, description : string){
    this.id = null
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
          this.productId          = data!.id
          this.barcode            = data!.barcode
          this.productCode        = data!.code
          this.productDescription = data!.description
          this.productUom         = data!.uom
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
          this.productId          = data!.id
          this.barcode            = data!.barcode
          this.productCode        = data!.code
          this.productDescription = data!.description
          this.productUom         = data!.uom
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
          this.productId          = data!.id
          this.barcode            = data!.barcode
          this.productCode        = data!.code
          this.productDescription = data!.description
          this.productUom         = data!.uom
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }
  }

  searchMaterial(code : string, description : string){
    this.id = null
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
   if(code != ''){
      this.spinner.show()
      this.http.get<IMaterial>(API_URL+'/materials/get_by_code?code='+code, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.materialId          = data!.id
          this.materialCode        = data!.code
          this.materialDescription = data!.description
          this.materialUom         = data!.uom
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Material not found')
      })
    }else{
      //search by description
      this.spinner.show()
      this.http.get<IMaterial>(API_URL+'/materials/get_by_description?description='+description, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.materialId          = data!.id
          this.materialCode        = data!.code
          this.materialDescription = data!.description
          this.materialUom         = data!.uom
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Material not found')
      })
    }
  }

  async loadRatios(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.ratios = []
    this.spinner.show()
    await this.http.get<IProductMaterialRatio[]>(API_URL+'/product_material_ratios', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(data => {
      data?.forEach(element => {
        this.ratios.push(element)
      })
    })
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load ratios')
    })

  }

  resetProduct(){
    this.productId          = null
    this.barcode            = ''
    this.productCode        = ''
    this.productDescription = ''
    this.productUom         = ''
    this.productQty         = 0
  }

  resetMaterial(){
    this.materialId          = null
    this.materialCode        = ''
    this.materialDescription = ''
    this.materialUom         = ''
    this.materialQty         = 0
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
        this.productDescriptions = []
        data?.forEach(element => {
          this.productDescriptions.push(element)
        })
      },
      error => {
        alert('Could not load product descriptions')
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
        this.materialDescriptions = []
        data?.forEach(element => {
          this.materialDescriptions.push(element)
        })
        console.log(data)
      },
      error => {
        alert('Could not load material descriptions')
      }
    )
  }

  async get(id : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProductMaterialRatio>(API_URL+'/product_material_ratios/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(data => {
      this.id                  = data?.id
      this.productId           = data!.product.id
      this.barcode             = data!.product.barcode
      this.productCode         = data!.product.code
      this.productDescription  = data!.product.description
      this.productUom          = data!.product.uom
      this.materialId          = data!.material.id
      this.materialCode        = data!.material.code
      this.materialDescription = data!.material.description
      this.materialId          = data!.material.id
      this.ratio               = data!.ratio
      this.productQty          = 1
      this.materialQty         = this.ratio
    })
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load ratio')
    })
  }

  async deleteRatio(id : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.delete(API_URL+'/product_material_ratios/delete?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(() => {
      alert('Deleted ratio')
    })
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete ratio')
    })
    this.loadRatios()
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}

export interface IProduct{
  id          : any
  barcode     : string
  code        : string
  description : string
  uom         : string
}

export interface IMaterial{
  id          : any
  code        : string
  description : string
  uom         : string
}

export interface IProductMaterialRatio{
  id          : any
  product     : IProduct
  material    : IMaterial
  ratio       : number
}