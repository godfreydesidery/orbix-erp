import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  id: any;
  name: string;
  categories : ICategory[] = []

  constructor(private shortcut : ShortCutHandlerService, 
        private auth : AuthService, 
        private http : HttpClient) {
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
    var category = {
      id   : this.id,
      name : this.name
    }
    if(this.id == null || this.id == ''){
      //save a new till
      await this.http.post<ICategory>('/api/categories/create', category, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name
          
          alert('Category created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create category')
        }
      )

    }else{
      //update an existing till
      await this.http.put<ICategory>('/api/categories/update', category, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name 
          alert('Category updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update category')
        }
      )
    }
  }
  async getAll() {
    this.categories = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ICategory[]>('/api/categories', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.categories.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load categories')
      }
    )
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ICategory>("api/categories/get?id="+id, options)
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

    await this.http.get("api/categories/get_by_name?name="+name, options)
    .toPromise()
    .then(
      data=>{
        this.showCategory(data)
      }
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }

  showCategory(category : any){
    this.id   = category['id']
    this.name = category['name']
  }

  async delete(id : any) {
    if(window.confirm('Confirm delete of the selected category') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      await this.http.delete('/api/categories/delete?id='+id, options)
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Category deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete category')
        }
      )
    }
  }

  clearData(){
    this.id   = ''
    this.name = ''
  }

  
  async loadCategories(){
    this.categories = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ICategory[]>('/api/categories', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.categories.push(element)
        })
      }
    )
    .catch(
      error => {
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load categories')
      }
    )
  }

  createShortCut(shortCutName : string, link : string){
    if(confirm('Create shortcut for this page?')){
      this.shortcut.createShortCut(shortCutName, link)
    }
  }
}

export interface ICategory {
  
  id         : any
  name   : string
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}