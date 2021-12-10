import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  mainMenuShown : boolean = true
  adminMenuShown : boolean = false
  inventoryMenuShown : boolean = false
  mechandizerMenuShown : boolean = false

  constructor() {

  }

  ngOnInit(): void {

  }

  hideAll(){
    this.mainMenuShown = false
    this.adminMenuShown = false
    this.inventoryMenuShown = false
    this.mechandizerMenuShown = false
  }

  showMainMenu(){
    this.hideAll()
    this.mainMenuShown = true
  }
  showAdminMenu(){
    this.hideAll()
    this.adminMenuShown = true
  } 
  showInventoryMenu(){
    this.hideAll()
    this.inventoryMenuShown = true
  } 

  showMechandizerMenu(){
    this.hideAll()
    this.mechandizerMenuShown = true
  } 
   
}



