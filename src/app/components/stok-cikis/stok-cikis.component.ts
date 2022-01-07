import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { StokCikis } from 'src/app/models/Entity/stokCikis';
import { StokCikisDetay } from 'src/app/models/Entity/stokCikisDetay';
import { StokDepo } from 'src/app/models/Entity/stokDepo';

import { StokKart } from 'src/app/models/Entity/stokKart';
import { UserDetail } from 'src/app/models/Auth/userDetail';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokCikisService } from 'src/app/services/stok-cikis.service';
import { StokDepoService } from 'src/app/services/stok-depo.service';
import { GecmisSiparisDialogComponent } from '../gecmis-siparis-dialog/gecmis-siparis-dialog.component';
import { IlacAramaDialogComponent } from '../ilac-arama-dialog/ilac-arama-dialog.component';
import { StokEnvanterDto } from 'src/app/models/Dto/stokEnvanterDto';
import { StokSabitService } from 'src/app/services/stok-sabit.service';

@Component({
  selector: 'app-stok-cikis',
  templateUrl: './stok-cikis.component.html',
  styleUrls: ['./stok-cikis.component.css']
})
export class StokCikisComponent implements OnInit {
  displayedColumns = ['index', 'barkodNo', 'stokAd', 'stokTur', 'anaBirimN', 'adet', 'button'];

  @ViewChild('siparisList', { static: true }) table: MatTable<StokKart>;
  today = new Date();
  siparisListesi: StokEnvanterDto[] = [];
  userDet: UserDetail;
  birim: string;
  responseStokCikis: StokCikis;
  talepAktifDepolar: StokDepo[] = [];
  aktifDepolar: StokDepo[] = [];
  loading = false;
  stokCikisForm: FormGroup;

  constructor(
    private dialogService: MatDialog,
    private stokCikisService: StokCikisService,
    private stokDepoService: StokDepoService,
    private sabitlerService: StokSabitService,
    private navService: NavService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.createstokDepoForm();
    this.getTalepAktifDepo();
    this.getAktifDepo();
  }

  createstokDepoForm() {
    this.stokCikisForm = this.formBuilder.group({
      aciklama: ['', Validators.required],
      isteyendepo: [parseInt(this.userDet.fkDepo.toString()), Validators.required],
      istekdepo: [1, Validators.required],
    });
  }
  stokCikisRefresh() {
    this.createstokDepoForm();
    this.siparisListesi = [];
  }
  openDialog() {
    const dialogRef = this.dialogService.open(IlacAramaDialogComponent, {
      minHeight: '60vh',
      data: {
        istekDepo: this.stokCikisForm.controls['istekdepo'].value
      }
    });

    const subscribeDialog = dialogRef.componentInstance.order.subscribe((data) => {
      if (data.adet || data.adet > 0) {
        if (this.siparisListesi.length == 0 || this.siparisListesi[0].stokTur == data.stokTur) {
          let item = this.siparisListesi.find(x => x.fk_StokKod == data.fk_StokKod);
          if (item) {
            item.adet += data.adet;
          } else {
            this.siparisListesi.push(data)
          }
          this.table.renderRows();
        } else {
          this.snackBar.error("Sadece Aynı Tip ürün Eklenebilir")
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      subscribeDialog.unsubscribe();
    });
  }
  gecmisSiparisListesi() {
    const dialogRef = this.dialogService.open(GecmisSiparisDialogComponent, {
      minHeight: '60vh'
    });

    const subscribeDialog = dialogRef.componentInstance.pastOrder.subscribe((data) => {
      this.siparisListesi = [];
      if (data.length > 0) {
        for (let item of data) {
          let nwKart: StokEnvanterDto = {
            fk_StokKod: item.fk_StokKod,
            stokAd: item.stokAd,
            stokTur: item.stokTur,
            anaBirim: item.anaBirim,
            barkodNo: item.barkodNo,
            adet: item.istenilen,
            anaBirimN: item.anaBirimN,
            toplam: item.stok

          };
          this.siparisListesi.push(nwKart);
        }
        this.stokCikisForm.controls['istekdepo'].setValue(data[0].fk_IstekDepo);
        this.table.renderRows();
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      subscribeDialog.unsubscribe();
    });
  }
  adetChange(stok: StokEnvanterDto, artis: number) {
    stok.adet = stok.adet ? stok.adet + artis : (artis < 0 ? 0 : 1);
    this.table.renderRows();
  }
  removeItem(item: StokEnvanterDto) {
    let index = this.siparisListesi.indexOf(item);
    this.siparisListesi.splice(index, 1);
    this.table.renderRows();
  }

  saveSiparislist() {
    this.loading = true;
    let user: UserDetail = this.navService.getUserInfo();
    let stokcikis: StokCikis = {
      onayTarihi: null,
      aciklama: this.stokCikisForm.controls['aciklama'].value,
      fk_IstekDepo: this.stokCikisForm.controls['istekdepo'].value,
      fk_IsteyenDepo: this.stokCikisForm.controls['isteyendepo'].value,
      fk_Login: parseInt(user.nameIdentifier.toString()),
      fk_OnayLogin: null,
      islemNo: 0,
      islemTarih: new Date(),
      islemTip: 1
    }

    let stokdetaylist: StokCikisDetay[] = [];

    for (let item of this.siparisListesi) {
      let stokcikisd: StokCikisDetay = {
        detayNo: 0,
        fk_StokKod: item.fk_StokKod,
        istenilen: item.adet,
        verilen: item.adet,
        islemNo: 0
      }
      stokdetaylist.push(stokcikisd);
    }
    this.stokCikisService.stokCikisKaydet(stokcikis, stokdetaylist).subscribe(
      (res) => {
        this.responseStokCikis = res.data;
        this.snackBar.success("Kayıt Başarılı")
        //this.stokCikisRefresh();
        this.loading = false;
      },
      (err) => {
        this.snackBar.error("Kayıt Başarısız")
        this.loading = false;
      }

    )
  }
  getTalepAktifDepo() {
    this.stokDepoService.getStokDepoTalepAktif().subscribe(
      res => {
        this.talepAktifDepolar = res.data;
        this.birim = this.userDet.depo;
      }
    )
  }
  getAktifDepo() {
    if (this.userDet.fkDepo == 1) {
      this.stokDepoService.getStokDepo().subscribe(
        res => {
          this.aktifDepolar = res.data;
        }
      )
    } else {
      let depo: StokDepo = { aciklama: this.userDet.depo, fk_StokTur: 0, depoTip: 0, kod: parseInt(this.userDet.fkDepo.toString()), talepAktif: "H", yil: 0 };
      this.aktifDepolar.push(depo)
    }
  }
  getUser() {
    this.userDet = this.navService.getUserInfo()
  }
  alert(m: string) {
    alert(m);
  }
  getPdf() {
    this.sabitlerService.getPdf(this.responseStokCikis.islemNo,1).subscribe(
      res => { },
      err => {
          this.snackBar.error("Pdf Not Create !!")
      });
  }


}
