export interface RegisterModel{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    fk_Depo:number;
    fk_User:number;
    claims:number[];
}