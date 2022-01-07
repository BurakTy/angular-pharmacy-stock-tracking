import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { IlacCikisDto } from 'src/app/models/Dto/ilacCikisDto';
import { StokEnvanterDto } from 'src/app/models/Dto/stokEnvanterDto';
import { StokIlacCikis } from 'src/app/models/Entity/stoIlacCikis';
import { StokBirim } from 'src/app/models/Entity/stokBirim';
import { StokCikis } from 'src/app/models/Entity/stokCikis';
import { StokHasta } from 'src/app/models/Entity/stokHasta';
import { StokKart } from 'src/app/models/Entity/stokKart';
import { UserDetail } from 'src/app/models/Auth/userDetail';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokCikisService } from 'src/app/services/stok-cikis.service';
import { StokEnvanterService } from 'src/app/services/stok-envanter.service';
import { StokHastaService } from 'src/app/services/stok-hasta.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';

@Component({
  selector: 'app-ilac-cikis',
  templateUrl: './ilac-cikis.component.html',
  styleUrls: ['./ilac-cikis.component.css']
})
export class IlacCikisComponent implements OnInit {

  displayedColumns = ['index', 'hastaAd', 'stokAd', 'anaBirim', 'adet', 'fiyat', 'toplam', 'button'];

  @ViewChild('ilacCikistable', { static: true }) table: MatTable<IlacCikisDto>;
  @ViewChild('birim') birimAuto: MatAutocompleteTrigger;
  aramaListesi: StokEnvanterDto[] = [];
  hastaAramaListesi: StokHasta[];
  ilacCikisList: IlacCikisDto[] = [];
  ilacCikisForm: FormGroup;
  birimler: StokBirim[] = [];
  ilacCikisToplam: number = 0;
  responseStokCikis: StokCikis= {aciklama:"",fk_Login:0,islemNo:0,islemTarih:new Date(),islemTip:2};

  notFound: boolean = false;
  loading: boolean = false;

  constructor(
    private stokHastaService: StokHastaService,
    private navService: NavService,
    private stokCikisService: StokCikisService,
    private stokEnvanterService: StokEnvanterService,
    private stokSabitService: StokSabitService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.createIlacCikisForm()
    this.getBirimler();
  }

  createIlacCikisForm() {
    this.ilacCikisForm = this.formBuilder.group({
      hasta: ["", Validators.required],
      stok: ["", Validators.required],
      birim: ["", Validators.required],
      adet: ["", Validators.required],
      birimFiyat: ["", Validators.required],
    })
  }


  searchByNameHasta(event: Event) {
    this.notFound = false;
    let name = (event.target as HTMLInputElement).value.toLocaleUpperCase();
    if (name.length > 2) {
      this.stokHastaService.searchStokHastaByName(name).subscribe(
        (res) => {
          this.hastaAramaListesi = res.data;
          this.notFound = this.hastaAramaListesi.length == 0 ? true : false;
        }
      )
    } else {
      this.hastaAramaListesi = [];
    }
  }

  displayFnHasta(item: StokHasta): string {
    return item ? item.ad + " " + item.soyad : "";
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
    let fk_depo = parseInt(this.navService.getUserInfo().fkDepo.toString());
    if (name.length > 2) {
      this.stokEnvanterService.searchStokByName(name, fk_depo).subscribe(
        (res) => {
          this.aramaListesi = res.data;
          this.notFound = this.aramaListesi.length == 0 ? true : false;
        }
      )
    } else {
      this.aramaListesi = [];
    }
  }

  getBirimler() {
    this.stokSabitService.getStokBirim().subscribe(
      (res) => {
        this.birimler = res.data;
      }
    )
  }
  changeBirim(element: StokEnvanterDto) {

    let birim: StokBirim = this.birimler.find(x => x.id == element.anaBirim);
    this.ilacCikisForm.controls['birim'].setValue(birim);
    this.ilacCikisForm.controls['birimFiyat'].setValue(element.sonFiyat);

  }
  addIlacCikis() {
    let ilacCikis: IlacCikisDto = Object.assign({}, this.ilacCikisForm.value);
    ilacCikis.toplam = ilacCikis.birimFiyat * ilacCikis.adet;
    this.ilacCikisToplam = this.ilacCikisToplam + ilacCikis.toplam;
    this.ilacCikisList.unshift(ilacCikis);
    this.table.renderRows();

  }

  removeFromlist(item: IlacCikisDto) {
    let index = this.ilacCikisList.indexOf(item);
    this.ilacCikisList.splice(index, 1);
    this.ilacCikisToplam -= item.toplam;
    this.table.renderRows();
  }
  removeIlacCikisList() {
    this.ilacCikisList = [];
    this.responseStokCikis= {aciklama:"",fk_Login:0,islemNo:0,islemTarih:new Date(),islemTip:2};
    this.ilacCikisToplam = 0;
    this.table.renderRows();
  }
  saveIlacCikisList() {
    this.loading = true;
    let user:UserDetail=this.navService.getUserInfo();
    let stokcikis: StokCikis = {
      onayTarihi: new Date(),
      aciklama: "ilaç Çıkış",
      fk_IstekDepo: parseInt(user.fkDepo.toString()),
      fk_IsteyenDepo: parseInt(user.fkDepo.toString()),
      fk_Login: parseInt(user.nameIdentifier.toString()),
      fk_OnayLogin: parseInt(user.nameIdentifier.toString()),
      islemNo: 0,
      islemTarih: new Date(),
      islemTip: 2
    }

    let stokilacCikisDetay: StokIlacCikis[] = [];

    for (let item of this.ilacCikisList) {
      let stokilaccikis: StokIlacCikis = {
        ilacCikisId: 0,
        fk_StokKod: item.stok.fk_StokKod,
        adet:item.adet, 
        birimFiyat: item.birimFiyat, 
        fk_HastaId:item.hasta.id, 
        fk_IslemNo:0

      }
      stokilacCikisDetay.push(stokilaccikis);
    }
    this.stokCikisService.ilacCikisOnay(stokcikis, stokilacCikisDetay).subscribe(
      (res) => {
        this.responseStokCikis = res.data;
        this.snackBar.success("Kayıt Başarılı")
        this.loading = false;
      },
      (err) => {
        this.snackBar.error("Kayıt Başarısız")
        this.loading = false;
      }

    )
  }
}
