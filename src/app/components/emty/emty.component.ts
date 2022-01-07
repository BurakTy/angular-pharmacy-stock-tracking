import { getLocaleId } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

@Component({
  selector: 'app-emty',
  templateUrl: './emty.component.html',
  styleUrls: ['./emty.component.css']
})
export class EmtyComponent implements OnInit {
  for = getLocaleId(this.locale);
  constructor( @Inject(LOCALE_ID) public locale: string) { }


  ngOnInit(): void {
  }

}
