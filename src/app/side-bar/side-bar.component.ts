import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  mainMenuShown : boolean = true
  adminMenuShown : boolean = false

  constructor() {

  }

  ngOnInit(): void {

  }


  showMainMenu(){
    this.mainMenuShown = true

    this.adminMenuShown = false
  }
  showAdminMenu(){
    this.mainMenuShown = false

    this.adminMenuShown = true


  }


  
}



