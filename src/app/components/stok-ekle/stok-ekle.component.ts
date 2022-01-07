import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FaturaModel } from 'src/app/models/Dto/faturaModel';
import { StokBirim } from 'src/app/models/Entity/stokBirim';
import { StokFaturaDetay } from 'src/app/models/Entity/stokFaturaDetay';
import { StokEnvanterLog } from 'src/app/models/Entity/stokEnvanterLog';
import { StokKart } from 'src/app/models/Entity/stokKart';
import { UserDetail } from 'src/app/models/Auth/userDetail';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokEnvanterService } from 'src/app/services/stok-envanter.service';
import { StokKartService } from 'src/app/services/stok-kart.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';
import { FaturaBilgiDialogComponent } from '../fatura-bilgi-dialog/fatura-bilgi-dialog.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AddStokEnvanterDto } from 'src/app/models/Dto/addStokEnvanterDto';
import { identifierModuleUrl } from '@angular/compiler';
import { GecmisFaturaDialogComponent } from '../gecmis-fatura-dialog/gecmis-fatura-dialog.component';


@Component({
  selector: 'app-stok-ekle',
  templateUrl: './stok-ekle.component.html',
  styleUrls: ['./stok-ekle.component.css']
})
export class StokEkleComponent implements OnInit {
  displayedColumns = ['index', 'stokAd', 'stokTur', 'anaBirim', 'adet', 'fiyat', 'toplam', 'tarih', 'button'];

  @ViewChild('stokekletable', { static: true }) table: MatTable<StokKart>;
  @ViewChild('birim') birimAuto: MatAutocompleteTrigger;
  aramaListesi: StokKart[] = [];
  faturaListesi: FaturaModel[] = [];
  faturaForm: FormGroup;
  birimler: StokBirim[] = [];
  searchName: string = "";
  searchBarkod: string = "";
  eklenecek: number;
  notFound: boolean = false;
  loading: boolean = false;
  myControl = new FormControl();
  responseFaturoId: number = 0;
  faturaToplam: number = 0;
  constructor(
    private stokKartServie: StokKartService,
    private stokEnvanter: StokEnvanterService,
    private navService: NavService,
    private stokSabitService: StokSabitService,
    private formBuilder: FormBuilder,
    private dialogService: MatDialog,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getBirimler();
    this.createFaturaForm();
  }

  createFaturaForm() {
    this.faturaForm = this.formBuilder.group({
      stok: ["", Validators.required],
      birim: ["", Validators.required],
      adet: ["", Validators.required],
      birimFiyat: ["", Validators.required],
      sonKulTarih: [new Date(), Validators.required]
    })
  }

  displayFnKart(item: StokKart): string {
    return item ? item.stokAd : "";
  }
  displayFnBirim(item: StokBirim): string {
    return item ? item.birimAdi : "";
  }

  searchByName(event: Event) {
    this.notFound = false;
    let name = (event.target as HTMLInputElement).value.toLocaleUpperCase();
    if (name.length > 2) {
      this.stokKartServie.searchStokByName(name).subscribe(
        (res) => {
          this.aramaListesi = res.data;
          this.notFound = this.aramaListesi.length == 0 ? true : false;
        }
      )
    } else {
      this.aramaListesi = [];
    }
  }

  searchByBarkod() {
    this.notFound = false;
    let name = this.searchBarkod;
    if (name.length > 2) {
      this.stokKartServie.searchStokByName(name).subscribe(
        (res) => {
          this.aramaListesi = res.data;
          this.notFound = this.aramaListesi.length == 0 ? true : false;
        }
      )
    } else {
      this.aramaListesi = [];
    }
  }

  updateStok(element: any) {
    let user: UserDetail = this.navService.getUserInfo();
    let id = parseInt(user.nameIdentifier.toString());
    let depo = parseInt(user.fkDepo.toString());
    let envanter: StokEnvanterLog = { fk_Depo: depo, fk_StokKod: element.stokKod, eklenenStok: element.eklenecek, fk_Login: id, EklemeTarih: new Date() }
    // this.stokEnvanter.envanterAdd(envanter).subscribe((res) => {
    //   alert("başarılı");
    // });
  }



  editStok(element: any) {
    this.snackBar.info(element);
  }

  getBirimler() {
    this.stokSabitService.getStokBirim().subscribe(
      (res) => {
        this.birimler = res.data;
      }
    )
  }

  addFatura() {
    let fatura: FaturaModel = Object.assign({}, this.faturaForm.value);

    if (fatura.stok.stokTur == this.navService.getUserInfo().depoTip) {
      fatura.toplam = fatura.birimFiyat * fatura.adet;
      this.faturaToplam = this.faturaToplam + fatura.toplam;
      this.faturaListesi.unshift(fatura);
      this.table.renderRows();
    } else {
      this.snackBar.info("Bu Malzeme Türü Bu Depoya Eklenemez");
    }
  }

  saveFaturaList() {
    const dialogRef = this.dialogService.open(FaturaBilgiDialogComponent, {
      minHeight: '40vh',
      maxWidth: '700px'
    });

    const subscribeDialog = dialogRef.componentInstance.fatura.subscribe((data) => {

      dialogRef.close(FaturaBilgiDialogComponent);
      this.loading = true;
      data.kayitTarih = new Date();
      data.fk_Login = parseInt(this.navService.getUserInfo().nameIdentifier.toString());
      data.fk_Depo = parseInt(this.navService.getUserInfo().fkDepo.toString());



      let envanterDto: AddStokEnvanterDto = {
        stokFatura: data,
        stokFaturaDetay: []
      }
      for (let item of this.faturaListesi) {
        let stokFatura: StokFaturaDetay = {
          birimFiyat: item.birimFiyat,
          eklenenStok: item.adet,
          fk_Birim: item.birim.id,
          fk_StokKod: item.stok.stokKod,
          sonkulTarih: item.sonKulTarih
        }
        envanterDto.stokFaturaDetay.push(stokFatura)
      }

      this.stokEnvanter.envanterAdd(envanterDto).subscribe((res) => {
        this.responseFaturoId = res.data;
        this.loading = false;
        this.snackBar.success("Fatura Oluşturuldu");
      }, (err) => {

        this.snackBar.error('Kayıt Başarısız Tekrar Deneyiniz');
        this.loading = false;
      })
    });

    dialogRef.afterClosed().subscribe(result => {
      subscribeDialog.unsubscribe();
    });
  }

  gecmisFaturaListesi() {
    const dialogRef = this.dialogService.open(GecmisFaturaDialogComponent, {
      minHeight: '60vh'
    });
  }
  removeFaturaList() {
    this.faturaListesi = [];
    this.responseFaturoId = 0;
    this.faturaToplam = 0;
    this.table.renderRows();
  }
  removeFromlist(item: FaturaModel) {
    let index = this.faturaListesi.indexOf(item);
    this.faturaListesi.splice(index, 1);
    this.faturaToplam -= item.toplam;
    this.table.renderRows();
  }

  changeBirim(element: StokKart) {

    let birim: StokBirim = this.birimler.find(x => x.id == element.anaBirim);
    this.faturaForm.controls['birim'].setValue(birim);

  }

  getPdf() {
    this.stokSabitService.getPdf(this.responseFaturoId, 2).subscribe(
      res => { },
      err => { this.snackBar.error("Pdf Not Create !!") }
    );
  }

  getPdfB() {
    this.stokSabitService.getPdf(this.responseFaturoId, 3).subscribe(
      res => { },
      err => { this.snackBar.error("Pdf Not Create !!") }
    );
  }

}
