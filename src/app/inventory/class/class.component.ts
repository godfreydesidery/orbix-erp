import { Component, OnInit } from '@angular/core';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  constructor(private shortcut : ShortCutHandlerService) { }

  ngOnInit(): void {
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }

}
