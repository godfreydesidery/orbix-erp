export interface IRole{
    id      : any
    name    : string
    granted :boolean

    saveRole() : void
    getRoles() : any
    getRole(roleName : string) : any
    deleteRole(role : string) : any
}