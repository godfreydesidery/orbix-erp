import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  mainMenuShown : boolean = true
  adminMenuShown : boolean = false
  inventoryMenuShown : boolean = false
  mechandizerMenuShown : boolean = false
  productionMenuShown : boolean = false
  supplierRelationsMenuShown : boolean = false
  customerRelationsMenuShown : boolean = false
  humanResourceMenuShown : boolean = false
  reportMenuShown : boolean = false
  dayMenuShown : boolean = false

  constructor() {

  }

  ngOnInit(): void {

  }

  hideAll(){
    this.mainMenuShown = false
    this.adminMenuShown = false
    this.inventoryMenuShown = false
    this.mechandizerMenuShown = false
    this.productionMenuShown = false
    this.supplierRelationsMenuShown = false
    this.customerRelationsMenuShown = false
    this.humanResourceMenuShown = false
    this.reportMenuShown = false
    this.dayMenuShown = false
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

  showProductionMenu(){
    this.hideAll()
    this.productionMenuShown = true
  } 

  showSupplierRelationsMenu(){
    this.hideAll()
    this.supplierRelationsMenuShown = true
  } 

  showCustomerRelationsMenu(){
    this.hideAll()
    this.customerRelationsMenuShown = true
  } 

  showHumanResourceMenu(){
    this.hideAll()
    this.humanResourceMenuShown = true
  } 

  showReportMenu(){
    this.hideAll()
    this.reportMenuShown = true
  } 

  showDayMenu(){
    this.hideAll()
    this.dayMenuShown = true
  } 
   
}



