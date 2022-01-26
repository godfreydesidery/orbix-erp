import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  public noLocked     : boolean = true
  public inputsLocked : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  closeResult : any

  logo!              : any
  address  : any 

  materialFilter : string

  id             : any
  no             : string
  productionName : string
  batchNo        : string
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
              private data : DataService,
              private spinner : NgxSpinnerService) {
    this.id             = null
    this.no             = ''
    this.productionName = ''
    this.batchNo        = ''
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

  async ngOnInit(): Promise<void> {
    this.address = await this.data.getAddress()
    this.logo = await this.data.getLogo()
    this.loadProductions()
    this.loadMaterials()
    this.loadProductDescriptions()
  }

  async save(){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var production = {
      id             : this.id,
      no             : this.no,
      productionName : this.productionName,
      batchNo        : this.batchNo,
      batchSize      : this.batchSize,
      uom            : this.uom,
      comments       : this.comments
    }
    if(this.id == '' || this.id == null){
      this.spinner.show()
      await this.http.post<IProduction>(API_URL+'/productions/create', production, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(data => {
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchNo        = data!.batchNo
        this.batchSize      = data!.batchSize
        this.uom            = data!.uom
        this.status         = data!.status
        this.created        = data!.created
        this.opened         = data!.opened
        this.closed         = data!.closed
        this.comments       = data!.comments
        this.loadProductions()
        this.get(this.id)
      })
      .catch(error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create production')
      })
    }else{
      this.spinner.show()
      await this.http.post<IProduction>(API_URL+'/productions/update', production, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(data => {
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchNo        = data!.batchNo
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
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update production')
      })
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
    this.spinner.show()
    await this.http.post<IMaterial>(API_URL+'/productions/register_material', material, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/add_material', material, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/deduct_material', material, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/remove_material', material, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/verify_material', material, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IMaterial[]>(API_URL+'/materials', options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IMaterial[]>(API_URL+'/productions/get_unverified_materials?production_id='+productionId, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IMaterial[]>(API_URL+'/productions/get_verified_materials?production_id='+productionId, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.get<IProduction>(API_URL+'/productions/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        console.log(data)
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchNo        = data!.batchNo
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

  async getByNo(no: string) {
    if(no == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduction>(API_URL+'/productions/get_by_no?no='+no, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        console.log(data)
        this.id             = data!.id
        this.no             = data!.no
        this.productionName = data!.productionName
        this.batchNo        = data!.batchNo
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
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_barcode?barcode='+barcode, options)
      .pipe(finalize(() => this.spinner.hide()))
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
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_code?code='+code, options)
      .pipe(finalize(() => this.spinner.hide()))
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
      this.spinner.show()
      this.http.get<IProduct>(API_URL+'/products/get_by_description?description='+description, options)
      .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/add_product', product, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/verify_product', product, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/remove_product', product, options)
    .pipe(finalize(() => this.spinner.hide()))
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
    this.spinner.show()
    await this.http.post<IProduction>(API_URL+'/productions/close', production, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(data => {
      this.get(this.id)
      this.loadProductions()
      alert('Production closed successifully')
    })
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not close production batch')
    })
  }

  unlockAll(){
    this.noLocked     = false 
    this.inputsLocked = false
  }

  lockAll(){
    this.noLocked     = true
    this.inputsLocked = true
  }

  clear(){
    this.id             = null
    this.no             = ''
    this.productionName = ''
    this.batchNo        = ''
    this.batchSize      = 0
    this.uom            = ''
    this.status         = ''
    this.created        = ''
    this.opened         = ''
    this.closed         = ''
    this.comments       = ''
    this.verifiedMaterials   = []
    this.unverifiedMaterials = []
    this.verifiedProducts    = []
    this.unverifiedProducts  = []
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

  exportToPdf = () => {
    var header = ''
    var footer = ''
    var title  = 'Batch Production'
    var logo : any = ''
    var total : number = 0
    if(this.logo == ''){
      logo = { text : '', width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }else{
      logo = {image : this.logo, width : 70, height : 70, absolutePosition : {x : 40, y : 40}}
    }
    var unverifiedMaterial = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9},
        {text : 'Qty', fontSize : 9},
      ]
    ]  
    var verifiedMaterial = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9},
        {text : 'Qty', fontSize : 9},
      ]
    ] 
    var unverifiedProduct = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9},
        {text : 'Qty', fontSize : 9},
      ]
    ]  
    var verifiedProduct = [
      [
        {text : 'Code', fontSize : 9}, 
        {text : 'Description', fontSize : 9},
        {text : 'Qty', fontSize : 9},
      ]
    ]     
    this.unverifiedMaterials.forEach((element) => {
      var detail = [
        {text : element.code.toString(), fontSize : 9}, 
        {text : element.description.toString(), fontSize : 9},
        {text : element.qty.toString(), fontSize : 9},  
      ]
      unverifiedMaterial.push(detail)
    })

    this.verifiedMaterials.forEach((element) => {
      var detail = [
        {text : element.code.toString(), fontSize : 9}, 
        {text : element.description.toString(), fontSize : 9},
        {text : element.qty.toString(), fontSize : 9},  
      ]
      verifiedMaterial.push(detail)
    })
    
    this.unverifiedProducts.forEach((element) => {
      var detail = [
        {text : element.code.toString(), fontSize : 9}, 
        {text : element.description.toString(), fontSize : 9},
        {text : element.qty.toString(), fontSize : 9},  
      ]
      unverifiedProduct.push(detail)
    })
    this.verifiedProducts.forEach((element) => {
      total = total + element.qty*element.costPriceVatIncl
      var detail = [
        {text : element.code.toString(), fontSize : 9}, 
        {text : element.description.toString(), fontSize : 9},
        {text : element.qty.toString(), fontSize : 9},  
      ]
      verifiedProduct.push(detail)
    })
   
    const docDefinition = {
      header: '',
      watermark : { text : title, color: 'blue', opacity: 0.1, bold: true, italics: false },
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
                  {text : 'Production No', fontSize : 9}, 
                  {text : this.no, fontSize : 9} 
                ],
                [
                  {text : 'Production Name', fontSize : 9}, 
                  {text : this.productionName, fontSize : 9} 
                ],
                [
                  {text : 'Batch No', fontSize : 9}, 
                  {text : this.batchNo.toString(), fontSize : 9} 
                ],
                [
                  {text : 'Batch Size', fontSize : 9}, 
                  {text : this.batchSize.toString()+' '+this.uom, fontSize : 9} 
                ],
                [
                  {text : 'Status', fontSize : 9}, 
                  {text : this.status, fontSize : 9} 
                ]
              ]
            },
          },
          '  ',
          'Unverified Materials',
          {
            layout : 'noBorders',
            table : {
              headerRows : 1,
              widths : ['auto', 200, 'auto'],
              body : 
                unverifiedMaterial
            }
        },
        ' ',
        'Verified Materials',
        {
          layout : 'noBorders',
          table : {
            headerRows : 1,
            widths : ['auto', 200, 'auto'],
            body : 
              verifiedMaterial
          }
      },
      ' ',
      'Unverified Products',
      {
        layout : 'noBorders',
        table : {
          headerRows : 1,
          widths : ['auto', 200, 'auto'],
          body : 
            unverifiedProduct
        }
    },
    ' ',
    'Verified Products',
    {
      layout : 'noBorders',
      table : {
        headerRows : 1,
        widths : ['auto', 200, 'auto'],
        body : 
          verifiedProduct
      }
  },
        ' ',
        ' ',
        ' ',
        'Verified ____________________________________', 
        ' ',
        ' ',
        'Approved __________________________________',             
      ]     
    };
    pdfMake.createPdf(docDefinition).open(); 
  }
}

export interface IProduction{
  id             : any
  no             : string
  productionName : string
  batchNo        : string
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