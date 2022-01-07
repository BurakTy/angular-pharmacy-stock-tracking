import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StokHasta } from '../models/Entity/stokHasta';
import { ResponseModel } from '../models/Response/responseModel';
import { environment } from '../../environments/environment';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';


@Injectable({
  providedIn: 'root'
})
export class StokHastaService {

  apiUrl = environment.apiUrl;
  constructor(
    private httpClient:HttpClient
  ) { }


  stokHastaKaydet(stokHasta:StokHasta,update:boolean) :Observable<ResponseModel> {
    if (update) {
      let newUrl = this.apiUrl + 'stokhasta/update';
      return this.httpClient.post<ResponseModel>(newUrl, stokHasta);
    } else {
      stokHasta.KayitTarih=new Date();
      stokHasta.isAktif=true;
      let newUrl = this.apiUrl + 'stokhasta/add';
      return this.httpClient.post<ResponseModel>(newUrl, stokHasta);
    }
  }

  getStokHasta(): Observable<ListResponseModel<StokHasta>> {
    let newUrl = this.apiUrl + "stokhasta/getall";
    return this.httpClient.get<ListResponseModel<StokHasta>>(newUrl);
  }

  getStokHastaById(kod: number): Observable<SingleResponseModel<StokHasta>> {
    let newUrl = this.apiUrl + "stokhasta/getbyid";
    let params = new HttpParams().set('kod', kod);
    return this.httpClient.post<SingleResponseModel<StokHasta>>(newUrl, {params:params});
  }

 
  searchStokHastaByName(name: string): Observable<ListResponseModel<StokHasta>> {
    let newUrl = this.apiUrl + "stokhasta/getbyname";
    let params = new HttpParams().set('name', name);
    return this.httpClient.get<ListResponseModel<StokHasta>>(newUrl,{params:params});
  }

}
