import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UserDetail } from '../models/Auth/userDetail';


@Injectable({
  providedIn: 'root',
})
export class NavService {
  constructor(private router: Router) { }

  private sidenav: MatSidenav;
  private userDetail: UserDetail;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav.open();
  }

  public close() {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }

  public setUserInfo() {
    let token = localStorage.getItem('token');
    let tok = decodeURIComponent(escape(atob(token.split(".")[1])));
    this.userDetail = JSON.parse(tok);
  }

  public getUserInfo(): UserDetail {
    return this.userDetail;
  }

  public yonlendirme() {
    if (this.userDetail.role) {
      if (this.userDetail.role.includes("admin") || this.userDetail.role.includes("yetkiliKullanici")){
      } else if (this.userDetail.role.includes("onay")) {
        this.router.navigateByUrl("/");
      } else if (this.userDetail.role.includes("istek")) {
        this.router.navigateByUrl("stokcikis");
      } else if (this.userDetail.role.includes("stokgiris")) {
        this.router.navigateByUrl("stokdepo");
      } else {
        this.router.navigateByUrl("emty");
      }
    } else {
      this.router.navigateByUrl("emty");
    }
  }

}
