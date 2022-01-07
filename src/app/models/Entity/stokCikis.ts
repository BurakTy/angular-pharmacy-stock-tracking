export interface StokCikis{
    islemNo:number;
    islemTarih:Date;
    islemTip:number;
    aciklama:string;
    fk_Login:number;
    fk_IsteyenDepo?:number;
    onayTarihi?:Date;
    fk_OnayLogin?:number;
    fk_IstekDepo?:number;
}