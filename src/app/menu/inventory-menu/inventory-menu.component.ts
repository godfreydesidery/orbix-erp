import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-inventory-menu',
  templateUrl: './inventory-menu.component.html',
  styleUrls: ['./inventory-menu.component.scss']
})
export class InventoryMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
