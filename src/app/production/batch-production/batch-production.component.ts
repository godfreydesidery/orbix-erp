import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-batch-production',
  templateUrl: './batch-production.component.html',
  styleUrls: ['./batch-production.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class BatchProductionComponent implements OnInit {

  closeResult : any

  materialFilter : string

  id             : any
  no             : string
  productionName : string
  batchSize      : number
  uom            : string
  status         : string
  created        : string
  opened         : string
  closed         : string
  comments       : string

  productions    : IProduction[]

  materialNames : string[]
  productNames  : string[]

  materials           : IMaterial[]
  visibleMaterials    : IMaterial[]
  selectedMaterials   : IMaterial[]
  unverifiedMaterials : IMaterial[]
  verifiedMaterials   : IMaterial[]

  products           : IProduct[]
  visibleProducts    : IProduct[]
  selectedProducts   : IProduct[]
  unverifiedProducts : IProduct[]
  verifiedProducts   : IProduct[]

  unverifiedMaterialModel : IMaterialProduction[]
  verifiedMaterialModel   : IMaterialProduction[]

  productionMaterials             : IMaterialProduction[]
  productionUnverifiedMaterials   : IMaterialProduction[]

  productionProducts             : IProductProduction[]
  productionUnverifiedProducts   : IProductProduction[]


  materialId          : any
  materialCode        : string = ''
  materialDescription : string = ''
  materialAdd         : number = 0
  materialDeduct      : number = 0
  materialQty         : number = 0


  //product detail
  productId           : any
  barcode             : string
  productCode         : string
  productDescription  : string
  productAdd          : number = 0
  productDeduct       : number = 0
  productQty          : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private data : DataService) {
    this.id             = null
    this.no             = ''
    this.productionName = ''
    this.batchSize      = 0
    this.uom            = ''
    this.status         = ''
    this.created        = ''
    this.opened         = ''
    this.closed         = ''
    this.comments       = ''

    this.productions    = []

    this.materialFilter = ''

    this.materialNames  = []
    this.productNames   = []

    this.materials           = []
    this.visibleMaterials    = []
    this.selectedMaterials   = []
    this.unverifiedMaterials = []
    this.verifiedMaterials   = []

    this.products           = []
    this.visibleProducts    = []
    this.selectedProducts   = []
    this.unverifiedProducts = []
    this.verifiedProducts   = []

    this.unverifiedMaterialModel = []
    this.verifiedMaterialModel   = []

    this.productionUnverifiedMaterials = []
    this.productionMaterials           = []

    this.productionUnverifiedProducts = []
    this.productionProducts           = []

    this.barcode             = ''
    this.productCode                = ''    
    this.productDescription         = ''
    this.productQty                 = 0
    this.sellingPriceVatIncl = 0
    this.sellingPriceVatExcl = 0

    this.descriptions        = []
  }

  ngOnInit(): void {
    this.loadProductions()
    this.loadMaterials()
  }

  async save(){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var production = {
      id             : this.id,
      no             : this.no,
      productionName : this.productionName,
      batchSize      : this.batchSize,
      uom            : this.uom,
      comments       : this.comments
    }
    if(this.id == '' || this.id == null){
      await this.http.post<IProduction>(API_URL+'/productions/create', production, options)
      .toPromise()
      .then(data => {
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchSize      = data!.batchSize
        this.uom            = data!.uom
        this.status         = data!.status
        this.created        = data!.created
        this.opened         = data!.opened
        this.closed         = data!.closed
        this.comments       = data!.comments
      })
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create production')
      })
    }else{
      //update production
    }

  }

  refreshVisible(val : string){
    if(val == ''){
      this.visibleMaterials = this.materials
    }else{
      this.visibleMaterials = []
      this.materials.forEach(element => {       
        if(element.description.toLowerCase().includes(val.toLowerCase())){
          this.visibleMaterials.push(element)
        }
      })
    }
  }

  addSelected(){
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    this.selectedMaterials.forEach(element => {
      var material = {
        id          : element.id,
        code        : element.code,
        description : element.description,
        qty         : element!.qty
      }
      this.registerMaterial(material)
    })  
  }

  selectMaterial(action : any, id : any, code : string, description : string){
    var material = {
      id          : id,
      code        : code,
      description : description,
      qty         : 0
    }
    var present = false
    if(action.target.checked == true){
      this.selectedMaterials.forEach(element => {
        if(element.id == material.id){
          present = true
        }
      })
      if(present == false){
        this.selectedMaterials.push(material)
      }
    }else if(action.target.checked == false){
      this.selectedMaterials.forEach(element => {
        if(element.id == material.id){
          this.selectedMaterials.splice(-1, 1)
        }
      })
      
    }
  }

  async registerMaterial(mat : IMaterial){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material : IMaterialProduction = {
      material   : {id : mat.id, code : '', description : ''},
      production : {id : this.id},
      qty        : 0
    }
    if(this.id == null || this.id == ''){
      return
    }
    if(mat.id == null || mat.id == ''){
      return
    }
    await this.http.post<IMaterial>(API_URL+'/productions/register_material', material, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
    })
  }

  async addMaterial(materialId : any, qty : number){
    if(qty <= 0){
      alert('Invalid value in materiial quantity, quantity must be positive')
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material : IMaterialProduction = {
      material   : {id : materialId, code : '', description : ''},
      production : {id : this.id},
      qty        : qty
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(materialId == null || materialId == ''){
      alert('Please select material')
      return
    }
    if(qty <= 0){
      alert('Invalid quantity in material')
      return
    }
    await this.http.post<IProduction>(API_URL+'/productions/add_material', material, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not add material')
    })
  }

  async deductMaterial(materialId : any, qty : number){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material : IMaterialProduction = {
      material   : {id : materialId, code : '', description : ''},
      production : {id : this.id},
      qty        : qty
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(materialId == null || materialId == ''){
      alert('Please select material')
      return
    }
    if(qty <= 0){
      alert('Invalid quantity in material')
      return
    }
    await this.http.post<IProduction>(API_URL+'/productions/deduct_material', material, options)
    .toPromise()
    .then(data => {

    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not deduct material')
    })
  }

  async removeMaterial(materialId : any){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material : IMaterialProduction = {
      material   : {id : materialId, code : '', description : ''},
      production : {id : this.id},
      qty        : 0
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(materialId == null || materialId == ''){
      alert('Please select material')
      return
    }

    await this.http.post<IProduction>(API_URL+'/productions/remove_material', material, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not remove material')
    })
  }

  async verifyMaterial(materialId : any, qty : number){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var material : IMaterialProduction = {
      material   : {id : materialId, code : '', description : ''},
      production : {id : this.id},
      qty        : qty
    }
    if(qty <= 0){
      alert('Can not verify material, invalid quantity value.')
      return
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(materialId == null || materialId == ''){
      alert('Please select material')
      return
    }

    if(window.confirm('Confirm verification of the selected material, once verified, it can not be removed')){
      //proceed with verification
    }else{
      return
    }

    await this.http.post<IProduction>(API_URL+'/productions/verify_material', material, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not verify material')
    })
  }

  async loadMaterials(){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.materialFilter   = ''
    this.materials        = []
    this.visibleMaterials = []
    await this.http.get<IMaterial[]>(API_URL+'/materials', options)
    .toPromise()
    .then(data => {
      data!.forEach(element => {
        var material = {
          id          : element!.id,
          code        : element!.code,
          description : element!.description,
          qty         : element!.qty
        }
        this.materials.push(material)
      });
      this.visibleMaterials = this.materials
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load materials')
    })
  }

  async loadUnverifiedMaterials(productionId : any){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.unverifiedMaterials = []
    await this.http.get<IMaterial[]>(API_URL+'/productions/get_unverified_materials?production_id='+productionId, options)
    .toPromise()
    .then(data => {
      data!.forEach(element => {
        var material! : IMaterial
        material.id          = element.id
        material.code        = element.code
        material.description = element.description
        this.unverifiedMaterials.push(material)
      });
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load production unverified materials')
    })
  }

  async loadVerifiedMaterials(productionId : any){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.verifiedMaterials = []
    await this.http.get<IMaterial[]>(API_URL+'/productions/get_verified_materials?production_id='+productionId, options)
    .toPromise()
    .then(data => {
      data!.forEach(element => {
        var material! : IMaterial
        material.id          = element.id
        material.code        = element.code
        material.description = element.description
        this.verifiedMaterials.push(material)
      });
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load production verified materials')
    })
  }

  loadProductions(){
    this.productions = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.http.get<IProduction[]>(API_URL+'/productions', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.productions.push(element)
        })
      }
    )
  }

  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IProduction>(API_URL+'/productions/get?id='+id, options)
    .toPromise()
    .then(
      data => {
        console.log(data)
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchSize      = data!.batchSize
        this.uom            = data!.uom
        this.status         = data!.status
        this.created        = data!.created
        this.opened         = data!.opened
        this.closed         = data!.closed
        this.comments       = data!.comments

        this.productionUnverifiedMaterials = data!.productionUnverifiedMaterials
        this.productionMaterials           = data!.productionMaterials

        this.productionUnverifiedProducts = data!.productionUnverifiedProducts
        this.productionProducts           = data!.productionProducts

        this.unverifiedMaterials = []
        this.productionUnverifiedMaterials.forEach(element => {
          var material = {
            id          : element.material.id,
            code        : element.material.code,
            description : element.material.description,
            qty         : element.qty
          }
          this.unverifiedMaterials.push(material)
        })

        this.verifiedMaterials = []
        this.productionMaterials.forEach(element => {
          var material = {
            id          : element.material.id,
            code        : element.material.code,
            description : element.material.description,
            qty         : element.qty
          }
          this.verifiedMaterials.push(material)
        })

        this.unverifiedProducts = []
        this.productionUnverifiedProducts.forEach(element => {
          var product = {
            id                  : element.product.id,
            barcode             : null,
            code                : element.product.code,
            description         : element.product.description,
            qty                 : element.qty,
            sellingPriceVatIncl : 0,
            sellingPriceVatExcl : 0,
            costPriceVatIncl    : 0,
            costPriceVatExcl    : 0

          }
          this.unverifiedProducts.push(product)
        })

        this.verifiedProducts = []
        this.productionProducts.forEach(element => {
          var product = {
            id                  : element.product.id,
            barcode             : null,
            code                : element.product.code,
            description         : element.product.description,
            qty                 : element.qty,
            sellingPriceVatIncl : element.product.sellingPriceVatIncl,
            sellingPriceVatExcl : element.product.sellingPriceVatExcl,
            costPriceVatIncl    : element.product.costPriceVatIncl,
            costPriceVatExcl    : element.product.costPriceVatExcl
          }
          this.verifiedProducts.push(product)
        })
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load production')
      }
    )
  }

  openMaterialModal(materialModal : any, id : any, code : any, description : any, qty : number) {
    this.materialId          = id
    this.materialCode        = code
    this.materialDescription = description
    this.materialQty         = qty  
    this.modalService.open(materialModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getMaterialDismissReason(reason)}`;
    });
    
  }

  private getMaterialDismissReason(reason: any): string {
    this.materialId          = null
    this.materialCode        = ''
    this.materialDescription = ''
    this.materialAdd         = 0
    this.materialDeduct      = 0
    this.materialQty         = 0
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openProductModal(productModal : any, id : any, code : any, description : any, qty : number) {
    this.productId          = id
    this.barcode            = ''
    this.productCode        = code
    this.productDescription = description
    this.productQty         = qty  
    this.modalService.open(productModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getProductDismissReason(reason)}`;
    });
    
  }

  private getProductDismissReason(reason: any): string {
    this.productId          = null
    this.barcode            = ''
    this.productCode        = ''
    this.productDescription = ''
    this.productAdd         = 0
    this.productDeduct      = 0
    this.productQty         = 0
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  refreshMaterialQty(){
    if(this.materialDeduct > 0){
      this.materialAdd = 0
    }
    if(this.materialAdd > 0){
      this.materialDeduct = 0
    }
    if(this.materialDeduct < 0 || isNaN(this.materialDeduct)){
      this.materialDeduct = 0
    }
    if(this.materialAdd < 0 || isNaN(this.materialAdd)){
      this.materialAdd = 0
    }
    this.materialQty = +this.materialQty + +this.materialAdd
    this.materialQty = +this.materialQty - +this.materialDeduct
    if(this.materialQty < 0){
      this.materialQty = 0
    }
  }

  searchProduct(barcode : string, code : string, description : string){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    if(barcode != ''){
      //search by barcode
      this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.productCode = data!.code
          this.productDescription = data!.description
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }else if(code != ''){
      this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.productCode = data!.code
          this.productDescription = data!.description
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
        }
      )
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }else{
      //search by description
      this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
      .toPromise()
      .then(
        data => {
          this.productId = data!.id
          this.barcode = data!.barcode
          this.productCode = data!.code
          this.productDescription = data!.description
          this.sellingPriceVatIncl = data!.sellingPriceVatIncl
          this.sellingPriceVatExcl = data!.sellingPriceVatExcl
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }
  }

  async addProduct(productId : any, qty : number){
    if(qty <= 0){
      alert('Invalid value in product quantity, quantity must be positive')
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var product : IProductProduction = {
      product    : {
        id                  : productId, 
        code                : '', 
        description         : '',
        sellingPriceVatIncl : 0,
        sellingPriceVatExcl : 0,
        costPriceVatIncl    : 0,
        costPriceVatExcl    : 0
      },
      production : {id : this.id},
      qty        : qty
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(productId == null || productId == ''){
      alert('Please select material')
      return
    }
    if(qty <= 0){
      alert('Invalid quantity in product')
      return
    }
    await this.http.post<IProduction>(API_URL+'/productions/add_product', product, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not add product')
    })
  }

  async verifyProduct(productId : any, qty : number){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var product : IProductProduction = {
      product    : {
        id                  : productId, 
        code                : '', 
        description         : '',
        sellingPriceVatIncl : 0,
        sellingPriceVatExcl : 0,
        costPriceVatIncl    : 0,
        costPriceVatExcl    : 0
      },
      production : {id : this.id},
      qty        : qty
    }
    if(qty <= 0){
      alert('Can not verify product, invalid quantity value.')
      return
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(productId == null || productId == ''){
      alert('Please select product')
      return
    }

    if(window.confirm('Confirm verification of the selected product, once verified, it can not be removed')){
      //proceed with verification
    }else{
      return
    }

    await this.http.post<IProduction>(API_URL+'/productions/verify_product', product, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not verify product')
    })
  }

  async removeProduct(productId : any){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var product : IProductProduction = {
      product    : {
        id                  : productId, 
        code                : '', 
        description         : '',
        sellingPriceVatIncl : 0,
        sellingPriceVatExcl : 0,
        costPriceVatIncl    : 0,
        costPriceVatExcl    : 0
      },
      production : {id : this.id},
      qty        : 0
    }
    if(this.id == null || this.id == ''){
      alert('Please select production')
      return
    }
    if(productId == null || productId == ''){
      alert('Please select product')
      return
    }

    await this.http.post<IProduction>(API_URL+'/productions/remove_product', product, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not remove product')
    })
  }

  async closeBatch(id : any){
    if(id == '' || id == null){
      alert('No batch selected. Please select production batch to close.')
      return
    }
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    
    var production = {
      id : id
    }

    await this.http.post<IProduction>(API_URL+'/productions/close', production, options)
    .toPromise()
    .then(data => {
      this.get(this.id)
      this.loadProductions()
      alert('Production closed successifully')
    })
    .catch(error => {
      console.log(error)
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not close production batch')
    })
  }

  clear(){
    this.id             = null
    this.no             = ''
    this.productionName = ''
    this.batchSize      = 0
    this.uom            = ''
    this.status         = ''
    this.created        = ''
    this.opened         = ''
    this.closed         = ''
    this.comments       = ''
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface IProduction{
  id             : any
  no             : string
  productionName : string
  batchSize      : number
  uom            : string
  status         : string
  created        : string
  opened         : string
  closed         : string
  comments       : string

  productionUnverifiedMaterials : IMaterialProduction[]
  productionMaterials           : IMaterialProduction[]
  productionUnverifiedProducts  : IProductProduction[]
  productionProducts            : IProductProduction[]
}

export interface IProduct{
  id                  : any
  barcode             : any
  code                : any
  description         : any
  qty                 : number
  sellingPriceVatIncl : number
  sellingPriceVatExcl : number
  costPriceVatIncl    : number
  costPriceVatExcl    : number
}

export interface IMaterial{
  id          : any
  code        : string
  description : string
  qty         : number
}

export interface IMaterialProduction{
  material   : {id : any, code : string, description : string }
  production : {id : any}
  qty        : number
}

export interface IProductProduction{
  product    : {
                id : any, 
                code : string, 
                description : string,
                sellingPriceVatIncl : number,
                sellingPriceVatExcl : number,
                costPriceVatIncl    : number,
                costPriceVatExcl    : number
              }
  production : {id : any}
  qty        : number
}

export interface productModel{
  product    : IProduct
  production : IProduction
  qty        : number
}