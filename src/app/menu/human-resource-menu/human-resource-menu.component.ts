import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-human-resource-menu',
  templateUrl: './human-resource-menu.component.html',
  styleUrls: ['./human-resource-menu.component.scss']
})
export class HumanResourceMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
