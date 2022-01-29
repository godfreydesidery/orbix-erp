import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-end-day',
  templateUrl: './end-day.component.html',
  styleUrls: ['./end-day.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class EndDayComponent implements OnInit {

  systemDate!: string;
  bussinessDate!: string;

  constructor(private http :HttpClient, 
              private auth : AuthService, 
              private router: Router,
              private spinner: NgxSpinnerService) {
    
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
      this.spinner.show()
      this.http.get<boolean>(API_URL+'/days/end_day', options)
      .pipe(finalize(() => this.spinner.hide()))
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
    await this.http.get<IDayData>(API_URL+'/days/get_bussiness_date', options)
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
