import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-supplier-relations-menu',
  templateUrl: './supplier-relations-menu.component.html',
  styleUrls: ['./supplier-relations-menu.component.scss']
})
export class SupplierRelationsMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
