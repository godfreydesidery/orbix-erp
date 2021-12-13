import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from '../services/short-cut-handler.service';

@Component({
  selector: 'app-web-pos',
  templateUrl: './web-pos.component.html',
  styleUrls: ['./web-pos.component.scss']
})
export class WebPosComponent implements OnInit {

  constructor(private shortcut : ShortCutHandlerService) { }

  ngOnInit(): void {
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}
