import { getLocaleId } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

@Component({
  selector: 'app-path-not-found-component',
  templateUrl: './path-not-found-component.component.html',
  styleUrls: ['./path-not-found-component.component.css']
})
export class PathNotFoundComponentComponent implements OnInit {
  for = getLocaleId(this.locale);
  constructor( @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
  }

}
