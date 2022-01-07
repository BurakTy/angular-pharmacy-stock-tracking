import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('drawer') public sidenav: MatSidenav;
  
  constructor(private navService:NavService){}

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.navService.setSidenav(this.sidenav);
  }

}
