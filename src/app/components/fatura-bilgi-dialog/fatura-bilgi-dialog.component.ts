import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { StokFatura } from 'src/app/models/Entity/stokFatura';

@Component({
  selector: 'app-fatura-bilgi-dialog',
  templateUrl: './fatura-bilgi-dialog.component.html',
  styleUrls: ['./fatura-bilgi-dialog.component.css']
})
export class FaturaBilgiDialogComponent implements OnInit {

  faturaForm:FormGroup;
  fatura = new EventEmitter<StokFatura>()
  constructor(
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.createFaturaForm();
  }

  createFaturaForm(){
    this.faturaForm=this.formBuilder.group({
        faturaNo:["",Validators.required],
        faturaTarih:[new Date(),Validators.required],
        bakanlikOnayNo:[""],
        bakanlikProtokolNo:[""],
        ihaleNo:[""],
        gelenBilgiUnvan:["",Validators.required],
        gelenFaturaNo:["",Validators.required],
        gelenFaturaTarih:[new Date(),Validators.required],
    })
  }

  faturaOnayla(){
    let faturaBilgi:StokFatura=Object.assign({},this.faturaForm.value)
    this.fatura.emit(faturaBilgi);
  }

}
