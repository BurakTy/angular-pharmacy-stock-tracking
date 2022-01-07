export interface StokFatura{
    id:number;
    faturaNo:string;
    faturaTarih:Date;
    bakanlikOnayNo:string;
    bakanlikProtokolNo:string;
    ihaleNo:string;
    gelenBilgiUnvan:string;
    gelenFaturaTarih:Date;
    gelenFaturaNo:string;
    kayitTarih:Date;
    fk_Login:number;
    fk_Depo:number;
}