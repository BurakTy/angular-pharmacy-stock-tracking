import { getLocaleId } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { StokCikis } from 'src/app/models/Entity/stokCikis';
import { StokCikisDetayDto } from 'src/app/models/Dto/stokCikisDetayDto';
import { StokCikisDto } from 'src/app/models/Dto/stokCikisDto';
import { StokDepo } from 'src/app/models/Entity/stokDepo';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokCikisService } from 'src/app/services/stok-cikis.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  for = getLocaleId(this.locale);
  displayedColumns = ['index', 'barkodNo', 'stokAd', 'stokTurN', 'anaBirimN','stok','istenilen', 'verilen','button'];
  stokDepos: StokDepo[];
  rangeValue?: string = "1";
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  aramaListesi: StokCikisDto[] = [];
  stokCikisDetay: StokCikisDetayDto[] = [];
  currentStokCikis:StokCikisDto=new StokCikisDto();

  @ViewChild(MatTable, { static: true }) table: MatTable<StokDepo>;
  activeClass = "";

  constructor(
    private navService: NavService,
    private stokCikisService: StokCikisService,
    private sabitlerService:StokSabitService,
    @Inject(LOCALE_ID) public locale: string,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.navService.yonlendirme();
    this.activeClass = "text-danger";
    this.setRangeDate("1");
    this.searchOnaylanacakByDate();
  }

  setRangeDate(day: string) {
    let end = new Date();
    let start = new Date();
    start = new Date(start.setDate(start.getDate() - (parseInt(day) - 1)));
    this.range.controls["start"].setValue(start);
    this.range.controls["end"].setValue(end);

  }

  searchOnaylanacakByDate() {
    this.aramaListesi =[];
    let start = new Date(this.range.controls['start'].value).toISOString();
    let end = new Date(this.range.controls['end'].value).toISOString();
    let user=this.navService.getUserInfo();
    this.stokCikisService.getOnaylanacak(start, end,parseInt(user.fkDepo.toString())).subscribe(
      (res) => {
        this.aramaListesi = res.data;
      }
    )
  }
  getCikisDetay(stokCikis:StokCikisDto) {
    this.currentStokCikis=stokCikis;
    this.stokCikisService.getCikisDetay(stokCikis.islemNo).subscribe(
      (res) => {
        this.stokCikisDetay = res.data;
      }
    )
  }

  adetChange(stok: StokCikisDetayDto, artis: number) {
    stok.verilen = stok.verilen ? stok.verilen + artis : (artis < 0 ? 0 : 1);
    this.table.renderRows();
  }

  siparisOnayla() { 
    let fkonay=parseInt(this.navService.getUserInfo().nameIdentifier.toString());
    this.stokCikisService.stokCikisOnayla(fkonay,this.currentStokCikis.islemNo,this.stokCikisDetay).subscribe(
      (res) => {
          this.snackBar.success("Onaylama Başarılı");
          this.searchOnaylanacakByDate();
          this.stokCikisDetay=[];
      },(err)=>{
        if(err.error==null){
          this.snackBar.error("Error");
        }else{
          this.snackBar.error(err.error.message);
        }
          
      }
    )
  }

  getPdf() {
    this.sabitlerService.getPdf(this.currentStokCikis.islemNo,1).subscribe(
      res => { },
      err => {
          this.snackBar.error("Pdf Not Create !!")
      });
  }
}
