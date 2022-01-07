import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { StokCikis } from 'src/app/models/Entity/stokCikis';
import { StokCikisDetayDto } from 'src/app/models/Dto/stokCikisDetayDto';
import { NavService } from 'src/app/services/nav.service';
import { StokCikisService } from 'src/app/services/stok-cikis.service';


@Component({
  selector: 'app-gecmis-siparis-dialog',
  templateUrl: './gecmis-siparis-dialog.component.html',
  styleUrls: ['./gecmis-siparis-dialog.component.css']
})
export class GecmisSiparisDialogComponent implements OnInit {
  
  panelOpenState:boolean;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  aramaListesi:StokCikis[]=[];
  stokCikisDetay:StokCikisDetayDto[]=[];
  pastOrder = new EventEmitter<StokCikisDetayDto[]>()


  constructor(
    private stokCikisService:StokCikisService,
    private navService:NavService
    ) { }

  ngOnInit(): void {
  }

  
  searchByDate() {
      let fkDepo =parseInt(this.navService.getUserInfo().fkDepo.toString());
      let start=new Date(this.range.controls['start'].value).toISOString();
      let end=new Date(this.range.controls['end'].value).toISOString()
      this.stokCikisService.getPastStokCikisByTarih(start,end,fkDepo).subscribe(
        (res) => {
          this.aramaListesi = res.data;
        }
      )
  }
  getCikisDetay(islemNo:number) {
    this.stokCikisService.getCikisDetay(islemNo).subscribe(
      (res) => {
        this.stokCikisDetay = res.data;
      }
    )
  }

  useList(): void {
    this.pastOrder.emit(this.stokCikisDetay);
  }


}
