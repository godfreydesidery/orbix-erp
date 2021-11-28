import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'orbix-erp';

  public menu : string 

  constructor(){
    this.menu = ''
    alert("check")
  }
}
