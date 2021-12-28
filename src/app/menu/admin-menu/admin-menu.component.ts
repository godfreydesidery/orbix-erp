import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  @Input() menu : string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
