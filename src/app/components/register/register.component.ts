import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validator, Validators } from '@angular/forms';
import { RegisterModel } from 'src/app/models/Auth/registerModel';
import { StokDepo } from 'src/app/models/Entity/stokDepo';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NavService } from 'src/app/services/nav.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StokDepoService } from 'src/app/services/stok-depo.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  depolar: StokDepo[] = [];
  hide: boolean = true;
  loading: boolean = false;

  hideRequiredControl = new FormControl(false);
  constructor(
    private formBuilder: FormBuilder,
    private stokDepoService: StokDepoService,
    private navService: NavService,
    private authService: AuthServiceService,
    private snackBarService:SnackbarService
  ) { }

  ngOnInit(): void {
    this.navService.yonlendirme();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      fk_Depo: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required/*,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')*/],
      istek:[true],
      onay:[false],
      hastaKayit:[false],
      ilacCikis:[false],
      stokGiris:[{value:false,disabled:true}],
      kullaniciEkle:[false]
    });
    this.getDepo();
  }

  getDepo() {
    this.stokDepoService.getStokDepo().subscribe(
      (res) => {
        this.depolar = res.data;
      }
    )
  }

  register() {
    this.loading = true;
    let user = Object.assign({}, this.registerForm.value);
    let reg:RegisterModel={
        email:user.email,
        firstName:user.firstName,
        fk_Depo:user.fk_Depo,
        lastName:user.lastName,
        password:user.password,
        fk_User:parseInt(this.navService.getUserInfo().nameIdentifier.toString()),
        claims:[]
    }
    this.pushYetki(reg);

    this.authService.register(reg).subscribe(
      (res) => {
        this.loading = false;
        this.snackBarService.success("Kullanıcı oluşturuldu")
      },
      (err) => {
        this.loading = false;
        this.snackBarService.error("Kullanıcı oluşturma başarısız")
      }
    )
    
  }

  randomPass(): void {
    let pass = '';
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let number = "0123456789";
    let symbol = "!&_@#$.-*"

    for (let i = 1; i <= 2; i++) {
      let char = Math.floor(Math.random()
        * upper.length + 1);

      pass += upper.charAt(char)

      char = Math.floor(Math.random()
        * lower.length + 1);

      pass += lower.charAt(char)

      char = Math.floor(Math.random()
        * number.length + 1);

      pass += number.charAt(char)

      char = Math.floor(Math.random()
        * symbol.length + 1);

      pass += symbol.charAt(char)

    }

    let a = pass.split(""),
      n = a.length;

    for (var i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    console.log(this.registerForm.controls['password'].value);
    this.registerForm.controls['password'].setValue(a.join("").toString());
  }

  updateYetki(){
    let value=this.registerForm.get('fk_Depo')?.value;
    let birim=this.depolar.find(x=>x.kod==value);
    if(birim){
      let stokgris=this.registerForm.get('stokGiris');
      if(birim.depoTip==1){
        stokgris.enable();
      }else{
       stokgris.setValue(false);
       stokgris.disable();
      }
    }
    
  }
  pushYetki(reg:RegisterModel){
    let user = Object.assign({}, this.registerForm.value);
    user.istek?reg.claims.push(4):false;
    user.onay?reg.claims.push(3):false;
    user.stokGiris?reg.claims.push(5):false;
    user.kullaniciEkle?reg.claims.push(6):false;
    user.hastaKayit?reg.claims.push(8):false;
    user.ilacCikis?reg.claims.push(9):false;
  }

}
