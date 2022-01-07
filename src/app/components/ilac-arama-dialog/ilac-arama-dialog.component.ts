import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StokEnvanterDto } from 'src/app/models/Dto/stokEnvanterDto';
import { StokEnvanterService } from 'src/app/services/stok-envanter.service';


@Component({
  selector: 'app-ilac-arama-dialog',
  templateUrl: './ilac-arama-dialog.component.html',
  styleUrls: ['./ilac-arama-dialog.component.css']
})
export class IlacAramaDialogComponent implements OnInit {


  order = new EventEmitter<StokEnvanterDto>();
  aramaListesi: StokEnvanterDto[];

  constructor(
    private stokEnvanterService: StokEnvanterService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }
  ngOnInit(): void {
  }

  adetChange(folder: StokEnvanterDto, artis: number) {
    folder.adet = folder.adet ? folder.adet + artis : (artis < 0 ? 0 : 1);
  }

  searchByName(event: Event) {
    let name = (event.target as HTMLInputElement).value;
    name=name==null?"":name;
      this.stokEnvanterService.searchStokByName(name,this.data.istekDepo).subscribe(
        (res) => {
          this.aramaListesi = res.data;
         
        }
      )
   
  }

  addOrders(item:StokEnvanterDto): void {
    this.order.emit(item);
  }


}
