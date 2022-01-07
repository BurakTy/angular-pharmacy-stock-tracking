import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { StokDepo } from 'src/app/models/Entity/stokDepo';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokDepoService } from 'src/app/services/stok-depo.service';

@Component({
  selector: 'app-stok-depo',
  templateUrl: './stok-depo.component.html',
  styleUrls: ['./stok-depo.component.css'],
})
export class StokDepoComponent implements OnInit {
  displayedColumns = ['kod', 'aciklama', 'depoTip', 'yil', 'talepAktif','fk_StokTur'];
  stokDepos: StokDepo[];
  currentDepo: StokDepo;
  @ViewChild(MatTable, { static: true }) table: MatTable<StokDepo>;
  stokDepoForm: FormGroup;

  constructor(
    private stokDepoService: StokDepoService,
    private snackBar:SnackbarService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createstokDepoForm();
    this.getStokDepo();
  }

  createstokDepoForm() {
    this.currentDepo = null;
    let year = new Date().getFullYear();
    this.stokDepoForm = this.formBuilder.group({
      kod: [null],
      aciklama: ['', Validators.required],
      depoTip: ['1', Validators.required],
      yil: [year, Validators.required],
      talepAktif: ['E', Validators.required],
      fk_StokTur:[1]
    });
  }

  updateTalepAktif() {
    if (this.stokDepoForm.get('depoTip')?.value == 1) {
      this.stokDepoForm.get('talepAktif')?.setValue('E');
    } else {
      this.stokDepoForm.get('talepAktif')?.setValue('H');
    }
  }

  stokDepoKaydet(update: boolean) {
    if (this.stokDepoForm.valid) {
      let stokDepo = Object.assign({}, this.stokDepoForm.value);
      this.stokDepoService.stokDepoKaydet(stokDepo, update).subscribe(
        (res) => {
          this.snackBar.success("Kayıt Başarılı");
          this.getStokDepo();
          this.getStokDepoById(stokDepo);
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

  getStokDepo() {
    this.stokDepoService.getStokDepo().subscribe((res) => {
      this.stokDepos = res.data;
    });

  }

  getStokDepoById(row: StokDepo) {
    if (this.currentDepo != undefined && this.currentDepo.kod != row.kod) {
      // this.dataSource[row.position-1].select=true;
      // this.currentDepo.select = false;
      // row.select = true;
    }
    this.currentDepo = row;
    this.stokDepoForm.setValue(row);
    console.log(row);
  }
}
