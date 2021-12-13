import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IShortcut } from 'src/app/models/shortcut';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public shortcuts: IShortcut[] = [];

  constructor(private auth : AuthService, private http : HttpClient) { }

  ngOnInit(): void {
    this.loadShortcuts()
  }

  async loadShortcuts(){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IShortcut[]>('/api/shortcuts/load?username='+localStorage.getItem('username'), options)
     .toPromise()
     .then(
       data => {
         data?.forEach(
           element => {      
             this.shortcuts.push(element)
           }
         )
         console.log(this.shortcuts)
       }
     )
     .catch(error => {
       console.log(error)
     })
     

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
