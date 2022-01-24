import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-product-to-material',
  templateUrl: './product-to-material.component.html',
  styleUrls: ['./product-to-material.component.scss']
})
export class ProductToMaterialComponent implements OnInit {
  closeResult    : string = ''

  blank          : boolean = false
  
  id                       : any
  no                       : string
  status                   : string
  comments!                : string
  created                  : string
  approved                 : string
  productToMaterialDetails : IProductToMaterialDetail[]
  productToMaterials       : IProductToMaterial[]

  //detail
  detailId            : any
  barcode             : string
  productId           : any
  productCode         : string
  productDescription  : string
  productUom          : string
  qty                 : number
  ratio               : number

  materialId          : any
  materialCode        : string
  materialDescription : string
  materialUom         : string

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal,
              private spinner: NgxSpinnerService) {
    this.id               = ''
    this.no               = ''
    this.status           = ''
    this.comments         = ''
    this.created          = ''
    this.approved         = ''
    this.productToMaterialDetails = []
    this.productToMaterials       = []

    this.detailId            = ''
    this.barcode             = ''
    this.productCode         = ''    
    this.productDescription  = ''
    this.productUom          = ''
    this.qty                 = 0
    this.ratio               = 0

    this.materialId          = ''
    this.materialCode        = ''
    this.materialDescription = ''
    this.materialUom         = ''

    this.descriptions        = []
  }

  ngOnInit(): void {
    this.loadConversions()
    this.loadProductDescriptions()
  }
  
  async save() {  
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var product_to_material = {
      id           : this.id,
      comments     : this.comments
    }
    if(this.id == null || this.id == ''){  
      this.spinner.show() 
      await this.http.post<IProductToMaterial>(API_URL+'/product_to_materials/create', product_to_material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no         
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Conversion Created successifully')
          this.blank = true
          this.loadConversions()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save Conversion')
          console.log(error)
        }
      )
    }else{
      this.spinner.show()
      await this.http.put<IProductToMaterial>(API_URL+'/product_to_materials/update', product_to_material, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.id           = data?.id
          this.no           = data!.no
          this.status       = data!.status
          this.comments     = data!.comments
          this.created      = data!.created
          this.approved     = data!.approved
          this.get(this.id)
          alert('Conversion Updated successifully')
          this.loadConversions()
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update Conversion')
        }
      )
    }
  }

  get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IProductToMaterial>(API_URL+'/product_to_materials/get?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.id                       = data?.id
        this.no                       = data!.no
        this.status                   = data!.status
        this.comments                 = data!.comments
        this.created                  = data!.created
        this.approved                 = data!.approved
        this.productToMaterialDetails = data!.productToMaterialDetails
        console.log(this.productToMaterialDetails)
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Conversion')
      }
    )
  }

  getByNo(no: string) {
    if(no == ''){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IProductToMaterial>(API_URL+'/product_to_materials/get_by_no?no='+no, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.id                       = data?.id
        this.no                       = data!.no 
        this.status                   = data!.status
        this.comments                 = data!.comments
        this.created                  = data!.created
        this.approved                 = data!.approved
        this.productToMaterialDetails = data!.productToMaterialDetails
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load Conversion')
      }
    )
  }

  approve(id: any) {
    if(!window.confirm('Confirm approval of the selected Conversion')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var conversion = {
      id : this.id   
    }
    this.spinner.show()
    this.http.put(API_URL+'/product_to_materials/approve', conversion, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.loadConversions()
        this.get(id)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not approve')
      }
    )
  }

  cancel(id: any) {
    if(!window.confirm('Confirm canceling of the selected Conversion')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var conversion = {
      id : this.id   
    }
    this.spinner.show()
    this.http.put(API_URL+'/product_to_materials/cancel', conversion, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.clear()
        this.loadConversions()
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not cancel')
      }
    )
  }

  delete(id: any) {
    throw new Error('Method not implemented.');
  }
  
  async saveDetail() {
    
    if(this.id == '' || this.id == null){
      /**
       * First Create a new Conversion
       */
      alert('Conversion not available, the system will create a new Conversion')
      this.save()
    }else{
      /**
       * Enter Conversion Detail
       */
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }   
      var detail = {
        productToMaterial : {id : this.id},
        product : {id : this.productId, code : this.productCode},
        material : { id : this.materialId},
        qty : this.qty,
        ratio : this.ratio
      }
      this.spinner.show()
      await this.http.post(API_URL+'/product_to_material_details/save', detail, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        () => {
          this.clearDetail()
          this.get(this.id)
          if(this.blank == true){
            this.blank = false
            this.loadConversions()
          }
        }
      )
      .catch(
        error => {
          console.log(error)
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not save detail')
        }
      )
    }
  }

  getDetailByNo(no: string) {
    throw new Error('Method not implemented.');
  }

  deleteDetail(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.delete(API_URL+'/product_to_material_details/delete?id='+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      () => {
        this.get(this.id)
      }
    )
    .catch(
      error => {ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not remove detail')
      }
    )
  }

  loadConversions(){
    this.productToMaterials = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    this.http.get<IProductToMaterial[]>(API_URL+'/product_to_materials', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.productToMaterials.push(element)
        })
      }
    )
  }

  async archive(id: any) {
    if(id == null || id == ''){
      window.alert('Please select Conversion to archive')
      return
    }
    if(!window.confirm('Confirm archiving of the selected Conversion')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var conversion = {
      id : id   
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/product_to_materials/archive', conversion, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadConversions()
        alert('Conversion archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  async archiveAll() {
    if(!window.confirm('Confirm archiving Conversion. All Approved conversions will be archived')){
      return
    }
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.put<boolean>(API_URL+'/product_to_materials/archive_all', null, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.clear()
        this.loadConversions()
        alert('Conversions archived successifully')
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not archive')
      }
    )
  }

  clear(){
    this.id           = ''
    this.no           = ''
    this.status       = ''
    this.comments     = ''
    this.created      = ''
    this.approved     = ''
    this.productToMaterialDetails   = []
  }

  clearDetail(){
    this.detailId            = null
    this.productId           = null
    this.barcode             = ''
    this.productCode         = ''
    this.productDescription  = ''
    this.productUom          = ''
    this.qty                 = 0
    this.materialId          = null
    this.materialCode        = ''
    this.materialDescription = ''
    this.materialUom         = ''
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  searchProduct(barcode : string, code : string, description : string){
    this.clearDetail()
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
          if(data!.id == '' || data!.id == null){
            alert('Process failed')
          }else{
            this.getProductMaterialRatio(data!.id)
          }
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
          if(data!.id == '' || data!.id == null){
            alert('Process failed')
          }else{
            this.getProductMaterialRatio(data!.id)
          }
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
          if(data!.id == '' || data!.id == null){
            alert('Process failed')
          }else{
            this.getProductMaterialRatio(data!.id)
          }
        }
      )
      .catch(error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Product not found')
      })
    }
  }

  async searchDetail(productId : any, detailId :any){    
    this.clearDetail()
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProduct>(API_URL+'/products/get?id='+productId, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.productId          = data!.id
        this.barcode            = data!.barcode
        this.productCode        = data!.code
        this.productDescription = data!.description     
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product')
    })
    this.spinner.show()
    await this.http.get<IProductToMaterialDetail>(API_URL+'/product_to_material_details/get?id='+detailId, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.detailId = data!.id
        this.qty = data!.qty
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load detail information')
    })
  }

  open(content : any, productId : string, detailId : string) {
    if(productId != ''){
      this.searchDetail(productId, detailId)
    }
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.clearDetail()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
        console.log(data)
      },
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load product descriptions')
      }
    )
  }

  async getProductMaterialRatio(productId : any){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<IProductMaterialRatio>(API_URL+'/product_material_ratios/get_by_product?id='+productId, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        this.materialId          = data?.material.id
        this.materialCode        = data!.material.code
        this.materialDescription = data!.material.description
        this.materialUom         = data!.material.uom
        this.ratio               = data!.ratio
      },
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load ratio')
      }
    )
  }
}

interface IProductToMaterial{
  id           : any
  no           : string
  status       : string
  comments     : string
  created      : string
  approved     : string
  productToMaterialDetails   : IProductToMaterialDetail[]
}

interface IProductToMaterialDetail{
  id               : any
  qty              : number
  ratio            : number
  product          : IProduct
  material         : IMaterial
}

interface IProduct{
  id               : any
  barcode          : string
  code             : string
  description      : string
  uom              : string
}

interface IMaterial{
  id               : any
  code             : string
  description      : string
  uom              : string
}

interface IProductMaterialRatio{
  id       : any
  product  : IProduct
  material : IMaterial
  ratio    : number
}