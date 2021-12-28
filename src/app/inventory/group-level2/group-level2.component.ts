import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-group-level2',
  templateUrl: './group-level2.component.html',
  styleUrls: ['./group-level2.component.scss']
})
export class GroupLevel2Component implements OnInit, ILevelTwo {
  id: any;
  name: string;
  levelTwos : ILevelTwo[] = []

  constructor(private shortcut : ShortCutHandlerService, private auth : AuthService, private http : HttpClient) {
    this.id = ''
    this.name = ''
  }
  
  ngOnInit(): void {
    this.getAll()
  }

  async save(){
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var levelOne = {
      id   : this.id,
      name : this.name
    }
    if(this.id == null || this.id == ''){
      //save a new till
      await this.http.post<ILevelTwo>('/api/group_level_twos/create', levelOne, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name
          
          alert('Group created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create group')
        }
      )

    }else{
      //update an existing till
      await this.http.put<ILevelTwo>('/api/group_level_twos/update', levelOne, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name 
          alert('Group updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update group')
        }
      )
    }
  }
  async getAll() {
    this.levelTwos = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelTwo[]>('/api/group_level_twos', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelTwos.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ILevelTwo>("api/group_level_twos/get?id="+id, options)
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.name = data!.name
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )

  }
  async getByName(name: string) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get("api/group_level_twos/get_by_name?name="+name, options)
    .toPromise()
    .then(
      data=>{
        this.showGroup(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }

  showGroup(group : any){
    this.id   = group['id']
    this.name = group['name']
  }

  async delete(id : any) {
    if(window.confirm('Confirm delete of the selected group') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      await this.http.delete('/api/group_level_twos/delete?id='+id, options)
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Group deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete group')
        }
      )
    }
  }

  clearData(){
    this.id   = ''
    this.name = ''
  }

  
  async loadGroups(){
    this.levelTwos = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ILevelTwo[]>('/api/group_level_twos', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelTwos.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface ILevelTwo {
  
  id         : any
  name   : string
  //classes : IClass[]
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}