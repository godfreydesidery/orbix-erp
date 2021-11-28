import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public id              : any
   public username        : string
   public password        : string
   public confirmPassword : string
   public rollNo          : string
   public firstName       : string
   public secondName      : string
   public lastName        : string
   public active          : boolean
   
   constructor(private httpClient : HttpClient) {
    this.id              = ''
     this.username        = ''
     this.password        = ''
     this.confirmPassword = ''
     this.rollNo          = ''
     this.firstName       = ''
     this.secondName      = ''
     this.lastName        = ''
     this.active          = false
    }
 
   ngOnInit(): void {

   }
 
 createUser(){
   /**
    * Create a single user
    */
 }
 
 getUser(){
   /**
    * Read a single user from database
    * given a search key
    */
 }
 
 getUsers(){
   /**
    * Read and return a page of users from database
    * given a read criteria
    */
 }
 
 updateUser(){
   /**
    * Update a selected user 
    */
 }
 
 deleteUser(){
   /**
    * Delete a selected user
    */
 }
 
 deleteUsers(){
   /**
    * Delete a group of users 
    * given a delete criteria
    */
 }
 
 validateUser(){
   /**
    * Validate user record,
    * return true if valid
    * else, flash error message and return false
    */
 }
 
 clearData(){
   /**
    * Clear the object data
    */
 }
}