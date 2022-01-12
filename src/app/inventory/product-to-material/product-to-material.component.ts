import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { IMaterial } from '../material-master/material-master.component';

@Component({
  selector: 'app-product-to-material',
  templateUrl: './product-to-material.component.html',
  styleUrls: ['./product-to-material.component.scss']
})
export class ProductToMaterialComponent implements OnInit {
  closeResult: string = '';

  id                       : any
  no                       : string
  customerId               : any
  customerNo!              : string
  customerName!            : string
  status                   : string
  invoiceDate              : Date
  comments!                : string
  created                  : string
  approved                 : string
  productToMaterialDetails : IProductToMaterialDetail[]
  productToMaterials       : IProductToMaterial[]

  //detail
  detailId            : any
  barcode             : string
  productId           : any
  code                : string
  description         : string
  qty                 : number
  uom                 : string

  descriptions : string[]

  constructor(private auth : AuthService,
              private http :HttpClient,
              private shortcut : ShortCutHandlerService, 
              private modalService: NgbModal) {

              this.id               = ''
              this.no               = ''
              this.invoiceDate      = new Date()
              this.status           = ''
              this.comments         = ''
              this.created          = ''
              this.approved         = ''
              this.productToMaterialDetails   = []
              this.productToMaterials         = []

              this.detailId            = ''
              this.barcode             = ''
              this.code                = ''
              this.description         = ''
              this.qty                 = 0
              this.uom                 = ''

              this.descriptions        = []
  }

  ngOnInit(): void {
  }

  open(content : any) {
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
  clearDetail() {
    throw new Error('Method not implemented.');
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
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
  product          : IProduct
  material         : IMaterial
  ratio            : IRatio
}

interface IProduct{
  id               : any
  barcode          : string
  code             : string
  description      : string
}

interface IProductName{
  names : string[]
}

interface IRatio{
  id       : any
  product  : IProduct
  material : IMaterial
  ratio    : number
}
