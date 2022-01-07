import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { ResponseModel } from '../models/Response/responseModel';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';
import { StokDepo } from '../models/Entity/stokDepo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class StokDepoService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getStokDepo(): Observable<ListResponseModel<StokDepo>> {
    let newUrl = this.apiUrl + "stokdepo/getall";
    return this.httpClient.get<ListResponseModel<StokDepo>>(newUrl);
  }

  getStokDepoTalepAktif(): Observable<ListResponseModel<StokDepo>> {
    let newUrl = this.apiUrl + "stokdepo/getalltalepaktif";
    return this.httpClient.get<ListResponseModel<StokDepo>>(newUrl);
  }

  searchStokDepoByName(depoName: string): Observable<ListResponseModel<StokDepo>> {
    let newUrl = this.apiUrl + "stokdepo/getbyname";
    return this.httpClient.post<ListResponseModel<StokDepo>>(newUrl, depoName);
  }

  searchStokDepoByDepoTip(depoTip: number): Observable<ListResponseModel<StokDepo>> {
    let newUrl = this.apiUrl + "stokdepo/searchdepobydepotip";
    return this.httpClient.post<ListResponseModel<StokDepo>>(newUrl, depoTip);
  }

  getStokDepoById(kod: number): Observable<SingleResponseModel<StokDepo>> {
    let newUrl = this.apiUrl + "stokdepo/getbykod";
    return this.httpClient.post<SingleResponseModel<StokDepo>>(newUrl, kod);
  }

  stokDepoKaydet(stokdepo: StokDepo, update: boolean): Observable<ResponseModel> {
    if (update) {
      let newUrl = this.apiUrl + 'stokdepo/update';
      return this.httpClient.post<ResponseModel>(newUrl, stokdepo);
    } else {
      let newUrl = this.apiUrl + 'stokdepo/add';
      return this.httpClient.post<ResponseModel>(newUrl, stokdepo);
    }
  }

}
