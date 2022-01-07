export interface StokFaturaDetay{
    Id?:number;
    fk_Fatura?:number;
    fk_StokKod:string;
    eklenenStok:number;
    birimFiyat:number;
    sonkulTarih:Date;
    fk_Birim:number;

}