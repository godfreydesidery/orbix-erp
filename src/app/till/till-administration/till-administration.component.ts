import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-till-administration',
  templateUrl: './till-administration.component.html',
  styleUrls: ['./till-administration.component.scss']
})
export class TillAdministrationComponent implements OnInit {
  
  public id           : any
  public tillNo       : string
  public computerName : string
  public active : boolean
  
  closeResult : string = ''
  constructor(private shortcut : ShortCutHandlerService, private modalService: NgbModal) {
    this.id           = ''
    this.tillNo       = ''
    this.computerName = ''
    this.active       = false
  }

  ngOnInit(): void {
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

  open(content: any) {
    //this.getUser(username)

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
