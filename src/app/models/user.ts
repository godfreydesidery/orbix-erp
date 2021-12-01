export class User {
    constructor(
        public username : string,
        public accessToken : string,
        public expirationDate : Date
    ){} 
    
    getToken(){
        if(this.expirationDate || new Date() > this.expirationDate){
            return null
        }
        return this.accessToken
    }
}