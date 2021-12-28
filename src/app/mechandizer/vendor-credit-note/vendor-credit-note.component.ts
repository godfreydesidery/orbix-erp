import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-vendor-credit-note',
  templateUrl: './vendor-credit-note.component.html',
  styleUrls: ['./vendor-credit-note.component.scss']
})
export class VendorCreditNoteComponent implements OnInit {

  constructor(private shortcut : ShortCutHandlerService) { }

  ngOnInit(): void {
  }


  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}
