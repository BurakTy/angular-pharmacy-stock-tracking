import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { StokKart } from '../models/Entity/stokKart';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { ResponseModel } from '../models/Response/responseModel';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class StokKartService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getStok(): Observable<ListResponseModel<StokKart>> {
    let newUrl = this.apiUrl + "stokkart/getall";
    return this.httpClient.get<ListResponseModel<StokKart>>(newUrl);
  }

  searchStokByName(name: string): Observable<ListResponseModel<StokKart>> {
    let newUrl=this.apiUrl+"stokkart/getbyname";
    let params = new HttpParams().set('name', name);
    return this.httpClient.get<ListResponseModel<StokKart>>(newUrl,{params:params});
  }

  searchStokByBarkod(barkod: string): Observable<ListResponseModel<StokKart>> {
    let newUrl=this.apiUrl+"stokkart/getbybarkod";
    let params = new HttpParams().set('barkod', barkod);
    return this.httpClient.get<ListResponseModel<StokKart>>(newUrl,{params:params});
  }


  getStokById(stokdepo: StokKart): Observable<SingleResponseModel<StokKart>> {
    let newUrl = this.apiUrl + "stokkart/getbykod";
    let params = new HttpParams().set('id', stokdepo.stokKod);
    return this.httpClient.get<SingleResponseModel<StokKart>>(newUrl,{params:params});
  }

  stokKaydet(stokKart: StokKart): Observable<ResponseModel> {
    let newUrl = this.apiUrl + 'stokkart/add';
    return this.httpClient.post<ResponseModel>(newUrl, stokKart);
  }

  stokGuncelle(stokKart: StokKart): Observable<ResponseModel> {
    let newUrl = this.apiUrl + 'stokkart/update';
    return this.httpClient.post<ResponseModel>(newUrl, stokKart);
  }
}
