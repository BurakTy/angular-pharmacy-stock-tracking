import { Component, OnInit } from '@angular/core';
import { StokEnvanterDto } from 'src/app/models/Dto/stokEnvanterDto';
import { NavService } from 'src/app/services/nav.service';
import { StokEnvanterService } from 'src/app/services/stok-envanter.service';

@Component({
  selector: 'app-depo-tum-stok',
  templateUrl: './depo-tum-stok.component.html',
  styleUrls: ['./depo-tum-stok.component.css']
})
export class DepoTumStokComponent implements OnInit {

  displayedColumns = ['index', 'barkodNo', 'stokAd', 'stokTur', 'anaBirimN', 'toplam'];
  depoTumStokListesi: StokEnvanterDto[];
  constructor(
    private navService:NavService,
    private stokEnvanterService:StokEnvanterService
  ) { }

  ngOnInit(): void {
    this.searchByName();
  }

  searchByName(event?: Event){
    let name = event!=null?(event.target as HTMLInputElement).value:"";
    this.stokEnvanterService.searchStokByName(name,this.navService.getUserInfo().fkDepo).subscribe(
      (res) => {
        this.depoTumStokListesi = res.data;
      }
    )
  }
}
