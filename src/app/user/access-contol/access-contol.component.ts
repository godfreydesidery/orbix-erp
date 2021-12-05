import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IObject } from 'src/app/models/object';
import { IOperation } from 'src/app/models/operation';

@Component({
  selector: 'app-access-contol',
  templateUrl: './access-contol.component.html',
  styleUrls: ['./access-contol.component.scss']
})
export class AccessContolComponent implements OnInit {

  public objects : String[]
  public operations : String[]

  constructor(private http : HttpClient) {
    this.objects = []
    this.operations = []
  }

  ngOnInit(): void {
    this.getAllObjects()
    this.getAllOperations()
  }

  async getAllObjects(){
    /**
     * Get all the objects
     */
     let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<String[]>('/api/objects', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.objects.push(element)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })

  }

  async getAllOperations(){
    /**
     * Get all the operations
     */
     let currentUser : {
      username : string, 
      access_token : string, 
      refresh_token : string
    } = JSON.parse(localStorage.getItem('current-user')!)    
    let options = {
      headers : new HttpHeaders().set('Authorization', 'Bearer '+currentUser.access_token)
    }

    await this.http.get<String[]>('/api/operations', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(
          element => {
            this.operations.push(element)
          }
        )
      }
    )
    .catch(error => {
      console.log(error)
    })
  }

}
