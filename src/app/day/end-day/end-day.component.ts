import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-end-day',
  templateUrl: './end-day.component.html',
  styleUrls: ['./end-day.component.scss']
})
export class EndDayComponent implements OnInit {

  systemDate!: string;
  bussinessDate!: string;

  constructor(private http :HttpClient, private auth : AuthService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.loadDay()
    this.systemDate = localStorage.getItem('system-date')!
    this.bussinessDate = localStorage.getItem('system-date')!

  }

  endDay(){
    if(window.confirm('Confirm ending the current Bussiness Day and start a new Day?')){
      /**
       * To Do the end day request
       */
       let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      this.http.get<boolean>('/api/days/end_day', options)
      .toPromise()
      .then(
        data => {
          if(data == true){
            alert('Success')
            this.logOut()
          }else{
            alert('Could not end the day')
          }
        }
      )
      .catch(
        error => {
          alert('Could not end the day')
        }
      )
    }
  }

  logOut() : any{
    localStorage.removeItem('current-user')
    this.router.navigate([''])
    window.location.reload()
  }

  async loadDay(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<IDayData>('/api/days/get_bussiness_date', options)
    .toPromise()
    .then(
      data => {
        localStorage.setItem('system-date', data?.bussinessDate!+'')        
      },
      error => {
        console.log(error)
      }
    )
  }



}

interface IDayData{
  bussinessDate : String
}
