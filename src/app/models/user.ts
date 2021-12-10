import { IRole } from "./role"

export interface IUser {
    id         : any
    username   : string
    password   : string  
    rollNo     : string
    firstName  : string
    secondName : string
    lastName   : string
    alias      : string
    active     : boolean
    roles      : IRole[]

    saveUser() : void
    getUsers() : void
    getUser(username : string) : any
    deleteUser() : any
}