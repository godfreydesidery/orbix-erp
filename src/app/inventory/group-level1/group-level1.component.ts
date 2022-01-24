import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-group-level1',
  templateUrl: './group-level1.component.html',
  styleUrls: ['./group-level1.component.scss']
})
export class GroupLevel1Component implements OnInit, ILevelOne {

  public inputsLocked      : boolean = true

  public enableSearch : boolean = false
  public enableDelete : boolean = false
  public enableSave   : boolean = false

  id: any;
  name: string;
  levelOnes : ILevelOne[] = []

  constructor(private shortcut : ShortCutHandlerService, 
              private auth : AuthService, 
              private http : HttpClient,
              private spinner: NgxSpinnerService) {
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
      this.spinner.show()
      await this.http.post<ILevelOne>('/api/group_level_ones/create', levelOne, options)
      .pipe(finalize(() => this.spinner.hide()))
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
      this.spinner.show()
      await this.http.put<ILevelOne>('/api/group_level_ones/update', levelOne, options)
      .pipe(finalize(() => this.spinner.hide()))
      .toPromise()
      .then(
        data => {
          this.lockAll()
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
    this.levelOnes = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ILevelOne[]>('/api/group_level_ones', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelOnes.push(element)
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
    this.spinner.show()
    await this.http.get<ILevelOne>("api/group_level_ones/get?id="+id, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
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
    this.spinner.show()
    await this.http.get("api/group_level_ones/get_by_name?name="+name, options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data=>{
        this.lockAll()
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
      this.spinner.show()
      await this.http.delete('/api/group_level_ones/delete?id='+id, options)
      .pipe(finalize(() => this.spinner.hide()))
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
    this.unlockAll()
  }

  
  async loadGroups(){
    this.levelOnes = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    this.spinner.show()
    await this.http.get<ILevelOne[]>('/api/group_level_ones', options)
    .pipe(finalize(() => this.spinner.hide()))
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.levelOnes.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load groups')
      }
    )
  }

  unlockAll(){
    this.inputsLocked      = false   
  }

  lockAll(){
    this.inputsLocked      = true
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface ILevelOne {
  
  id         : any
  name   : string
  //classes : IClass[]
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}
