export interface IRole{
    id      : any
    name    : string
    granted :boolean

    saveRole() : void
    getRoles() : IRole[]
    getRole(roleName : string) : IRole
    deleteRole() : boolean
}