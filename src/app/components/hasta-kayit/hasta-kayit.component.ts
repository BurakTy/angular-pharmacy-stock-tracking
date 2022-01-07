import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { StokBirim } from 'src/app/models/Entity/stokBirim';
import { StokHasta } from 'src/app/models/Entity/stokHasta';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokHastaService } from 'src/app/services/stok-hasta.service';
import { StokSabitService } from 'src/app/services/stok-sabit.service';

@Component({
  selector: 'app-hasta-kayit',
  templateUrl: './hasta-kayit.component.html',
  styleUrls: ['./hasta-kayit.component.css']
})
export class HastaKayitComponent implements OnInit {

  displayedColumns = ['kimlikNo', 'adSoyad', 'cinsiyet', 'button'];
  stokHastas: StokHasta[] = [];
  currentHasta: StokHasta;
  @ViewChild(MatTable, { static: true }) table: MatTable<StokHasta>;
  @ViewChild('raf',{read:MatAutocompleteTrigger}) rafAuto:MatAutocompleteTrigger;
  stokHastaForm: FormGroup;
  birimler: StokBirim[] = [];
  birimlers: StokBirim[] = [];

  notFound = false;
  notFoundRaf = false;

  constructor(
    private stokSabitService: StokSabitService,
    private navService: NavService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private stokHastaService:StokHastaService,
  ) { }

  ngOnInit(): void {
    this.createstokHastaForm();
    this.getStokHasta();
    //this.getBirimler();
  }


  createstokHastaForm(){
    this.currentHasta= null;
    this.stokHastaForm = this.formBuilder.group({
      id: [null],
      kimlikNo: [''],
      kimlikNoGizli: [''],
      uyruk: [null],
      ad: [""],
      soyad: [""],
      yas:[null],
      cinsiyet:[""],
      girisTarih:[new Date(),Validators.required],
      cikisTarih:[null],
      kayitTarih:[null],
      isAktif:[null]
    });
  }

  getStokHasta(){
    this.stokHastaService.getStokHasta().subscribe((res) => {
      this.stokHastas = res.data;
    });
  }
  getStokHastaById(row:StokHasta){
    if (this.currentHasta != undefined && this.currentHasta.id != row.id) {
      // this.dataSource[row.position-1].select=true;
      // this.currentDepo.select = false;
      // row.select = true;
    }
    this.currentHasta = row;
    this.stokHastaForm.setValue(row);
  }

  // getBirimler() {
  //   return new Promise((resolve, rej) => {
  //     this.stokSabitService.getStokBirim()
  //     .toPromise().then(
  //       (res) => {
  //         this.birimler = res.data;
  //         this.birimlers = this.birimler;
  //         resolve(true);
  //       }
  //     )
  //   })
  // }


  // displayBirimFn(birimid: number): string {
  //   return birimid ? this.birimler.find(birim => birim.id === birimid).birimAdi.toLocaleUpperCase() : "";
  // }

  // searchByBirim(event: Event) {
  //   this.notFound = false;
  //   let filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
  //   this.birimlers = this.birimler.filter(option => option.birimAdi.toLowerCase().includes(filterValue));
  //   if (filterValue.length == 0) {
  //     this.birimlers = this.birimler
  //   } else {
  //     if (this.birimlers.length == 0) {
  //       this.notFound = true;
  //     }
  //   }

  // }

  stokHastaKaydet(update: boolean) {
    if (this.stokHastaForm.valid) {
      let stokHasta = Object.assign({}, this.stokHastaForm.value);
      this.stokHastaService.stokHastaKaydet(stokHasta, update).subscribe(
        (res) => {
          this.snackBar.success("Kayıt Başarılı");
          this.getStokHasta();
          this.getStokHastaById(stokHasta);
        },
        (err) => {
          console.log(err);
          this.snackBar.error("Kayıt Başarısız");
        }
      );
    } else {
      this.snackBar.error('Formunuz Eksik');
    }
  }
}
