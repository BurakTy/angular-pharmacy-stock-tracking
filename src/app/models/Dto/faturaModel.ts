import { StokBirim } from "../Entity/stokBirim";
import { StokKart } from "../Entity/stokKart";

export interface FaturaModel{
    stok:StokKart;
    birimFiyat:number;
    adet:number;
    toplam:number;
    birim:StokBirim;
    sonKulTarih:Date;

}