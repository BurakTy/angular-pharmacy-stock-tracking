import { getLocaleId } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/models/Auth/userDetail';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  

  for = getLocaleId(this.locale);
  @Input() userDetail:UserDetail;
  
  constructor(private navService:NavService, 
    private router:Router,
    private authService:AuthServiceService,
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    this.navService.setUserInfo();
    this.userDetail=this.navService.getUserInfo();
    
  }

  toogleSideNav(){
    this.navService.toggle();
  }

  checkYetki(yetki?:string,anadepo:boolean=false){
   if(!this.userDetail.role){
      return false;
   }else{
      if(yetki){
        return anadepo?  this.userDetail.role.includes(yetki) && this.navService.getUserInfo().depoTip==1  : this.userDetail.role.includes(yetki) 
      }else{
        return this.userDetail.role.includes("admin") ||this.userDetail.role.includes("yetkiliKullanici");
      }
   }
  }

  logout(){
    localStorage.removeItem('token');
    window.location.reload();
    
    // this.authService.logout(this.userDetail.nameIdentifier).subscribe(
    //   (res) => {
    //     localStorage.removeItem('token');
    //     this.router.navigate(["/"]).then(() => {
    //      // window.location.reload();
    //     });
    //   },
    //   (err) => {
    //   })
  }
}
