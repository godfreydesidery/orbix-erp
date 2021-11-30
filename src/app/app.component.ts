import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'orbix-erp';

  public isLoggedIn = false

  constructor(private http  : HttpClient){
    this.getData()

    //console.log(environment.production);
    //console.log(environment.apiUrl); // Logs false for default environment
  }

  getData(){
    return this.http.get<[]>('/api/users')
    .subscribe(
      data =>{
      console.log(data)
    });
  }
}
