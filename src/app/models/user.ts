export class User {
    public id : string
    
    public rollNo     : string
    public firstName  : string
    public secondName : string
    public lastName   : string

    constructor(
        public username : string,
        public accessToken : string,
        public expirationDate : Date
    ){
        this.id          = ''
        this.rollNo      = ''
        this.firstName   = ''
        this.secondName  = ''
        this.lastName    = ''
    } 
    
    getToken(){
        if(this.expirationDate || new Date() > this.expirationDate){
            return null
        }
        return this.accessToken
    }
}