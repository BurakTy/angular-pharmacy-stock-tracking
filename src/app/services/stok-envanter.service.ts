
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ResponseModel } from '../models/Response/responseModel';
import { StokEnvanterDto } from '../models/Dto/stokEnvanterDto';
import { environment } from '../../environments/environment';
import { StokKart } from '../models/Entity/stokKart';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { AddStokEnvanterDto } from '../models/Dto/addStokEnvanterDto';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';
import { StokFatura } from '../models/Entity/stokFatura';


@Injectable({
  providedIn: 'root'
})
export class StokEnvanterService {

  apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient
    ) { }


  envanterAdd(addStokEnvanterDto: AddStokEnvanterDto): Observable<SingleResponseModel<number>> {
    let newUrl = this.apiUrl + 'stokenvanter/add';
    return this.httpClient.post<SingleResponseModel<number>>(newUrl,addStokEnvanterDto);
  }


  searchStokByName(name: string,fkDepo?:number): Observable<ListResponseModel<StokEnvanterDto>> {
    let newUrl=this.apiUrl+"stokenvanter/getstokbyname";
    let params = new HttpParams()
      .set('name', name)
      .set('fkDepo', fkDepo)
    return this.httpClient.get<ListResponseModel<StokEnvanterDto>>(newUrl,{params:params});
  }

  searchStokByBarkod(barkod: string): Observable<ListResponseModel<StokKart>> {
    let newUrl=this.apiUrl+"stokenvanter/getstokbybarkod";
    let params = new HttpParams().set('barkod', barkod);
    return this.httpClient.get<ListResponseModel<StokKart>>(newUrl,{params:params});
  }

  getPastFaturaByTarih(min: string, max: string, fkDepo?: number): Observable<ListResponseModel<StokFatura>> {
    let newUrl = this.apiUrl + "stokenvanter/getfaturabytarih";
    let params = new HttpParams()
      .set('fkDepo', fkDepo)
      .set('min', min)
      .set('max', max);
    return this.httpClient.get<ListResponseModel<StokFatura>>(newUrl, { params: params });
  }

}
