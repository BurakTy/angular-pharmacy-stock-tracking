export class StokCikisDetayDto {

    //  islemTarih:Date
    //  onayTarihi:Date
    detayNo: number;
    islemNo:number
    fk_StokKod:string;
    stokAd: string;
    stokTurN: string;
    stokTur:number;
    anaBirimN: string;
    anaBirim:number;
    stok: number;
    cepStok: number;
    istenilen: number;
    verilen: number;
    isteyenDepo: string;
    istekDepo: string;
    fk_IstekDepo?:number;
    barkodNo: string;

}