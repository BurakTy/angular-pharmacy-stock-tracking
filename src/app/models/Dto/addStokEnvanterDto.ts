import { StokFatura } from "../Entity/stokFatura";
import { StokFaturaDetay } from "../Entity/stokFaturaDetay";

export class AddStokEnvanterDto{
    stokFaturaDetay:StokFaturaDetay[];
    stokFatura:StokFatura;
}