import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StokFatura } from 'src/app/models/Entity/stokFatura';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokEnvanterService } from 'src/app/services/stok-envanter.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';

@Component({
  selector: 'app-gecmis-fatura-dialog',
  templateUrl: './gecmis-fatura-dialog.component.html',
  styleUrls: ['./gecmis-fatura-dialog.component.css']
})
export class GecmisFaturaDialogComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  aramaListesi: StokFatura[] = [];
  constructor(
    private navService: NavService,
    private stokSabitService: StokSabitService,
    private stokEnvanterService: StokEnvanterService,
    private snackBar:SnackbarService
  ) { }

  ngOnInit(): void {
  }

  searchByDate() {
    let fkDepo = parseInt(this.navService.getUserInfo().fkDepo.toString());
    let start = new Date(this.range.controls['start'].value).toISOString();
    let end = new Date(this.range.controls['end'].value).toISOString()
    this.stokEnvanterService.getPastFaturaByTarih(start, end, fkDepo).subscribe(
      (res) => {
        this.aramaListesi = res.data;
      }
    )
  }

  getPdf(faturaId:number) {
    this.stokSabitService.getPdf(faturaId,2).subscribe(
      res => { },
      err => {
          this.snackBar.error("Pdf Not Create !!")
      });
  }

  
  getPdfB(faturaId:number) {
    this.stokSabitService.getPdf(faturaId, 3).subscribe(
      res => { },
      err => { this.snackBar.error("Pdf Not Create !!") }
    );
  }
}
