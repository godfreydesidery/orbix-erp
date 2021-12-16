import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { IUser } from 'src/app/models/user';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';


@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.component.html',
  styleUrls: ['./biometrics.component.scss']
})
export class BiometricsComponent implements OnInit {

  public users           : IUser[] = []

  constructor(private auth : AuthService, private http : HttpClient) { }

  ngOnInit(): void {
    this.getUsers()
  }

  async getUsers(){
    this.users = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<IUser[]>('/api/users', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.users.push(element)
          }
        )
      }
    )
    .catch(error => {
      ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load users')
    })
    return 
  }
  
}
