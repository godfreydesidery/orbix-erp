import { Component, OnInit } from '@angular/core';
import { IRole } from 'src/app/models/role';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss']
})
export class RoleManagerComponent implements OnInit, IRole {
  id      : any;
  name    : string;
  granted : boolean;

  constructor() {
    this.name = ''
    this.granted = false
  }
  
  saveRole(): void {
    throw new Error('Method not implemented.');
  }
  getRoles(): IRole[] {
    throw new Error('Method not implemented.');
  }
  getRole(roleName: string): IRole {
    throw new Error('Method not implemented.');
  }
  deleteRole(): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {}
  
}
