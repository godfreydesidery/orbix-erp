import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from './models/user';


const API_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  getAll() {
    return this.http.get<IUser[]>(API_URL+'/users')
  }
}