import { StokBirim } from "../Entity/stokBirim";
import { StokHasta } from "../Entity/stokHasta";
import { StokEnvanterDto } from "../Dto/stokEnvanterDto";

export interface IlacCikisDto{
    hasta:StokHasta
    stok:StokEnvanterDto;
    birimFiyat:number;
    adet:number;
    toplam:number;
    birim:StokBirim;

}