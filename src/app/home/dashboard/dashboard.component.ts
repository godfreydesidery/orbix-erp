import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IShortcut } from 'src/app/models/shortcut';
import {trigger,state,style,animate,transition} from '@angular/animations'; 
import { environment } from 'src/environments/environment';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { NgxSpinnerModule } from "ngx-spinner";

const API_URL = environment.apiUrl;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class DashboardComponent implements OnInit {

  public shortcuts: IShortcut[] = [];

  constructor(private auth : AuthService, private http : HttpClient, private shortcut : ShortCutHandlerService) { }

  ngOnInit(): void {
    this.loadShortcuts()
  }

  async loadShortcuts(){
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IShortcut[]>(API_URL+'/shortcuts/load?username='+localStorage.getItem('username'), options)
     .toPromise()
     .then(
       data => {
         data?.forEach(
           element => {      
             this.shortcuts.push(element)
           }
         )
       }
     )
     .catch(error => {
       console.log(error)
     })
     

  }

  loadMessages(){

  }

  removeShortcut(shortCutName : string){
    if(confirm('Remove the selected shortcut?')){
      this.shortcut.removeShortCut(shortCutName)
      location.reload()
    }
  }

  removeAllShortcuts(){
    alert('clear all shortcuts!')
  }

}
