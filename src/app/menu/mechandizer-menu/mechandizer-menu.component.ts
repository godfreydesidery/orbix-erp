import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-mechandizer-menu',
  templateUrl: './mechandizer-menu.component.html',
  styleUrls: ['./mechandizer-menu.component.scss']
})
export class MechandizerMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
