import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-custom-date',
  templateUrl: './custom-date.component.html',
  styleUrls: ['./custom-date.component.scss']
})
export class CustomDateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
