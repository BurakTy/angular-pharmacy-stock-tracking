import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { StokBirim } from 'src/app/models/Entity/stokBirim';
import { StokKart } from 'src/app/models/Entity/stokKart';
import { StokRaf } from 'src/app/models/Entity/stokRaf';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokKartService } from 'src/app/services/stok-kart.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';

@Component({
  selector: 'app-stok-kart',
  templateUrl: './stok-kart.component.html',
  styleUrls: ['./stok-kart.component.css']
})
export class StokKartComponent implements OnInit {
  displayedColumns = ['barkodNo', 'stokAd', 'stokTur', 'anaBirim'];
  stokKarts: StokKart[] = [];
  currentKart: StokKart;
  @ViewChild(MatTable, { static: true }) table: MatTable<StokKart>;
  @ViewChild('auto') birimAuto:ElementRef;
  @ViewChild('raf',{read:MatAutocompleteTrigger}) rafAuto:MatAutocompleteTrigger;
  stokKartForm: FormGroup;
  birimler: StokBirim[] = [];
  birimlers: StokBirim[] = [];
  raflar: StokRaf[] = [];
  raflars: StokRaf[] = [];
  notFound = false;
  notFoundRaf = false;

  constructor(
    private stokKartService: StokKartService,
    private stokSabitService: StokSabitService,
    private navService: NavService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.createstokKartForm();
    this.getStokKart();
    this.getBirimler();
    this.getRafBilgi();

  }

  createstokKartForm() {
    this.currentKart = null;
    this.stokKartForm = this.formBuilder.group({
      stokKod: [null],
      stokAd: ['', Validators.required],
      stokTur: ['', Validators.required],
      grupKod: [null],
      anaBirim: ['', Validators.required],
      birim1: [null],
      birim1Adet: [null],
      barkodNo: ['', Validators.required],
      fk_Raf: [null],
      jenerikAdi: [null, Validators.required],
      atcKodu: [null, Validators.required],
      etkenMadde: [null, Validators.required],
    });
  }


  stokKartKaydet() {
    if (this.stokKartForm.valid) {
      let stokKart = Object.assign({}, this.stokKartForm.value);
      this.stokKartService.stokKaydet(stokKart).subscribe(
        (res) => {
          this.snackBar.success("Kayıt Başarılı");
          this.getStokKart();
          this.getStokKartById(stokKart);
        },
        (err) => {
          console.log(err);
          this.snackBar.error("Kayıt Başarısız");
        }
      );
    } else {
      this.snackBar.error("Eksik Form");
    }
  }

  stokKartGuncelle() {
    if (this.stokKartForm.valid) {
      let stokKart = Object.assign({}, this.stokKartForm.value);
      this.stokKartService.stokGuncelle(stokKart).subscribe(
        (res) => {
          this.snackBar.success("Kayıt Başarılı");
          this.getStokKart();
          this.getStokKartById(stokKart);
        },
        (err) => {
          console.log(err);
          this.snackBar.error("Kayıt Başarısız");
        }
      );
    } else {
      this.snackBar.error("Eksik Form");
    }
  }
  getStokKart() {
    this.stokKartService.getStok().subscribe((res) => {
      this.stokKarts = res.data;

    });

  }

  getStokKartById(row: StokKart) {
    if (this.currentKart != undefined && this.currentKart.stokKod != row.stokKod) { }
    this.currentKart = row;
    this.stokKartForm.setValue(row);
  }

  getBirimler() {
    return new Promise((resolve, rej) => {
      this.stokSabitService.getStokBirim()
      .toPromise().then(
        (res) => {
          this.birimler = res.data;
          this.birimlers = this.birimler;
          resolve(true);
        }
      )
    })
  }


  displayBirimFn(birimid: number): string {
    return birimid ? this.birimler.find(birim => birim.id === birimid).birimAdi.toLocaleUpperCase() : "";
  }

  searchByBirim(event: Event) {
    this.notFound = false;
    let filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.birimlers = this.birimler.filter(option => option.birimAdi.toLowerCase().includes(filterValue));
    if (filterValue.length == 0) {
      this.birimlers = this.birimler
    } else {
      if (this.birimlers.length == 0) {
        this.notFound = true;
      }
    }

  }

  AddBirim() {
    let birimAdi = this.stokKartForm.controls['anaBirim'].value;
    let yeniBirim: StokBirim = {
      birimAdi: birimAdi,
      id: 0,
      isAktif: true,
      kisaltma: birimAdi
    }
    this.stokSabitService.addStokBirim(yeniBirim).subscribe(
      (res) => {
        this.getBirimler().then(res=>{
          this.stokKartForm.controls["anaBirim"].setValue(this.birimler.find(x => x.birimAdi == birimAdi).id);
          this.notFound=false;
          setTimeout(()=>{
            this.birimAuto.nativeElement.blur();
          },500)
         
        }).catch(err=>{
          this.snackBar.error("Birim Seçilemedi Elle Seçiniz");
        });
      }
    )
  }

  getRafBilgi() {
    return new Promise((resolve, rej) => {
      this.stokSabitService.getStokRaf(parseInt(this.navService.getUserInfo().fkDepo.toString()))
        .toPromise().then(
          res => {
            this.raflar = res.data;
            this.raflars = this.raflar;
            resolve(true);
          }
        )
    })
  }

  AddRafBilgi() {
    let rafAciklama = this.stokKartForm.controls['fk_Raf'].value;
    let yeniRaf: StokRaf = {
      rafId: 0,
      fk_Depo: parseInt(this.navService.getUserInfo().fkDepo.toString()),
      aciklama: rafAciklama
    }
    this.stokSabitService.addStokRaf(yeniRaf).subscribe(
      (res) => {
        this.getRafBilgi()
          .then(res => {
            this.stokKartForm.controls["fk_Raf"].setValue(this.raflar.find(x => x.aciklama == rafAciklama).rafId);
            this.notFoundRaf=false;
          })
          .catch(err=>{
            this.snackBar.error("Raf Bilgi Seçilemedi Elle Seçiniz");
          });
         
      }
      
    )
  }
  searchByRaf(event: Event) {
    this.notFoundRaf = false;
    let filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.raflars = this.raflar.filter(option => option.aciklama.toLowerCase().includes(filterValue));
    if (filterValue.length == 0) {
      this.raflars = this.raflar
    } else {
      if (this.raflars.length == 0) {
        this.notFoundRaf = true;
      }
    }
  }

  displayRafFn(rafbilgi: number): string {
    return rafbilgi ? this.raflar.find(raf => raf.rafId === rafbilgi).aciklama.toLocaleUpperCase() : "";
  }


  getbilgler() {
    let stokKart: StokKart = Object.assign({}, this.stokKartForm.value);
    if (!Number(stokKart.fk_Raf)) {
      this.snackBar.error("Raf Bilgi Tekrar Seçiniz");
    }   
  }

  getbirimName(id:number){
    let birim= this.birimler.find(x=>x.id==id);
    return birim!=null?birim.birimAdi.toLocaleUpperCase():"";
  }
}
