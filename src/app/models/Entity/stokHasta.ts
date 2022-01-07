export interface StokHasta{
    id:number;
    kimlikNo:string;
    uyruk?:number;
    ad:string;
    soyad:string;
    yas?:number;
    cinsiyet:string;
    KayitTarih:Date;
    GirisTarih:Date;
    CikisTarih?:Date;
    isAktif:boolean;
    kimlikNoGizli:string;

}