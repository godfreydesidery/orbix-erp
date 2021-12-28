import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-day-menu',
  templateUrl: './day-menu.component.html',
  styleUrls: ['./day-menu.component.scss']
})
export class DayMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
