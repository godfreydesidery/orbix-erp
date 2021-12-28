import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShortCutHandlerService } from 'src/app/services/short-cut-handler.service';
import { ICategory } from '../category/category.component';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-material-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  id         : any
  name       : string
  subCategories!: ISubCategory[];
  categoryName : string
  categoryNames : string[] = []
  class_! : ICategory

  constructor(private shortcut : ShortCutHandlerService, private auth : AuthService, private http : HttpClient) {
    this.id = ''
    this.name = ''
    this.categoryName = ''
  }

  ngOnInit(): void {
    this.loadCategoryNames()
    this.getAll()
  }
  
  async save() {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    var subCategory = {
      id   : this.id,
      name : this.name,
      category : {
        name : this.categoryName
      }
    }
    if(this.id == null || this.id == ''){
      //save a new till
      await this.http.post<ISubCategory>(API_URL+'/sub_categories/create', subCategory, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name
          
          alert('Sub Category created successifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not create sub category')
        }
      )

    }else{
      //update an existing till
      await this.http.put<ISubCategory>(API_URL+'/sub_categories/update', subCategory, options)
      .toPromise()
      .then(
        data => {
          this.id   = data?.id
          this.name = data!.name 
          alert('Sub Category updated successifully')
          this.getAll()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not update sub category')
        }
      )
    }
  }
  async getAll(){
    this.subCategories = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ISubCategory[]>(API_URL+'/sub_categories', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.subCategories.push(element)
        })
        console.log(data)
      }
    )
    .catch(
      error => {
        console.log(error)
        ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not load sub categories')
      }
    )
  }
  async get(id: any) {
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }

    await this.http.get<ISubCategory>(API_URL+'/sub_categories/get?id='+id, options)
    .toPromise()
    .then(
      data=>{
        this.id = data?.id
        this.name = data!.name
        this.categoryName = data!.category.name 
      }
      
    )
    .catch(
      error=>{
        console.log(error)        
        alert('No matching record')
      }
    )
  }
  getByName(name: string) {
    throw new Error('Method not implemented.');
  }
  async delete(id : any) {
    if(window.confirm('Confirm delete of the selected  sub category') == true){
      let options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
      }
      await this.http.delete(API_URL+'/sub_categories/delete?id='+id, options)
      .toPromise()
      .then(
        data => {
          //reload tills
          alert('Sub Category deleted succesifully')
          this.getAll()
          this.clearData()
        }
      )
      .catch(
        error => {
          ErrorHandlerService.showHttpErrorMessage(error, '', 'Could not delete sub category')
        }
      )
    }
  }

  

  clearData(){
    this.id = ''
    this.name = ''
    this.categoryName = ''
  }

  async loadCategoryNames(){
    this.categoryNames = []
    let options = {
      headers: new HttpHeaders().set('Authorization', 'Bearer '+this.auth.user.access_token)
    }
    await this.http.get<ICategory[]>('/api/categories', options)
    .toPromise()
    .then(
      data => {
        data?.forEach(element => {
          this.categoryNames.push(element.name)
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
export interface ISubCategory {
  
  id       : any
  name     : string
  category : ICategory
  
  save() : void
  getAll() : void
  get(id : any) : any
  getByName(name : string) : any
  delete(id : any) : any
}