import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  loadShortcuts(){

  }

  loadMessages(){

  }

  removeShortcut(){
    alert('clear shortcut!')
  }

  removeAllShortcuts(){
    alert('clear all shortcuts!')
  }

}
