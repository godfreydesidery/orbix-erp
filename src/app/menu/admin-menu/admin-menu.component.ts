import { Component, OnInit, Input } from '@angular/core';

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
